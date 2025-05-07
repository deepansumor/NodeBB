"use strict";

const helpers = require("./helpers");

const { setupPageRoute } = helpers;

module.exports = function (app, name, middleware, controllers) {
	const middlewares = [middleware.exposeUid];
	const accountMiddlewares = [...middlewares, middleware.ensureLoggedIn];
	setupPageRoute(
		app,
		"/escalations",
		accountMiddlewares,
		controllers.escalation.get
	);
	setupPageRoute(
		app,
		"/thresholds",
		accountMiddlewares,
		controllers.threshold.get
	);
};
