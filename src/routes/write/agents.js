
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
        [...middlewares],
        controllers.write.agents.generateReport
    );

    setupApiRoute(
        router,
        "get",
        "/data/:asin/new",
        [...middlewares],
        controllers.write.agents.createNewASINData
    );

    setupApiRoute(
        router,
        "get",
        "/data/:asin",
        [...middlewares],
        controllers.write.agents.getAsinData
    );

    setupApiRoute(
        router,
        "get",
        "/report/:asin",
        [...middlewares],
        controllers.write.agents.getReport
    );

    setupApiRoute(
        router,
        "post",
        "/report/save/:asin",  //take out "put" || save
        [...middlewares],
        controllers.write.agents.saveReport
    );

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
        "/fetch/data/:asin",
        [...middlewares],
        controllers.write.agents.asinData
    );


    // route sp-api connects to the app-store
    setupApiRoute(
        router,
        "get",
        "/auth/login",
        controllers.write.agents.authStart
    );

    setupApiRoute(
        router,
        "get",
        "/auth/finish",
        controllers.write.agents.authFinish
    );

    return router;
}