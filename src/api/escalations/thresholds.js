"use strict";

const db = require("../../database"); // your DB adapter
const thresholdsAPI = module.exports;
const groups = require("../../groups");
const COLLECTIONS = require("../../database/mongo/collections");

thresholdsAPI.getAccounts = async (req, res) => {
	try {
		const uid = req.uid;

		// Get all groups for the user
		const userGroupsNested = await groups.getUserGroups([uid]);
		const userGroups = userGroupsNested.flat(); // Flatten it

		// Check if userGroups is empty
		if (!userGroups.length) {
			return { message: "No thresholds found for this user." };
		}

		const results = userGroups.map((group) => ({
			groupName: group.name,
			groupSlug: group.slug,
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
			`thresholds:${profileId}`,
			thresholds,
			COLLECTIONS.THRESHOLDS
		);

		return { success: "Threshold updated successfully" };
	} catch (err) {
		console.error("POST /thresholds error:", err);
		return { error: "Internal Server Error" };
	}
};
