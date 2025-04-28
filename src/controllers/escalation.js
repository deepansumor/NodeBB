"use strict";

const escalationController = module.exports;

escalationController.get = async function (req, res, next) {
	var escalationTable = {};
	escalationTable.title = "escalation table";
	res.render("automate/escalation", escalationTable);
};
