"use strict";

const db = require("../../../database");




// --- Fetch Escalation Data 
async function getEscalationperBrand() {
  try {

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const formattedDate = date.toISOString().split('T')[0]; // "2025-10-29"

    console.log("formattedDate for Escalation Summary:", formattedDate);

    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic" },
          // escalationDate: "2025-11-02"
          escalationDate: formattedDate
        }
      }
    ];

    const result = await db.aggregation(pipeline);
    console.log("Escalation Data Retrieved in getEscalationperBrand:", result);

    const grouped = result.reduce((acc, item) => {
      const key = `${item.pcName}-${item.pcid}`; // unique key
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    let escalationData = [];

    for (const key in grouped) {
      const items = grouped[key];

      // Instead of just summary, return escalation details
      const escalationList = items.map((item) => ({
        pcName: item.pcName,
        tid: item.tid,
        summary: item.summary,
        escalationDate: item.escalationDate,
        portfolioName: item.portfolioName,
        postcount: item.postcount
      }));

      escalationData.push({
        brandName: items[0].pcName,
        brandId: items[0].pcid,
        totalEscalations: items.length,
        date: items[0].escalationDate,
        escalations: escalationList
      });
    }
    console.log("Escalation Data -->", escalationData);

    return escalationData;

  } catch (error) {
    console.log("Error in getEscalationperBrand API -->", error);
  }
}



// --- Fetch Remark Data
async function getRemarkperBrand() {
  try {
    // ✅ Get today's and yesterday's dates
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // ✅ Convert to ISO strings for filtering
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    console.log("Start Date (Yesterday):", start.toISOString());
    console.log("End Date (Today):", end.toISOString());



    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic" },
          resolvedAt: { $gte: start.toISOString(), $lte: end.toISOString() },
        },
      },
      {
        $lookup: {
          from: "objects",
          let: { topicTid: "$tid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $regexMatch: { input: "$_key", regex: "^post" } },
                    { $eq: [{ $toString: "$$topicTid" }, "$tid"] },
                  ],
                },
              },
            },
            { $sort: { timestamp: -1 } },
            { $project: { _id: 0, content: 1, timestamp: 1 } },
            { $limit: 1 },
          ],
          as: "postData",
        },
      },
      // ❗ Only keep topics that have at least one post
      {
        $match: {
          postData: { $ne: [] },
        },
      },
      // Expand postData array
      {
        $unwind: "$postData",
      },
      // Project only topics that have content
      {
        $project: {
          _id: 0,
          tid: 1,
          pcid: 1,
          pcName: 1,
          portfolioName: 1,
          resolvedAt: 1,
          escalationDate: 1,
          postContent: "$postData.content",
          postTimestamp: "$postData.timestamp",
        },
      },
    ];




    console.log("Pipeline for Remark Summary -->", pipeline);

    const result = await db.aggregation(pipeline);
    console.log("Remark Data Retrieved:", result);



    const grouped = result.reduce((acc, item) => {
      const key = `${item.pcName}-${item.pcid}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    let escalationData = [];

    for (const key in grouped) {
      const items = grouped[key];

      const escalationList = items.map(item => ({
        pcName: item.pcName,
        tid: item.tid,
        resolvedAt: item.resolvedAt,
        escalationDate: item.escalationDate,
        portfolioName: item.portfolioName,
        postContent: item.postContent || "No post content available",
      }));

      escalationData.push({
        brandName: items[0].pcName,
        brandId: items[0].pcid,
        totalEscalations: items.length,
        date: items[0].escalationDate,
        escalations: escalationList,
      });
    }

    console.log("Remark Data -->", escalationData);
    return escalationData;
  } catch (error) {
    console.log("Error in getRemarkperBrand API -->", error);
  }
}





module.exports = { getEscalationperBrand, getRemarkperBrand };
