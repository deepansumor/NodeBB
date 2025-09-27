const awsSdk = require('aws-sdk');
const nconf = require('nconf');
// const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const { queue_url, aws_region, aws_access_key_id, aws_secret_access_key } = nconf.get("s3");




const AWS = module.exports;

AWS.init = async function (server) {

    awsSdk.config.update({
        accessKeyId: aws_access_key_id,
        secretAccessKey: aws_secret_access_key,
        region: aws_region
    });

    AWS.sqs =  new awsSdk.SQS();
    AWS.s3 = new awsSdk.S3();
  
    console.log("AWS SDK initialized with SQS and S3 services");
}