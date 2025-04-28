"use strict";

const thresholdsController = module.exports;
thresholdsController.get = async function (req, res, next) {
	try {
		var escalationTable = {
			title: "Account Thresholds Configuration",
			mandatory_metrics: [
				{ key: "ACOS", label: "ACOS" },
				{ key: "ROAS", label: "ROAS" },
				{ key: "Sales", label: "Sales" },
				{ key: "Spend", label: "Spend" },
			],
			optional_metrics: [
				{
					key: "NTB_ORDERS",
					label: "NTB Orders",
				},
				{
					key: "NTB_SALES",
					label: "NTB Sales",
				},
				{
					key: "CTR",
					label: "CTR (%)",
				},
				{
					key: "CVR",
					label: "CVR (%)",
				},
				{
					key: "CPC",
					label: "CPC",
				},
				{
					key: "Orders",
					label: "Orders",
				},
				{
					key: "Clicks",
					label: "Clicks",
				},
				{
					key: "Impressions",
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
