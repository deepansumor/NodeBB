
const dayjs = require("dayjs");
const db = require("../../../database");
const { ObjectId } = require("mongodb");
const COLLECTIONS = require("../../../database/mongo/collections");
const AWS = require("./aws")

const nconf = require('nconf');

const { QueueUrl } = nconf.get("s3");


function getBrandName(req) {
  const brandName = req.params.brandName;
  if (!brandName) {
    throw new Error("Brand name is required in the request params.");
  }
  return brandName;
}

function getLast15DaysRange() {
  const today = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(today.getDate() - 15);
  return { $gte: fifteenDaysAgo, $lte: today };
}

async function checkIfAuditExists(brandName, dateRange) {
  const query = { brandName, createdAt: dateRange };
  const result = await db.find(query, 0, 100, COLLECTIONS.AUDIT_RUNS);
  console.log("Audit check result:", result);
  return result && result.length > 0 ? result : null;
}

async function getAsinListForBrand(brandName) {
  const brandData = await db.client.collection("brand_asins").findOne({ brandName });
  console.log("Brand asin data:", brandData);
  return (brandData && Array.isArray(brandData.asins)) ? brandData.asins : [];
}

function generateAuditId(brandName) {
  return `${brandName.toLowerCase()}_${dayjs().format("YYYYMMDD")}`;
}

async function insertAuditRun(brandName, auditId, total) {
  const auditDoc = {
    _id: new ObjectId(),
    brandName,
    auditId,
    type : "Brand Store",
    createdAt: new Date(),
    status: "in_progress",
    total,
    completed: 0,
    failed: 0
  };
  await db.client.collection(COLLECTIONS.AUDIT_RUNS).insertOne(auditDoc);
  console.log("Inserted audit run:", auditDoc);
  return auditDoc;
}

async function sendAsinsToQueue(asinList, brandName, auditId) {
  for (const asin of asinList) {
    const messageBody = { asin, brandName, auditId };
    const params = {
      QueueUrl,
      MessageBody: JSON.stringify(messageBody)
    };
    try {
      const result = await AWS.sqs.sendMessage(params).promise();
      console.log(`✅ Sent ASIN: ${asin} → MessageId: ${result.MessageId}`);
    } catch (sqsErr) {
      console.error(`❌ Failed to send ASIN: ${asin}`, sqsErr);
    }
  }
}


module.exports = {
  getBrandName,
  getLast15DaysRange,
  checkIfAuditExists,
  getAsinListForBrand,
  generateAuditId,
  insertAuditRun,
  sendAsinsToQueue
};
