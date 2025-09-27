// catalogService.js
const axios = require("axios")
const aws4 = require("aws4")
const region = require("./marketplaceid.json")
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const SellingPartnerAPI = require('amazon-sp-api');
const db = require('../database');                       // your db helper
const COLLECTIONS = require('../database/mongo/collections');   // your constants file
const nconf = require("nconf")
const Bottleneck = require("bottleneck");

const spapi = module.exports

const sp = nconf.get("sp");
// 1) Assume your IAM role and return temporary AWS credentials
async function getTemporaryCredentials() {
  const sts = new STSClient({ region: sp.AWS_REGION || 'us-east-1' });
  console.log("sts from the spapi.j  getTempcred --->", sts)
  const cmd = new AssumeRoleCommand({
    RoleArn: sp.AWS_SELLING_PARTNER_ROLE,  // when we will create the role
    RoleSessionName: 'SPAPISession',
  });

  console.log("cmd from the spapi.j  getTempcred --->", cmd)
  const { Credentials } = await sts.send(cmd);
  console.log("Credentials from the spapi.js  getTempcred --->", Credentials)

  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
  };
}

// 2) Create and return an initialized SP-API client
async function createSPAPIClient(refreshToken) {
  // const awsCreds = await getTemporaryCredentials();
  console.log("the refreshToken from the createSPAPIClient -->", refreshToken)
  const awsCreds = {}
  console.log("aws creds from spapi.js getTempcred", awsCreds)
  return new SellingPartnerAPI({
    region: 'na',   //region of the aws account   ./nodebb restart
    refresh_token: refreshToken, // client token when client authorize the app
    // options: {
    //   use_sandbox: true, // tells library to use sandbox
    // },
    credentials: {

      SELLING_PARTNER_APP_CLIENT_ID: sp.lwa_client_id,     //app id
      SELLING_PARTNER_APP_CLIENT_SECRET: sp.lwa_client_secret, // app secrete

      accessKeyId: sp.aws_access_key_id || awsCreds.accessKeyId,
      secretAccessKey: sp.aws_access_secrete_key || awsCreds.secretAccessKey,
      // sessionToken: awsCreds.sessionToken,
      stsRegion: process.env.AWS_REGION || 'us-east-1',
      // sandbox: true,

    },


  });
}

// 3) Fetch fetchCatalogData data and persist
spapi.getAsinData = async (asin,marketplaceId) => {
  try {
    console.log("I am inside the get asin data");

    // 1. Get the LWA access token
    const credentials = {
      accessKeyId: sp.aws_access_key_id,
      secretAccessKey: sp.aws_access_secrete_key,
      // sessionToken: process.env.AWS_SESSION_TOKEN // optional
    };

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", sp.LWA_REFRESH_TOKEN);
    params.append("client_id", sp.lwa_client_id);
    params.append("client_secret", sp.lwa_client_secret);

    const tokenResp = await axios.post(
      "https://api.amazon.com/auth/o2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResp.data.access_token;
    // console.log("Access Token:", accessToken);

    // 2. Setup to call getCatalogItem
    const region = "us-east-1"; // NA region
    // const host = "sandbox.sellingpartnerapi-na.amazon.com";
    const host = "sellingpartnerapi-na.amazon.com";
    const path = `/catalog/2022-04-01/items/${asin}`;

    const query = `?marketplaceIds=${marketplaceId}&includedData=classifications,dimensions,identifiers,images,productTypes,relationships,salesRanks,summaries,vendorDetails`;

    // 3. Prepare request options for aws4
    const opts = {
      host,
      path: path + query,
      method: "GET",
      service: "execute-api",
      region,
      headers: {
        "Content-Type": "application/json",
        "x-amz-access-token": accessToken,
        "user-agent": "YourAppName/1.0"
      },
    };

    aws4.sign(opts, credentials);

    // 4. Make request via axios
    const url = `https://${host}${path + query}`;
    const axiosConfig = {
      url: url,
      method: opts.method,
      headers: opts.headers,
    };

    const res = await axios(axiosConfig);
    console.log("Response:", res.data);
    return res.data;

  } catch (err) {
    console.error("Error while calling the catalog API -->", err.response?.data || err.message);
    throw err;
  }
};

//fetch catalog data with axios

// spapi.getAsinData = async () => {
//   try {

//     console.log("I am inside the get asin data")
//     const credentials = {
//       accessKeyId: sp.AWS_ACCESS_KEY_ID,
//       secretAccessKey: sp.AWS_ACCESS_SECRETE_KEY,
//       // sessionToken: process.env.AWS_SESSION_TOKEN // optional
//     };

//     const params = new URLSearchParams();
//     params.append("grant_type", "refresh_token");
//     params.append("refresh_token", sp.LWA_REFRESH_TOKEN);
//     params.append("client_id", sp.LWA_CLIENT_ID);
//     params.append("client_secret", sp.LWA_CLIENT_SECRET);

//     const response = await axios.post(
//       "https://api.amazon.com/auth/o2/token",
//       params,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log("Access Token:", response.data.access_token);


//     // console.log("These are the credentials of the aws -->", credentials)

//     const region = "us-east-1"; // NA region
//     const host = "sandbox.sellingpartnerapi-na.amazon.com";
//     const path = "/catalog/2022-04-01/items";

//     const query = `?keywords=samsung,tv&marketplaceIds=ATVPDKIKX0DER&includedData=classifications,dimensions,identifiers,images,productTypes,relationships,salesRanks,summaries,vendorDetails`;

//     // console.log("These are the credentials of the aws -->",)
//     // Request object for aws4
//     const opts = {
//       host,
//       path: path + query,
//       method: "GET",
//       service: "execute-api",
//       region,
//       headers: {
//         "Content-Type": "application/json",
//         "x-amz-access-token": response.data.access_token
//       },

//     };

//     // console.log("These are the opt of the aws4 -->", opts)
//     // Sign request
//     aws4.sign(opts, credentials);

//     // console.log("i in the aws4 sign method")
//     // Axios config
//     const axiosConfig = {
//       url: `https://${host}${path + query}`,
//       method: opts.method,
//       headers: opts.headers,
//       // httpsAgent: new https.Agent({ keepAlive: true }) // avoid socket issues
//     };

//     try {
//       const res = await axios(axiosConfig);
//       console.log("Response:", res.data);

//       return res.data;

//     } catch (err) {
//       console.log("error while calling the catalog api -->", err)
//       console.error("Error:", err.response?.data || err.message);
//     }
//   }
//   catch (error) {
//     console.log("Error while fetching the catalog data")
//   }
// }


// 2. Single in-memory limiter for Inventory API (~10 calls/sec)
const inventoryLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,   // 100 ms between calls → ~10 req/sec
});

