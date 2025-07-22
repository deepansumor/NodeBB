const awsSdk = require('aws-sdk');
const nconf = require('nconf');
const { QueueUrl, aws_region, aws_access_key_id, aws_secret_access_key } = nconf.get("s3");




const AWS = module.exports;

AWS.init = async function (server) {

    awsSdk.config.update({
        accessKeyId: aws_access_key_id,
        secretAccessKey: aws_secret_access_key,
        region: aws_region
    });

    AWS.sqs =  new awsSdk.SQS();
  
    console.log("AWS SDK initialized with SQS and S3 services");
}