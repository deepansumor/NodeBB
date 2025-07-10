const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

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

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

const s3Api = module.exports;

/**
 * Save JSON data to S3
 * @param {string} key - The S3 object key (e.g., products/B0CL9P14JH.json)
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
    const response = await s3.send(command);
    console.log(`✅ Uploaded ${key} to S3`, response);
  } catch (err) {
    console.error(`❌ Failed to upload ${key}`, err);
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
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  try {
    const response = await s3.send(command);
    // const chunks = [];
    // for await (const chunk of response.Body) {
    //   chunks.push(chunk);
    // }
    // const body = Buffer.concat(chunks).toString("utf-8");
    // console.log("response of the s3 bucket -->",body)
    // return JSON.parse(body);
    return response.Body
  } catch (err) {
    if (err.name === "NoSuchKey") {
      console.error(`❌ File not found at key: ${key}`);
      return null
    } else {
      console.error(`❌ Failed to fetch data for key: ${key}`, err);
    }
    throw err;
  }
};
