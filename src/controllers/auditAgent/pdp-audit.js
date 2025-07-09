"use strict";

const api = require("../../api");
const db = require("../../database");
const COLLECTIONS = require("../../database/mongo/collections");



const pdpAuditController = module.exports;
pdpAuditController.get = async function (req, res, next) {
    try {
        var pdpAudit = { };
        let key = req.query.key;

         pdpAudit = {
            title :"Pdp-page",
            key : key
         }

         if(key){
            pdpAudit.report = await db.getObject(key, [], COLLECTIONS.REPORT)
         }
        res.render("auditAgent/pdp-audit", pdpAudit);
    } catch (err) {
        console.error("Error rendering template:", err);
        next(err); // Pass the error to the next middleware
    }
};