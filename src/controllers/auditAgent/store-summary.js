"use strict";

const storeSummaryController = module.exports;
storeSummaryController.get = async function (req, res, next) {
     try {
        var storeSummary = { };
        let auditId = req.query.auditId;
        
        storeSummary.title = "Store-Summary";
        storeSummary.auditId =  auditId;
        res.render("auditAgent/store-summary", storeSummary);
}catch (err) {
        console.error("Error rendering template:", err);
        next(err);
    }
}