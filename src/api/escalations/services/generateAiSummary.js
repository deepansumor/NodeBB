"use strict";

const { generateAISummary } = require("../../../services/escalation/escalatioAiSummary");
const { getEscalationperBrand, getRemarkperBrand } = require("./getSummary");
const nconf = require("nconf");

const s3 = nconf.get("s3");


const escalationsSummaries = module.exports;

// s3 bucket details 
const bucketName = s3.emsSummaryBucket || "test-220425";

// escalationsSummaries.generateEscalationSummary = async (req, res) => {
//   try {


//     const escalationData = await getEscalationperBrand();
//     console.log("Escalation Data Retrieved:", escalationData);

//     const uploadedSummaries = await generateAISummary(
//       escalationData,
//       bucketName,
//       "escalation-summary.json"
//     );

//     return {
//       message: "AI summaries generated and uploaded for all brands",
//       uploadedSummaries,
//     };
//   } catch (err) {
//     console.error("Error in getEscalationSummaries:", err);
//     throw err;
//   }
// };

escalationsSummaries.generateEscalationSummary = async () => {
  let escalationData = null;
  let uploadedSummaries = [];

  try {
    escalationData = await getEscalationperBrand();
    console.log("✅ Escalation Data Retrieved:", escalationData);

    if (!escalationData || escalationData.length === 0) {
      return {
        success: false,
        message: "No escalation data found to process",
        uploadedSummaries: [],
      };
    }

    uploadedSummaries = await generateAISummary(
      escalationData,
      bucketName,
      "escalation-summary.json"
    );

    return {
      success: true,
      message: "AI summaries generated and uploaded for all brands",
      uploadedSummaries,
    };
  } catch (err) {
    console.error("❌ Error in generateEscalationSummary:", err);

    // Always return safe structured response (no throw)
    return {
      success: false,
      message: "An error occurred while generating escalation summaries",
      error: err.message,
      uploadedSummaries,
    };
  }
};


// escalationsSummaries.generateRemarkSummary = async (req, res) => {
//   try {
//     const remarkData = await getRemarkperBrand();
//     console.log("Remarks Data Retrieved in main function:", remarkData);

//     const uploadedSummaries = await generateAISummary(
//       remarkData,
//       bucketName,
//       "remark-summary.json",
//       "remark"
//     );

//     return {
//       message: "AI summaries generated and uploaded for all brands",
//       uploadedSummaries,
//     };
//   } catch (err) {
//     console.error("Error in getEscalationSummaries:", err);
//     throw err;
//   }
// };

escalationsSummaries.generateRemarkSummary = async () => {
  let remarkData = null;
  let uploadedSummaries = [];

  try {
    remarkData = await getRemarkperBrand();
    console.log("✅ Remarks Data Retrieved in main function:", remarkData);

    if (!remarkData || remarkData.length === 0) {
      return {
        success: false,
        message: "No remark data found to process",
        uploadedSummaries: [],
      };
    }

    uploadedSummaries = await generateAISummary(
      remarkData,
      bucketName,
      "remark-summary.json",
      "remark"
    );

    return {
      success: true,
      message: "AI summaries generated and uploaded for all brands",
      uploadedSummaries,
    };
  } catch (err) {
    console.error("❌ Error in generateRemarkSummary:", err);

    // Return safe structured response (no throw)
    return {
      success: false,
      message: "An error occurred while generating remark summaries",
      error: err.message,
      uploadedSummaries,
    };
  }
};
