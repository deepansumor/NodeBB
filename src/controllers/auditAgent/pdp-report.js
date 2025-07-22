"use strict";

const api = require("../../api");
const db = require("../../database");
const COLLECTIONS = require("../../database/mongo/collections");



const pdpReportController = module.exports;
pdpReportController.get = async function (req, res) {
    try {
        var pdpReport = { };
        let key = req.query.key;
        let asin = req.query.asin;

         pdpReport = {
            title :"Pdp-report",
            key : key,
            asin: asin
         }

         if(key){
            pdpReport.report = await db.getObject(key, [], COLLECTIONS.REPORT)
            console.log("Report data:", pdpReport.report);
         }
        res.render("auditAgent/pdp-report", pdpReport);
    } catch (err) {
        console.error("Error rendering template:", err);
      
    }
};