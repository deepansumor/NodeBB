"use strict";

const escalationsApi = module.exports;

escalationsApi.escalations = require("./escalations");
escalationsApi.thresholds = require("./thresholds");
escalationsApi.filters = require("./filters");
escalationsApi.aiSummary = require("./services/getAiSummary") ;
escalationsApi.getSummary = require("./services/getSummary") ;
escalationsApi.generateAiSummary = require("./services/generateAiSummary") ;
