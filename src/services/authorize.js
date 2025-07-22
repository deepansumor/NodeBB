const jwt = require("jsonwebtoken")
const nconf = require("nconf")
const axios = require("axios")
const JWT_SECRETE = nconf.get("jwt");

const db = require("../database");
const COLLECTION = require("../database/mongo/collections");
const { spapi } = require(".");

const {
    JWT_SECRET,
    LWA_CLIENT_ID,
    LWA_CLIENT_SECRET,
    REDIRECT_URI
    // e.g. REDIRECT_URI:"https://yourapp.com/auth/finish", backend url
} = process.env;

const authorize = module.exports
// Login handler: Amazon calls this when user clicks “Authorize” in the Appstore
// this is connected to the next route
//using JWT token
// auth/login   -> FE page and add button so its like the taking permision 
authorize.startAuth = async (req, res) => {
    try {
        const { amazon_callback_uri, amazon_state, selling_partner_id } = req.query;
        if (!amazon_callback_uri || !amazon_state || !selling_partner_id) {
            return res.status(400).send('Missing required parameters');
        }

        // Pack Amazon’s state + seller ID into a short-lived JWT
        const token = jwt.sign(
            { amazon_state, selling_partner_id },
            JWT_SECRET,
            { expiresIn: '10m' }
        );

        // Redirect the seller into the Appstore flow
        const redirectUrl = new URL(amazon_callback_uri);
        redirectUrl.searchParams.set('amazon_state', amazon_state);
        redirectUrl.searchParams.set('state', token);
        redirectUrl.searchParams.set('redirect_uri', REDIRECT_URI);

        res.redirect(redirectUrl.toString());
    } catch (error) {
        console.log("Error in the authorization api --->", error)
        throw new Error("Error while authorizing user");

    }
}

authorize.finishAuth = async (req, res) => {
    const { state: token, selling_partner_id, spapi_oauth_code } = req.query;
    if (!token || !spapi_oauth_code) {
        return res.status(400).send('Missing state or auth code');
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(403).send('Invalid or expired state token');
    }

    // Optional extra check
    if (selling_partner_id !== payload.selling_partner_id) {
        return res.status(400).send('Seller ID mismatch');
    }

    // Exchange the code for LWA tokens
    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: spapi_oauth_code,
            redirect_uri: REDIRECT_URI,
            client_id: LWA_CLIENT_ID,
            client_secret: LWA_CLIENT_SECRET
        });

        const { data } = await axios.post(
            'https://api.amazon.com/auth/o2/token',
            params.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } }
        );

        // TODO: persist data.refresh_token in your DB, keyed by payload.selling_partner_id
        // await db.saveSellerToken(payload.selling_partner_id, data.refresh_token);
        const sellerData = {
            refreshToken: data.refresh_token,
            sellerId: selling_partner_id
        }
        await db.saveObject(`_key:${payload.selling_partner_id}`, sellerData, COLLECTION.SELLERS)
        
        // add call to get all the marketplaceid ,asin and save refresh token and sellerId
        await spapi.getAllAsins(sellerData)

        return res.send('<h1>✅ Authorization Successful</h1>');
    } catch (err) {
        console.error('Token exchange error:', err.response?.data || err.message);
        return res.status(500).send('Failed to exchange authorization code');
    }
}