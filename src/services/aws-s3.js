const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const AWS = require("../api/agents/services/aws")
const nconf = require("nconf")
const S3 = nconf.get("s3")
const configPath = path.resolve(__dirname, "config.json");
const config = fs.existsSync(configPath) ? require(configPath) : {};

const REGION = process.env.AWS_REGION || S3.aws_region || "us-east-1";
const BUCKET = process.env.S3_BUCKET || S3.aws_bucket;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || S3.aws_access_key_id;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || S3.aws_secret_access_key;

if (!BUCKET || !ACCESS_KEY || !SECRET_KEY) {
  throw new Error("Missing required AWS credentials or bucket name.");
}

// const s3 = new S3Client({
//   region: REGION,
//   credentials: {
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_KEY,
//   },
// });

// const s3 = AWS.s3
const s3Api = module.exports;

/**
 * Save JSON data to S3
 * @param {string} key - The S3 object key (e.g., products/B0CL9P14JH.json)
 * @param {Object} data - The JSON data to save
 */
s3Api.saveJson = async (key, pdfBuffer) => {
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
 * Get and parse JSON data from S3
 * @param {string} key - The S3 object key to fetch
 * @returns {Object} Parsed JSON data
 */
// key == path of the file
s3Api.getJson = async (key) => {

  // console.log("the s3 instance -->",AWS)
  const params ={
    Bucket: BUCKET,
    Key: key,
  }

  try {
    const s3Object = AWS.s3.getObject(params); // Do not pass a callback
    return s3Object.createReadStream(); // return the ReadableStream
  } catch (err) {
    console.error('❌ Error creating stream from S3 object:', err);
    throw err;
  }
 
};
