"use strict";

const escapeController = module.exports;

escapeController.get = async function (req, res, next) {
	var escape = {};
	escape.title = "Home";
	res.render("automate/escape", escape);
};