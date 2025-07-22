// catalogService.js
const axios = require("axios")
const region = require("./marketplaceid.json")
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const SellingPartnerAPI = require('amazon-sp-api');
const db = require('../database');                       // your db helper
const COLLECTIONS = require('../database/mongo/collections');   // your constants file
const nconf = require("nconf")
const  Bottleneck = require("bottleneck");

const spapi = module.exports

const sp = nconf.get("sp");
// 1) Assume your IAM role and return temporary AWS credentials
async function getTemporaryCredentials() {
    const sts = new STSClient({ region: process.env.AWS_REGION || 'us-east-1' });
    const cmd = new AssumeRoleCommand({
        RoleArn: process.env.AWS_SELLING_PARTNER_ROLE,  // when we will create the role
        RoleSessionName: 'SPAPISession',
    });
    const { Credentials } = await sts.send(cmd);
    return {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
    };
}

// 2) Create and return an initialized SP-API client
async function createSPAPIClient(refreshToken) {
    const awsCreds = await getTemporaryCredentials();
    return new SellingPartnerAPI({
        region: 'us-east-1'  ||'na',   //region of the aws account
        credentials: {
            accessKeyId: awsCreds.accessKeyId,
            secretAccessKey: awsCreds.secretAccessKey,
            sessionToken: awsCreds.sessionToken,
            stsRegion: process.env.AWS_REGION || 'us-east-1',
        },
        refresh_token:refreshToken, // client token when client authorize the app
        clientId: process.env.LWA_CLIENT_ID || sp.LWA_CLIENT_ID,     //app id
        clientSecret: process.env.LWA_CLIENT_SECRET || sp.LWA_CLIENT_SECRET, // app secrete
    });
}

// 3) Fetch catalog data and persist
spapi.fetchCatalogData = async (asin) => {
    try {
        // const asin=B07N4M94X4
        const sellerData = await db.findOne({
            asins: {
                $elemMatch: { asin: "B07N4M94X4" }
            }
        }, COLLECTIONS.SELLERS)
        const refresh_token = sellerData[0].refreshToken
        const object = sellerData[0].asins.filter(data => data.asin === "B07N4M94X4")
        const marketplaceId = object[0].marketplaceId
        // const sp = await createSPAPIClient(refresh_token,marketplaceId);

        // Catalog Items call
        // const { items } = await sp.callAPI({
        //   name: 'getCatalogItem',
        //   path: { asin },
        //   query: {
        //     marketplaceIds: [ process.env.MARKETPLACE_ID || 'ATVPDKIKX0DER' ],
        //     includedData:   ['attributes','images','summaries']
        //   }
        // });


        console.log("sellerData -->", sellerData,"market placeid -->",object);  // replace this call with sp-api
        const pdata = await axios.get("https://api.jsonbin.io/v3/b/685d4b808960c979a5b1dec6")
        // console.log("data of the product -->", JSON.parse(pdata.data.record))
        const {
            asin,
            attributes,
            classifications,
            dimensions,
            identifiers,
            images,
            productTypes,
            salesRanks,
            summaries,
            relationships,
            vendorDetails
        } = pdata.data.record;

        // Extract fields
        const bullet_point = attributes.bullet_point || {};
        const newimages = (images[0]?.images || []).map(img => img.link);
        const bulletPoints = bullet_point.map(bp => bp.value);
        const title = attributes.item_name?.[0]?.value
            || item.summaries?.[0]?.itemName
            || '';
        const description = attributes.feature_description?.[0]?.value || '';

        // Build payloads
        const data = { title, images: newimages, bullet_points: bulletPoints, description };
        const date = new Date().toISOString().slice(0, 10);
        const brand = attributes.brand?.[0]?.value
            || item.summaries?.[0]?.brand
            || '';
        const link = `https://www.amazon.in/dp/${asin}`;

        const product_data = {
            asin,
            brand,
            link,
            data,
            date
        };

        console.log(asin,
            brand,
            link,
            data,
            date)
        // Persist
        await db.setObject(`product:${asin}`, product_data, COLLECTIONS.ASINS);

        return { data, metaData: { asin, brand, date, link ,last_updated: new Date().toISOString(),} };
    }
    catch (err) {
        console.error(`Error fetching SP-API catalog for ${asin}:`, err);
        throw err;
    }
}



