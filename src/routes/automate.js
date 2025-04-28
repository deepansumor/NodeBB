"use strict";

const helpers = require("./helpers");

const { setupPageRoute } = helpers;

module.exports = function (app, name, middleware, controllers) {
	const middlewares = [middleware.exposeUid];
	const accountMiddlewares = [...middlewares, middleware.ensureLoggedIn];
	setupPageRoute(
		app,
		"/escalation",
		accountMiddlewares,
		controllers.escalation.get
	);
	setupPageRoute(
		app,
		"/threshold",
		accountMiddlewares,
		controllers.threshold.get
	);
};
