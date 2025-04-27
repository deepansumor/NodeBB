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
		[],
		controllers.write.escalations.getEscalations
	);
	setupApiRoute(
		router,
		"post",
		"/update-escalations",
		[],
		controllers.write.escalations.updateEscalations
	);
	setupApiRoute(
		router,
		"get",
		"/get-accounts",
		[],
		controllers.write.escalations.getAccounts
	);

	return router;
};
