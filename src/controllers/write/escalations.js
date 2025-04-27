"use strict";

const api = require("../../api");
const helpers = require("../helpers");

const escalationsControllers = module.exports;

/**
 * @description DT Actualize Application operations (CRUD)
 * @params req, res
 */

escalationsControllers.getEscalations = async (req, res) => {
	helpers.formatApiResponse(
		200,
		res,
		await api.escalations.escalations.getEscalations(req)
	);
};

escalationsControllers.updateEscalations = async (req, res) => {
	helpers.formatApiResponse(
		200,
		res,
		await api.escalations.escalations.updateEscalation(req)
	);
};

escalationsControllers.getAccounts = async (req, res) => {
	helpers.formatApiResponse(
		200,
		res,
		await api.escalations.thresholds.getAccounts(req)
	);
};

escalationsControllers.updateThreshold = async (req, res) => {
	helpers.formatApiResponse(
		200,
		res,
		await api.escalations.thresholds.updateThreshold(req)
	);
};
