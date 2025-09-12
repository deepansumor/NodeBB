
const router = require("express").Router();
const middleware = require("../../middleware");
const routeHelpers = require("../helpers");
const controllers = require("../../controllers");
const { setupApiRoute } = routeHelpers;

module.exports = function () {
    const middlewares = [middleware.ensureLoggedIn];

    setupApiRoute(
        router,
        "post",
        "/generate-report/:asin",
        [],
        controllers.write.agents.generateReport
    );

    setupApiRoute(
        router,
        "post",
        "/generate-report/store/:brandName",
        [],
        controllers.write.agents.brandStoreReport
    );

    setupApiRoute(
        router,
        "get",
        "/brand-audit",
        [],
        controllers.write.agents.getBrandAudit
    );

    //  setupApiRoute(
    //     router,
    //     "get",
    //     "/data/fetch",
    //     [],
    //     controllers.write.agents.forceFetchASINData
    // );

     setupApiRoute(
        router,
        "get",
        "/data",
        [],
        controllers.write.agents.getAsinData
    );

    //  setupApiRoute(
    //     router,
    //     "get",
    //     "/report",
    //     [],
    //     controllers.write.agents.getReport
    // );
    setupApiRoute(
        router,
        "get",
        "/report/download/:brand/:asin/:date",
        [...middlewares],
        controllers.write.agents.download
    );

    setupApiRoute(
        router,
        "get",
        "/report",
        [...middlewares],
        controllers.write.agents.dbReport
    );

    setupApiRoute(
        router,
        "get",
        "/report/single/:key",
        [...middlewares],
        controllers.write.agents.singleAsinReport
    );

    setupApiRoute(
        router,
        "get",
        "/report/brand/:auditId",
        [...middlewares],
        controllers.write.agents.getBrandAsins
    );
    setupApiRoute(
        router,
        "get",
        "/start-oauth",

        controllers.write.agents.authStart
    );

    setupApiRoute(
        router,
        "get",
        "/callback",

        controllers.write.agents.authFinish
    );


    return router;
}