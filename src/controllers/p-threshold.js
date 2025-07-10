"use strict";

const  privileges = require("../privileges/users")

const pthresholdsController = module.exports;
pthresholdsController.get = async function (req, res, next) {
    try {
        var escalationTable = {
            title: "Portfolio Thresholds Configuration",

            wait_time_sop: [
                { key: "Stage1", label: "Stage 1" },
                { key: "Stage2", label: "Stage 2" },
                { key: "Stage3", label: "Stage 3" },
                
            ],
            mandatory_metrics: [
                { key: "ACOS", label: "ACOS" },
                { key: "ROAS", label: "ROAS" },
                { key: "spends", label: "Spend (Monthly)" },
                { key: "CPC", label: "CPC" },
                { key: "CVR", label: "CVR (%)" },
            ],
            optional_metrics: [
                
                {
                    key: "CTR",
                    label: "CTR (%)",
                },
                {
                    key: "sales",
                    label: "Sales",
                },
                
                {
                    key: "orders",
                    label: "Orders",
                },
                {
                    key: "clicks",
                    label: "Clicks",
                },
                {
                    key: "impressions",
                    label: "Impressions",
                },
            ],
        };

        escalationTable.title = "Thresholds";
        await privileges.isModerator()
        res.render("automate/p-threshold", escalationTable);
    } catch (err) {
        console.error("Error rendering template:", err);
        next(err); // Pass the error to the next middleware
    }
};