// 3. Helper: wrap client.callAPI with retry/back-off
async function safeInventoryCall(params, refreshToken) {
  let attempt = 0;
  while (true) {
    try {

      const sp = await createSPAPIClient(refreshToken);
      return await sp.callAPI({
        operation: 'getInventorySummaries',
        endpoint: "fbaInventory",   // ✅ correct endpoint  // 👈 required
        path: {},
        query: params,
        // query: {
        //   details: true,
        //   marketplaceIds: ["ATVPDKIKX0DER"],   // ✅ must use sandbox mock ID
        //   granularityType: "Marketplace",      // ✅ required
        //   granularityId: "ATVPDKIKX0DER"       // ✅ must match marketplaceId
        // },
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
async function fetchAsinsForMarketplace(marketplaceId, refreshToken) {
  const asins = new Set();
  let nextToken = null;

  console.log("i am inside the fetchAsinsForMarketplace ")
  do {
    const query = {
      marketplaceIds: [marketplaceId],
      granularityType: 'Marketplace',
      granularityId: marketplaceId,
      maxResultsPerPage: 100,
      nextToken,
    };

    // schedule through limiter
    const resp = await inventoryLimiter.schedule(() =>
      safeInventoryCall(query, refreshToken)
    );

    console.log("I am inside the safeinventory call 202-->", resp)
    for (const summ of resp.summaries || []) {
      if (summ.asin) asins.add(summ.asin);
    }
    nextToken = resp.nextToken;
  } while (nextToken);

  //this asin is in set format
  return asins;
}

// 5. Aggregate ASINs across all marketplaces in parallel
async function fetchAllAsins(marketplaceIds, refreshToken) {
  // map each marketplace to its Set of ASINs

  console.log("i am inside the fetchallasins ")
  const fetched = await Promise.all(
    marketplaceIds.map(id =>
      fetchAsinsForMarketplace(id, refreshToken)
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

    console.log("Entered in the getAllAsin function ")
    const marketplaceIds = await listMarketplaces(data.refreshToken)

    console.log("the response of the markeplaceId -->", marketplaceIds)

    const allAsins = await fetchAllAsins(marketplaceIds, data.refreshToken);
    // save this data

    const dbData = {
      refreshToken: data.refreshToken,
      sellerId: data.sellerId,
      asins: allAsins
    }

    await db.setObject(`_key:${data.sellerId}`, dbData, COLLECTIONS.SELLERS)
    return
  } catch (err) {
    console.error('Error fetching ASINs:', err);
  }
};


// get all market participation
async function listMarketplaces(refreshToken) {
  try {


    const client = await createSPAPIClient(refreshToken)

    console.log("client from listMarketplaces--->", client)

    const response = await client.callAPI({
      operation: 'getMarketplaceParticipations',
      endpoint: 'sellers'   // 👈 required
      // no path or query params required
    });

    console.log("respons of the sp-api getMarketplaceparticipation -->", response)

    // The raw API response lives in `response.payload`
    // It contains two arrays: participations[] and marketplaceParticipations[]
    const mkps = response.payload.marketplaceParticipations || response ;

    // Extract just the Marketplace IDs
    const marketplaceIds = mkps.map(item => item?.marketplace?.id);

    console.log('Registered Marketplaces:', marketplaceIds);
    return marketplaceIds;

  } catch (err) {
    console.error('Error fetching marketplace participations:', err);
    throw err;
  }
}