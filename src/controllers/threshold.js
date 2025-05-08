"use strict";

const thresholdsController = module.exports;
thresholdsController.get = async function (req, res, next) {
	try {
		var escalationTable = {
			title: "Account Thresholds Configuration",

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

		escalationTable.title = "escalation table";
		res.render("automate/threshold", escalationTable);
	} catch (err) {
		console.error("Error rendering template:", err);
		next(err); // Pass the error to the next middleware
	}
};
