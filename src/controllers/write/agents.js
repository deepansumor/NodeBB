"use strict";

const api = require("../../api");
const helpers = require("../helpers");

const agents = module.exports;


agents.generateReport = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.agentApi.generateReport(req)
    );
};
agents.brandStoreReport = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.agentApi.brandStoreReport(req)
    );
};
agents.getBrandAsins = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.agentApi.getBrandAsins(req)
    );
};

agents.getAsinData = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.rainforestApi.getAsinData(req)
    );
};

agents.createNewASINData  = async (req, res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.rainforestApi.freshASINData(req)
    );
};

agents.getReport = async (req) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.s3Api.get(req)
    );
};
agents.getBrandAudit  = async (req,res) => {
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.agentApi.getBrandAudit(req)
    );
};

agents.saveReport = async (req) => {
    helpers.formatApiResponse(
        200,
   res,
        await api.agents.s3Api.put(req)
    );
};

agents.download = async (req,res) => {
    
        await api.agents.s3Api.download(req,res)

};
agents.dbReport = async (req,res)=>{
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.rainforestApi.dbReportsData(req)
    );
};

   agents.singleAsinReport = async(req, res) =>{
    helpers.formatApiResponse(
        200,
        res,
        await api.agents.rainforestApi.singleAsinReport(req)
    );
   };