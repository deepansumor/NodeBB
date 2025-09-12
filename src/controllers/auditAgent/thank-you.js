"use strict";



const thankyouController = module.exports;
thankyouController.get = async function (req, res, next) {
    try {
        var thankyou = {};
        thankyou.title = "Registration Successful";

        res.render("auditAgent/thank-you", thankyou);
    } catch (err) {
        console.error("Error rendering template:", err);
        // next(err); // Pass the error to the next middleware
    }
};