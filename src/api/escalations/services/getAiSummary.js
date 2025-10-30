'use strict';


// const  { S3Client, GetObjectCommand } =  require("@aws-sdk/client-s3");
//  const  nconf = require('nconf') ;
const AWS = require('../../agents/services/aws');

 // ---- Get your S3 configuration ----
// const s3Config = nconf.get("s3"); 

//  const { queue_url, aws_region, aws_access_key_id, aws_secret_access_key } = s3Config;

// const s3 = new S3Client({
//    region: aws_region || "ap-south-1",
//   credentials: {
      
//           secretAccessKey: aws_secret_access_key,
//      accessKeyId: aws_access_key_id,
//   },
// });

const s3 = AWS.s3;

 const BUCKET_NAME = "test-220425"; 

 const formatDate = (date) => date.toISOString().split("T")[0];
// Helper: Convert date object → YYYY-MM-DD format

// Helper: Fetch and parse JSON from S3
async function fetchJsonFromS3(key) {
  try {
    // const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
const data = await s3.getObject({ Bucket: BUCKET_NAME, Key: key });
   const body = await data.Body.transformToString();
    return JSON.parse(body);
  } catch (error) {
    console.error(`❌ Error fetching ${key}:`, error);
    return null; // return null if file not found or parse fails
  }
}

// // --- 1️⃣ Fetch Escalation Summary for Yesterday ---
 export const getEscalationSummary = async (req, res) => {
 try {
   // const { brandId } = req.params;
   const brandId = "brand123";
//     // Calculate yesterday’s date
   const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = formatDate(yesterday);
// const dateStr = new Date().toISOString().split("T")[0];
// const dateStr = "2025-10-29" ;
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
export const getRemarkSummary = async (req, res) => {
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
      const key = `emsAiSummary/${brandId}/${date}/remark-summary.json.json`;
      console.log(`Fetching Remark Summary for ${date} from S3 key: ${key}`)
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


