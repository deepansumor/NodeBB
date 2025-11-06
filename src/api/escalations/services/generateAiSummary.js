"use strict";

const { generateAISummary } = require("../../../services/escalation/escalatioAiSummary");
const { getEscalationperBrand, getRemarkperBrand } = require("./getSummary");
const nconf = require("nconf");

const s3 = nconf.get("s3");


const escalationsSummaries = module.exports;

// s3 bucket details 
const bucketName = s3.emsSummaryBucket || "test-220425";

escalationsSummaries.generateEscalationSummary = async (req, res) => {
  try {


    const escalationData = await getEscalationperBrand();
    console.log("Escalation Data Retrieved:", escalationData);

    const uploadedSummaries = await generateAISummary(
      escalationData,
      bucketName,
      "escalation-summary.json"
    );

    return {
      message: "AI summaries generated and uploaded for all brands",
      uploadedSummaries,
    };
  } catch (err) {
    console.error("Error in getEscalationSummaries:", err);
    throw err;
  }
};


escalationsSummaries.generateRemarkSummary = async (req, res) => {
  try {
    const remarkData = await getRemarkperBrand();
    console.log("Remarks Data Retrieved in main function:", remarkData);

    const uploadedSummaries = await generateAISummary(
      remarkData,
      bucketName,
      "remark-summary.json",
      "remark"
    );

    return {
      message: "AI summaries generated and uploaded for all brands",
      uploadedSummaries,
    };
  } catch (err) {
    console.error("Error in getEscalationSummaries:", err);
    throw err;
  }
};
