const services = require("../../services");
const db = require("../../database");
const COLLECTIONS = require("../../database/mongo/collections");
const prompts = require("../../services/prompts");
const nconf = require("nconf");
const AuditOrchestrator = require("../../services/agentSuite/orchestrator")
// Create orchestrator instance
const orchestrator = new AuditOrchestrator();
const agentApi = module.exports;

agentApi.generateReport = async (req) => {
  try {
    const asin = req.params.asin
    const date = new Date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const checkReport = await db.getObject(`asin:${asin}:month:${year}-${month}`, [], COLLECTIONS.REPORT);
    if (checkReport) {
      console.log("check report data --->", checkReport)
      return checkReport
    }

    const data = await orchestrator.executeAllAgents(asin);
    console.log("data of the audit -->", data);

    return data;

  } catch (error) {
    console.log("error in the generate report -->", error);
    throw new Error("Error in the generate report api");

  }
};
