"use strict";

const moment = require("moment");
const db = require("../../../database");
const {groupEscalationData} = require("./utils");




// --- Fetch Escalation Data 
async function getEscalationperBrand() {
  try {

    const formattedDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
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

    const escalationData = groupEscalationData(result);
    console.log("Escalation Data -->", escalationData);


    return escalationData;

  } catch (error) {
    console.log("Error in getEscalationperBrand API -->", error);
  }
}



// --- Fetch Remark Data
async function getRemarkperBrand() {
  try {

    const start = moment().subtract(3, 'days').startOf('day').toISOString();  // Yesterday 00:00:00
    const end = moment().subtract(1, 'days').endOf('day').toISOString();                          // Today 23:59:59

    console.log("Start Date (Yesterday):", start);
    console.log("End Date (Today):", end);


    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic" },
          resolvedAt: { $gte: start, $lte: end },
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

    const escalationData = groupEscalationData(result);
    console.log("Remark Data -->", escalationData);
    return escalationData;
  } catch (error) {
    console.log("Error in getRemarkperBrand API -->", error);
  }
}





module.exports = { getEscalationperBrand, getRemarkperBrand };