// 2. Single in-memory limiter for Inventory API (~10 calls/sec)
const inventoryLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime:       100,   // 100 ms between calls → ~10 req/sec
});

// 3. Helper: wrap client.callAPI with retry/back-off
async function safeInventoryCall(params,refreshToken) {
  let attempt = 0;
  while (true) {
    try {

      const sp = await createSPAPIClient(refreshToken);
      return await sp.callAPI({
        operation: 'getInventorySummaries',
        path:      {},
        query:     params,
      });
    } catch (err) {
      if (err.statusCode === 429 || err.statusCode === 503) {
        const delay = Math.min(2 ** attempt * 1000, 60000);
        console.warn(`Throttled (status ${err.statusCode}), retrying in ${delay} ms…`);
        await new Promise(r => setTimeout(r, delay));
        attempt++;
      } else {
        throw err;
      }
    }
  }
}

// 4. Fetch ASINs for a single marketplace
async function fetchAsinsForMarketplace(marketplaceId,refreshToken) {
  const asins = new Set();
  let nextToken = null;

  do {
    const query = {
      marketplaceIds:     [marketplaceId],
      granularityType:    'Marketplace',
      granularityId:      marketplaceId,
      maxResultsPerPage:  100,
      nextToken,
    };

    // schedule through limiter
    const resp = await inventoryLimiter.schedule(() =>
      safeInventoryCall(query,refreshToken)
    );

    for (const summ of resp.summaries || []) {
      if (summ.asin) asins.add(summ.asin);
    }
    nextToken = resp.nextToken;
  } while (nextToken);

  //this asin is in set format
  return asins;
}

// 5. Aggregate ASINs across all marketplaces in parallel
async function fetchAllAsins(marketplaceIds,refreshToken) {
  // map each marketplace to its Set of ASINs
  const fetched = await Promise.all(
    marketplaceIds.map(id =>
      fetchAsinsForMarketplace(id,refreshToken)
        .then(asins => ({ marketplaceId: id, asins }))
    )
  );

  const pairs = [];
  for (const { marketplaceId, asins } of fetched) {
    for (const asin of asins) {
      pairs.push({ asin, marketplaceId });
    }
  }
  return pairs;

}

// 6. Example usage
spapi.getAllAsins = async (data) => {
  try {

    // need to call the function to get all marketplaceIds
    
    // const marketplaceIds = [
    //   'A21TJRUUN4KGV', // India
    //   'ATVPDKIKX0DER', // US
    //   // add your other IDs… 
    // ];
    const marketplaceIds = await listMarketplaces(data.refreshToken)
    const allAsins = await fetchAllAsins(marketplaceIds,data.refreshToken);
    // save this data

    const dbData = {
      refreshToken:data.refreshToken,
      sellerId:data.sellerId,
      asins:allAsins
    }
 
    await db.setObject(`_key:${data.sellerId}`,dbData,COLLECTIONS.SELLERS)
    return
  } catch (err) {
    console.error('Error fetching ASINs:', err);
  }
};


// get all market participation
async function listMarketplaces(refreshToken) {
  try {
    const client = await createSPAPIClient(refreshToken)
    const response = await client.callAPI({
      operation: 'getMarketplaceParticipations',
      // no path or query params required
    });

    // The raw API response lives in `response.payload`
    // It contains two arrays: participations[] and marketplaceParticipations[]
    const mkps = response.payload.marketplaceParticipations;

    // Extract just the Marketplace IDs
    const marketplaceIds = mkps.map(item => item.marketplace.id);

    console.log('Registered Marketplaces:', marketplaceIds);
    return marketplaceIds;

  } catch (err) {
    console.error('Error fetching marketplace participations:', err);
    throw err;
  }
}