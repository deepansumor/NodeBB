const axios = require("axios");

const nconf = require("nconf");
const db = require("../database");
const COLLECTION = require("../database/mongo/collections")
const Rainsforest = nconf.get("rainforest")


const RainForsetAPI = module.exports;
RainForsetAPI.get = async function (asin) {
    try {

        const dbData = await db.getObject(`product:${asin}`, [], COLLECTION.ASINS)
        console.log("this is the db data from the api -->", asin, dbData);
        if (dbData) {
            data = dbData.data
            const metaData = {};
            metaData.brand = dbData.brand
            metaData.asin = dbData.asin
            metaData.date = dbData.date
            return {data,metaData};
        }

        /// api call for rainforest
        // console.log("Rainsforest api key -->", Rainsforest.api_key)
        const url = `${Rainsforest.url}/request?api_key=${Rainsforest.api_key}&amazon_domain=amazon.in&asin=${asin}&type=product&language=en_US&currency=inr`
        const response = await axios.get(url);
        console.log(response);


        // response ->data->product
        const product = response.data.product
        // console.log(JSON.stringify(product));
        const images = product.images_flat.split(",");
        const bullet_points = product.feature_bullets_flat.split('. ');

        const data = {};
        data.title = product.title
        data.images = images
        data.bullet_points = bullet_points
        data.description = product.description

        const product_data = {};
        product_data.asin = asin;
        product_data.brand = product.brand
        product_data.link = product.link;
        product_data.data = data

        const metaData = {};
        metaData.brand = product.brand;
        metaData.asin = product.asin;

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        metaData_data.date = `${year}-${month}-${day}`
        product_data.date = `${year}-${month}-${day}`
        // let report = db.getObject(`reportrt:${asin}`)
        // db.setObject(`reportrt:${asin}`, object).

        const response_data = await db.setObject(`product:${asin}`, product_data, COLLECTION.ASINS);
        // console.log(`product:${asin}`,product_data)
        return {data,metaData_data};
    } catch (error) {
        console.log("error in the rainforest api --->", error)
    }
}

RainForsetAPI.freshData = async function (asin) {
    try {
        /// api call for rainforest
        // console.log("Rainsforest api key -->", Rainsforest.api_key)
        const url = `${Rainsforest.url}/request?api_key=${Rainsforest.api_key}&amazon_domain=amazon.in&asin=${asin}&type=product&language=en_US&currency=inr`
        const response = await axios.get(url);
        // console.log(response);


        // response ->data->product
        const product = response.data.product
        // console.log(JSON.stringify(product));
        const images = product.images_flat.split(",");
        const bullet_points = product.feature_bullets_flat.split('. ');

        const data = {};
        data.title = product.title
        data.images = images
        data.bullet_points = bullet_points
        data.description = product.description

        const product_data = {};
        product_data.asin = asin;
        product_data.brand = product.brand
        product_data.link = product.link;
        product_data.data = data
        
        const metaData = {};
        metaData.brand = product.brand;
        metaData.asin = product.asin;

        // creating date
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        metaData.date = `${year}-${month}-${day}`
        product_data.date = `${year}-${month}-${day}`

        // let report = db.getObject(`reportrt:${asin}`)
        // db.setObject(`reportrt:${asin}`, object).

        const response_data = await db.setObject(`product:${asin}`, product_data, COLLECTION.ASINS);
        // console.log(`product:${asin}`,product_data)
        return {data , metaData};
    } catch (error) {
        console.log("error in the rainforest api --->", error)
    }
}