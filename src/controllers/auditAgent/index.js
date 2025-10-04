
"use strict";


const helpers = require("../helpers");

const Controllers = module.exports;
Controllers.pdpAudit = require("./pdp-audit");
Controllers.brandAudit = require("./store-audit");
Controllers.dashboard = require("./dashboard");
Controllers.thankyou = require("./thank-you")
Controllers.home = require("./home")