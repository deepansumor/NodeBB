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
		[...accountMiddlewares],
		controllers.threshold.get
	);

	setupPageRoute(
		app,
		"/p-thresholds",
		[...accountMiddlewares],
		controllers.pthreshold.get
	);
	setupPageRoute(
		app,
		"/home",
		accountMiddlewares,
		controllers.escape.get
	);

		setupPageRoute(
		app,
		"/v2/escalations",
		accountMiddlewares,
		controllers.escalationV2.get
	);
};
