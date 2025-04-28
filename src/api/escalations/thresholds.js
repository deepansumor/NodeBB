"use strict";

const db = require("../../database"); // your DB adapter
const thresholdsAPI = module.exports;
const groups = require.main.require("./src/groups");
const COLLECTIONS = require("../../database/mongo/collections");

thresholdsAPI.getAccounts = async (req, res) => {
	try {
		const uid = req.uid;
		// Get all groups for the user
		const userGroups = await groups.getUserGroups([uid]);
		const results = userGroups.map((group) => ({
			groupId: group.name, // NodeBB uses group name as ID
			groupName: group.displayName || group.name, // Prefer readable name
		}));
		return results;
	} catch (err) {
		console.error("GET /thresholds error:", err);
		return { error: "Internal Server Error" };
	}
};


thresholdsAPI.updateThreshold = async (req, res) => {
	try {
		const { profileId, thresholds } = req.body;

		if (!profileId || typeof thresholds !== "object") {
			return { error: "Invalid payload" };
		}

		// Save/update thresholds (assumes a hash in Redis or MongoDB doc update)
		await db.setObject(
			`Thresholds:${profileId}`,
			thresholds,
			COLLECTIONS.THRESHOLDS
		);

		return { success: "Threshold updated successfully" };
	} catch (err) {
		console.error("POST /thresholds error:", err);
		return { error: "Internal Server Error" };
	}
};
