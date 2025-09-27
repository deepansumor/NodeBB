const jwt = require("jsonwebtoken")
const nconf = require("nconf")
const axios = require("axios")
// const JWT_SECRET = nconf.get("jwt");

const db = require("../database");
const COLLECTION = require("../database/mongo/collections");
const spapi = require('./spapi'); // your SP-API helper
const sp = nconf.get("sp")


const {
    jwt_secret,
    lwa_client_id,
    lwa_client_secret,
    redirect_uri
    // e.g. REDIRECT_URI:"https://yourapp.com/auth/finish", backend url
} =sp;

const authorize = module.exports
// Login handler: Amazon calls this when user clicks “Authorize” in the Appstore
// this is connected to the next route
//using JWT token
// auth/login   -> FE page and add button so its like the taking permision 


// =========================
// START AUTH
// =========================
authorize.startAuth = async (req, res) => {
    try {
        // console.log("sp credentials --->",sp)
        const amazon_state =  Math.random().toString(36).substring(2, 15);
        // console.log('[startAuth] Generated amazon_state:', amazon_state);

        // create a short-lived JWT for security
        const token = jwt.sign({ amazon_state }, jwt_secret, { expiresIn: '10m' });
        // console.log('[startAuth] Created JWT token:', token);

        // build Amazon OAuth consent URL
        const redirectUrl = `https://sellercentral.amazon.com/apps/authorize/consent` +
            `?application_id=${lwa_client_id}` +
            `&state=${token}` +
            `&redirect_uri=${redirect_uri}`;
        // console.log('[startAuth] Redirecting seller to Amazon consent URL:', redirectUrl);

        
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("[startAuth] Error starting Amazon auth:", error);
        return res.status(500).send("Failed to start Amazon authorization");
    }
};

// =========================
// FINISH AUTH
// =========================
authorize.finishAuth = async (req, res) => {
    const { state: token, selling_partner_id, spapi_oauth_code } = req.query;
    console.log('[finishAuth] Received callback query:', req.query);

    if (!token || !spapi_oauth_code) {
        console.warn('[finishAuth] Missing state or auth code');
        return res.status(400).send('Missing state or auth code');
    }

    // verify JWT state
    let payload;
    try {
        payload = jwt.verify(token, jwt_secret);
        console.log('[finishAuth] Verified JWT payload:', payload);
    } catch (err) {
        console.warn('[finishAuth] Invalid or expired state token:', err.message);
        return res.status(403).send('Invalid or expired state token');
    }

    // exchange code for LWA tokens
    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: spapi_oauth_code,
            redirect_uri: redirect_uri,
            client_id: lwa_client_id,
            client_secret: lwa_client_secret
        });

        console.log('[finishAuth] Exchanging auth code for tokens...');
        const { data } = await axios.post(
            'https://api.amazon.com/auth/o2/token',
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } }
        );

        console.log('[finishAuth] Received tokens from Amazon:', data);

        if (!data.refresh_token) {
            console.warn('[finishAuth] No refresh token received');
            return res.status(500).send("No refresh token received from Amazon");
        }

        // save refresh token + sellerId in DB
        const sellerData = {
            refreshToken: data.refresh_token,
            sellerId: selling_partner_id
        };

        console.log('[finishAuth] Saving seller data in DB:', sellerData);
        await db.saveObject(`_key:${selling_partner_id}`, sellerData, COLLECTION.SELLERS);

        // optional: fetch all ASINs / marketplace data
        console.log('[finishAuth] Fetching ASINs and marketplace data...');
        await spapi.getAllAsins(sellerData);

        console.log('[finishAuth] Authorization flow completed successfully for seller:', selling_partner_id);

        res.redirect("/agents/registration-success")
        return res.send('<h1>✅ Amazon Authorization Successful</h1>');
    } catch (err) {
        console.error('[finishAuth] Token exchange error:', err.response?.data || err.message);
        return res.status(500).send('Failed to exchange authorization code');
    }
};

