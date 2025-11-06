'use strict';

const AWS = require('../../agents/services/aws.js')



const s3 = AWS.s3;
console.log("S3 Client initialized:", s3);

const BUCKET_NAME = "test-220425";

const formatDate = (date) => date.toISOString().split("T")[0];



// --- Helper to fetch and parse JSON from S3 ---
async function fetchJsonFromS3(key) {
  try {
    const data = await s3
      .getObject({ Bucket: BUCKET_NAME, Key: key })
      .promise(); // ✅ Important: .promise()

    const body = data.Body.toString("utf-8"); // ✅ Works (Body is Buffer)
    const result = JSON.parse(body);
    return result;
  } catch (error) {
    console.error(`❌ Error fetching ${key}:`, error);
    return null;
  }
}



// // --- 1️⃣ Fetch Escalation Summary for Yesterday ---
const getEscalationSummary = async (req, res) => {
  try {
    // const { brandId } = req.params;
    const brandId = "brand123";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = formatDate(yesterday);

    const key = `emsAiSummary/${brandId}/${dateStr}/escalation-summary.json`;
    const summaryData = await fetchJsonFromS3(key);
    console.log("Fetched Escalation Summary Data:", summaryData);

    if (!summaryData) {
      return null;
    }

    return summaryData;

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching escalation summary" });
  }
};



// --- 2️⃣ Fetch Remark Summary for Last 3 Days ---
const getRemarkSummary = async (req, res) => {
  try {
    // const { brandId } = req.params;
    const brandId = "brand123";

    // Calculate last 3 dates: yesterday, day before, and the day before that
    const dates = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(formatDate(d));
    }

    const results = {};

    // Fetch remark-summary.json for each date
    for (const date of dates) {
      const key = `emsAiSummary/${brandId}/${date}/remark-summary.json`;
      console.log(`Fetching Remark Summary for ${date} from S3 key: ${key}`);
      const data = await fetchJsonFromS3(key);
      console.log(`Fetched Remark Summary for ${date}:`, data);
      results[date] = data || "No data found";
      console.log("results so far:", results);
    }

    return results;

  } catch (error) {
    console.error(`❌ Error fetching remark summaries:`, error);
    return null;
  }
};

module.exports = { getRemarkSummary, getEscalationSummary }