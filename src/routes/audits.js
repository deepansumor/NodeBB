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
}