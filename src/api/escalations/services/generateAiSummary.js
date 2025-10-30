"use strict";
const { generateAISummary } = require("../../../services/escalation/escalatioAiSummary");
const {uploadToS3} = require("../../../services/aws-s3");

const escalationsSummaries = module.exports;

// s3 bucket details 
const brandId = "brand123"; 
const dateStr = new Date().toISOString().split("T")[0];
const bucketName = "test-220425"; // replace with your S3 bucket name
const key = `emsAiSummary/${brandId}/${dateStr}/escalation-summary.json`;


escalationsSummaries.generateEscalationSummary = async (req, res) => {
  try {
    const aiSummary = await generateAISummary();
    console.log("AI Summary Generated:", aiSummary);
    // return aiSummary;

    const result = await uploadToS3(bucketName, key, aiSummary);
    console.log("File uploaded successfully:", result.Location);
    return result.Location;

    } catch (err) {
    console.error("Error in getEscalationSummaries:", err);
    throw err;
    }
};