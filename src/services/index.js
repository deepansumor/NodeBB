const services = module.exports;
const RainForsetAPI = require("./rainforset")
const AwsS3 = require("./aws-s3")

// const Gemini = require("./gemini")
const SPapi = require("./spapi")
const authorization = require("./authorize")
services.rainforest = RainForsetAPI;
services.s3api = AwsS3
// services.gemini = Gemini
services.spapi = SPapi
services.authorization = authorization