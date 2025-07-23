"use strict";

const escalationsApi = module.exports;

escalationsApi.escalations = require("./escalations");
escalationsApi.thresholds = require("./thresholds");
escalationsApi.filters = require("./filters")