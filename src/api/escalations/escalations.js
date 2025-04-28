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
    
    // Validate the _id before trying to convert to ObjectId
    if (!ObjectId.isValid(body._id)) {
      throw new Error("Escalation id is not valid");
    }

    // Convert the _id to an ObjectId after validating
    const escalationId = new ObjectId(body._id);

    // Find the escalation using the valid ObjectId
    const escalation = await db.find(
      { _id: escalationId },
      0,
      1,
      COLLECTIONS.ESCALATIONS
    );

    if (!escalation || escalation.length === 0) {
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

    // Check for valid privileges if needed (not currently active)
    // const canModerate = await privileges.global.can("topics:moderate", uid);
    // if (!canModerate && body.status !== escalation.status) {
    //   throw new Error("You are not authorized to update status");
    // }

    // Clean and update the escalation
    Object.keys(body).forEach((key) => {
      if (!FIELDS.includes(key)) {
        delete body[key];
      }
    });

    const updatedEscalation = {
      ...escalation[0], // Ensure to update with the first element
      ...body,
    };

    await db.setObject(
      escalation[0]._key, // Access the first element
      updatedEscalation,
      COLLECTIONS.ESCALATIONS
    );

    return "Escalation updated successfully";
  } catch (err) {
    console.error("PATCH /escalations/:id error:", err);
    return { error: err.message };
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
