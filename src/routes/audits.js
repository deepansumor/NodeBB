"use strict";

const helpers = require("./helpers");

const { setupPageRoute } = helpers;

module.exports = function (app, name, middleware, controllers) {
    const middlewares = [middleware.exposeUid];
    const accountMiddlewares = [...middlewares, middleware.ensureLoggedIn];
    setupPageRoute(
        app,
        "/agents",
        accountMiddlewares,
        controllers.dashboard.get);
    setupPageRoute(
        app,
        "/agents/audit",
        accountMiddlewares,
        controllers.pdpAudit.get)
        ;

    setupPageRoute(
        app,
        "/agents/brand-audit",
        accountMiddlewares,
        controllers.storeAudit.get)
        ;

    setupPageRoute(
        app,
        "/agents/brand-summary",
        accountMiddlewares,
        controllers.storeSummary.get)
        ;
    setupPageRoute(
        app,
        "/agents/pdp-report",
        accountMiddlewares,
        controllers.pdpReport.get)
        ;

    setupPageRoute(
        app,
        "/agents/registration-success",
        controllers.thankyou.get)
        ;

    setupPageRoute(
        app,
        "/agents/home",
        controllers.homepage.get)
        ;
}