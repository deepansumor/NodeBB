"use strict";

const homeController =  module.exports;
homeController.get = async function (req, res, next) {
    try {
        var home = {};
        home.title = "Home";

        res.render("auditAgent/home", home);
    } catch (err) {
        console.error("Error rendering template:", err);
        // next(err); // Pass the error to the next middleware
    }
};