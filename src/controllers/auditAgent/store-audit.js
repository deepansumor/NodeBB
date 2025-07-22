"use strict";



const dashboardController = module.exports;
dashboardController.get = async function (req, res, next) {
    try {
        var dashboard = { };
        let id = req.query.key;
       dashboard.title = "Store-Audit";
       
        
        res.render("auditAgent/store-audit", dashboard);
    } catch (err) {
        console.error("Error rendering template:", err);
        next(err); // Pass the error to the next middleware
    }
};