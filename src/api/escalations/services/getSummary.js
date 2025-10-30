"use strict";

const db = require("../../../database");
const COLLECTIONS = require("../../../database/mongo/collections");
const { ObjectId } = require("mongodb");

const escalationsSummaries = module.exports;
escalationsSummaries.getEscalationSummaries = async (req, res) => {
    try {
        const uid = req.uid || 2;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const escalations = await db.find(
            {
                status: { $ne: "resolved" }
                // locked : 1
                // escalationDate: "2025-10-26",
                
            },
            skip,
            limit,
            COLLECTIONS.ESCALATIONS
        );

        return escalations;
    } catch (err) {
        console.error("GET /escalations error:", err);
        throw new Error(err);
    }
};

// "use strict";
// const { generateAISummary } = require("../../../services/escalation/escalatioAiSummary");
// const {uploadToS3} = require("../../../services/aws-s3");

// const escalationsSummaries = module.exports;

// // s3 bucket details 
// const brandId = "brand123"; 
// const dateStr = new Date().toISOString().split("T")[0];
// const bucketName = "test-220425"; // replace with your S3 bucket name
// const key = `emsAiSummary/${brandId}/${dateStr}/escalation-summary.json`;


// escalationsSummaries.getEscalationSummaries = async (req, res) => {
//   try {
//     const aiSummary = await generateAISummary();
//     console.log("AI Summary Generated:", aiSummary);
//     // return aiSummary;

//     const result = await uploadToS3(bucketName, key, aiSummary);
//     console.log("File uploaded successfully:", result.Location);
//     return result.Location;

//     } catch (err) {
//     console.error("Error in getEscalationSummaries:", err);
//     throw err;
//     }
// };