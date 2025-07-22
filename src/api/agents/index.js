
const AgentsApi = require("./agent")
const RainforestApi = require("./rainforest")
const S3 = require("./s3")
const SPapi = require("./spapi")
const agents = module.exports

agents.agentApi = AgentsApi
agents.rainforestApi = RainforestApi
agents.s3Api = S3
agents.spapi = SPapi