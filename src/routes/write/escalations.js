const router = require("express").Router();
const middleware = require("../../middleware");
const routeHelpers = require("../helpers");
const controllers = require("../../controllers");
const { setupApiRoute } = routeHelpers;

module.exports = function () {
	const middlewares = [middleware.ensureLoggedIn];

	setupApiRoute(
		router,
		"get",
		"/get-escalations",
		[...middlewares],
		controllers.write.escalations.getEscalations
	);
	setupApiRoute(
		router,
		"post",
		"/update-escalations",
		[...middlewares],
		controllers.write.escalations.updateEscalations
	);
	setupApiRoute(
		router,
		"get",
		"/get-accounts",
		[...middlewares],
		controllers.write.escalations.getAccounts
	);
	setupApiRoute(
		router,
		"post",
		"/update-thresholds",
		[...middlewares],
		controllers.write.escalations.updateThreshold
	);



	setupApiRoute(
		router,
		"get",
		"/total-count",
		[...middlewares],
		controllers.write.escalations.getTotalCount
	);


	setupApiRoute(
		router,
		"get",
		"/optimise-filter",
		[...middlewares],
		controllers.write.escalations.optimiseFilter
	);

	return router;
};
