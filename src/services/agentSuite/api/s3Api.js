const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const AWS = require("../../../api/agents/services/aws")
const nconf = require("nconf");
const S3 = nconf.get("s3");
const configPath = path.resolve(__dirname, "config.json");
const config = fs.existsSync(configPath) ? require(configPath) : {};

const REGION = process.env.AWS_REGION || S3?.aws_region || "us-east-1";
const BUCKET = process.env.S3_BUCKET || S3?.aws_bucket;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || S3?.aws_access_key_id;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || S3?.aws_secret_access_key;

if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) {
  throw new Error("Missing required AWS credentials or bucket name. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET environment variables.");
}

// const s3Client = new S3Client({
//   region: REGION,
//   credentials: {
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_KEY,
//   },
// });

// const s3Client = AWS.s3;
// console.log('✅ S3 credentials loaded successfully');

const s3Api = module.exports;

/**
 * Save JSON data to S3
 * @param {string} key - The S3 object key (e.g., pdp_audit/asin/date/report.json)
 * @param {Object} data - The JSON data to save
 */
s3Api.saveJson = async (key, data) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
  });

  try {
    const response = await s3Client.send(command);
    console.log(`✅ Uploaded ${key} to S3`);
    return response;
  } catch (err) {
    console.error(`❌ Failed to upload ${key}`, err);
    throw err;
  }
};

/**
 * Save PDF buffer to S3
 * @param {string} key - The S3 object key (e.g., pdp_audit/asin/date/report.pdf)
 * @param {Buffer} pdfBuffer - The PDF buffer to save
 */
s3Api.savePdf = async (key, pdfBuffer) => {
  const command = {
    Bucket: BUCKET,
    Key: key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
  };

  try {
    const response = await AWS.s3.upload(command).promise();
    console.log(`✅ Uploaded PDF ${key} to S3`);
    return response;
  } catch (err) {
    console.error(`❌ Failed to upload PDF ${key}`, err);
    throw err;
  }
};

/**
 * Get object from S3
 * @param {string} key - The S3 object key
 * @returns {Promise<Buffer>} - The object data
 */
s3Api.getObject = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (err) {
    console.error(`❌ Failed to get object ${key}`, err);
    throw err;
  }
};