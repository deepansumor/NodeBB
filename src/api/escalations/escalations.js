"use strict";

const db = require("../../database");
const utils = require("../utils");
const COLLECTIONS = require("../../database/mongo/collections");
const groups = require.main.require('./src/groups');
const privileges = require.main.require('./src/privileges');


const escalationsAPI = module.exports;


escalationsAPI.getEscalations = async (req, res) => {
  try {
    const uid = req.body.uid;

    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    const key = `escalation:${uid}`;
    const escalations = await db.find(
      key,
      { status: { $ne: "resolved" } },
      skip,
      limit,
      COLLECTIONS.ESCALATION
    );

    return escalations;
  } catch (err) {
    console.error("GET /escalations error:", err);
    return { error: "Internal Server Error" };
  }
};


escalationsAPI.updateEscalation = async (req, res) => {
  try {
    const uid = req.uid;
    const body = req.body;

    // Fetch existing escalation
    const escalation = await db.getObject(body.escalationId, COLLECTIONS.ESCALATION);
    if (!escalation) {
      return "Escalation not found";
    }

    // Check if user is in group
    const isMember = await groups.isMember(uid, escalation.account_name);

    // Check if user has low privilege (cannot moderate)
    const canModerate = await privileges.global.can('topics:moderate', uid);

    if (isMember && !canModerate) {
      if (body.status && body.status !== escalation.status) {
        return "You are not authorized to update status";
      }
    }

    // Merge and save
    const updatedEscalation = {
      ...escalation,
      ...body,
    };

    await db.setObject(body.escalationId, updatedEscalation, COLLECTIONS.ESCALATION);

    return "Escalation updated successfully";
  } catch (err) {
    console.error("PATCH /escalations/:id error:", err);
    return "Internal Server Error";
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