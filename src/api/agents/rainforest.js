"use strict";

const db = require("../../database");
const COLLECTIONS = require("../../database/mongo/collections");
const services = require("../../services");
const { fetchCatalogData } = require("../../services/spapi");

const rainforestApi = module.exports;

/**
 * Fetch ASIN data from DB if available, else fetch from Rainforest API.
 */
rainforestApi.getAsinData = async (req) => {
  try {
    const asin = req.params.asin;
    if (!asin) {
      throw new Error("ASIN not provided in request");
    }
    console.log("asin from the req -->",asin)
    const data = await fetchCatalogData(asin);

    // const dbKey = `product:${asin}`;
    // const dbData = await db.getObject(dbKey, [], COLLECTIONS.ASINS);

    // if (!dbData || Object.keys(dbData).length === 0) {
    //   const apiResponse = await services.rainforest.get(asin);
    //   return apiResponse;
    // }

    // const data = dbData.data
    // const metaData = {};
    // metaData.brand = dbData.brand
    // metaData.asin = dbData.asin
    // metaData.date = dbData.date
    // console.log("ASIN data retrieved from DB:", data, metaData);

    // return { data, metaData };
  } catch (error) {
    console.error("Error in getAsinData:", error.message || error);
    throw new Error("Failed to retrieve ASIN data");
  }
};

/**
 * Force fetch ASIN data directly from Rainforest API (ignores DB).
 */
rainforestApi.freshASINData = async (req) => {
  try {
    const asin = req.params.asin;
    if (!asin) {
      throw new Error("ASIN not provided for force fetch");
    }

    const apiResponse = await services.rainforest.freshData(asin);
    return apiResponse;
  } catch (error) {
    console.error("Error in forceFetchASINData:", error.message || error);
    throw new Error("Failed to force fetch ASIN data");
  }
};


// Fetch recent reports and send it to the fron-end 

rainforestApi.dbReportsData = async (req) => {
  try {

    // const asin = req.params.asin;

    const data = await db.find({}, 0, 10, COLLECTIONS.REPORT)
    return data
  } catch (error) {
    console.log("Error while fetching DB reports -->", error)
    throw new Error("Error while fetching DB reports");

  }
}


rainforestApi.singleAsinReport = async (req) => {
  try {

    const key = req.params.key;
    // const month = req.params.month;

    const data = await db.getObject(key, [], COLLECTIONS.REPORT)
    return data
  } catch (error) {
    console.log("Error while fetching DB reports -->", error)
    throw new Error("Error while fetching DB reports");

  }
}