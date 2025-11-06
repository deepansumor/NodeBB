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
		// controllers.write.escalations.getEscalations
	);

	setupApiRoute(
		router,
		"get",
		"/get-summary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.getSummary
	);

	setupApiRoute(
		router,
		"get",
		"/get-remark-summary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.getRemarkSummary
	);

	setupApiRoute(
		router,
		"get",
		"/getAiSummary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.getAiSummary
	);

	setupApiRoute(
		router,
		"get",
		"/getRemarkAiSummary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.getRemarkAiSummary
	);

	setupApiRoute(
		router,
		"get",
		"/gen-esc-summary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.generateAiSummary
	);

	setupApiRoute(
		router,
		"get",
		"/gen-remark-summary",
		// [...middlewares],
		// controllers.write.escalations.getEscalations
		controllers.write.escalations.generateRemarkAiSummary
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

	setupApiRoute(
		router,
		"get",
		"/dashboard/summary/:brandId/:date",
		[...middlewares],
		controllers.write.escalations.getAiSummary
	);

	return router;
};
