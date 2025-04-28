"use strict";

const db = require("../../database");
const utils = require("../utils");
const COLLECTIONS = require("../../database/mongo/collections");
const { ObjectId } = require("mongodb");
const groups = require("../../groups");
const privileges = require.main.require("./src/privileges");

const escalationsAPI = module.exports;

const FIELDS = ["status", "remarks", "ad_type", "cadence", "description"];

escalationsAPI.getEscalations = async (req, res) => {
	try {
		const uid = req.uid;

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const escalations = await db.find(
			{
				users: uid, // checks if uid exists inside users array
				status: { $ne: "resolved" }, // status not resolved
			},
			skip,
			limit,
			COLLECTIONS.ESCALATIONS
		);

		return escalations;
	} catch (err) {
		console.error("GET /escalations error:", err);
		throw new Error(err);
	}
};

escalationsAPI.updateEscalation = async (req, res) => {
	try {
		const uid = req.uid;
		const body = req.body;
		const escalationId = new ObjectId(body._id);
		if (!ObjectId.isValid(escalationId)) {
			throw new Error("Escalation id is not valid ");
		}
		const escalation = await db.find(
			{ _id: escalationId },
			0,
			1,
			COLLECTIONS.ESCALATIONS
		);
		if (!escalation) {
			throw new Error("Escalation not found");
		}

		const group = await groups.getGroupByName(escalation.group);
		if (!group) {
			throw new Error("Group not found");
		}

		// Check if the user is a member of the group using the group ID
		const isMember = await groups.isMember(uid, group._id);

		if (!isMember) {
			throw new Error("Not a member of group");
		}

		// Check if user has low privilege (cannot moderate)
		// const canModerate = await privileges.global.can("topics:moderate", uid);

		// if (!canModerate && body.status != escalation.status) {
		// 	return "You are not authorized to update status";
		// }

		Object.keys(body).forEach((key) => {
			if (!FIELDS.includes(key)) {
				delete body[key];
			}
		});
		// Merge and save
		const updatedEscalation = {
			...escalation,
			...body,
		};

		await db.setObject(
			escalation._key,
			updatedEscalation,
			COLLECTIONS.ESCALATIONS
		);

		return "Escalation updated successfully";
	} catch (err) {
		console.error("PATCH /escalations/:id error:", err);
		throw err;
	}
};

// setObject(payload)

// // setSort
// // escations:groupId, date.now , escaltionId
// // escations:groupId:pending, date.now, escation
// // 		--> On Every Update Previous one will be removed and new one escations:groupId:resolved
// // escation:groupId:userid, now, escationId
// // escation:userid, now, escationId

// (async () => {
// 	console.log("Test");
// 	const payload = {
// 		_key: "test:data:1",
// 		params: { 1: 1 },
// 	};
// 	await db.setObject(payload._key, payload, "escalations");

// 	let data = await db.getObject(payload._key, null, "escalations");
// 	console.log(data);
// })();
