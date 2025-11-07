const db = require("../../database");
const filters = module.exports
const Aws = require("../agents/services/aws")
const S3 = Aws.s3;

filters.getTotalCount = async function (req) {

  try {

    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic:" },
          cid: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$locked",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          locked1: {
            $sum: {
              $cond: [{ $eq: ["$_id", 1] }, "$count", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          locked1: 1
        }
      }
    ]

    const result = await db.aggregation(pipeline);
    return result;

  } catch (error) {
    console.log("error in the getTotalCount -->", error)
  }

}


filters.optimiseFilter = async function (req) {

  let {
    page,
    startDate,
    endDate,
    locked,
    stage,
    pcid,
    privilegeValue,
    portfolioName
  } = req.query

  // console.log("filters called with params --->", req.query)
  if (locked == "null") {
    locked = null
  }
  if (pcid == "null") {
    pcid = null
  }

  if (stage == "null") {
    stage = null
  }

  if (portfolioName == "null") {
    portfolioName = null
  }

  try {
    let pipeline = [];

    const matchConditions = {
      _key: { $regex: "^topic:" },
      cid: { $exists: true, $ne: null },
      escalationDate: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (stage) {
      matchConditions.stage = stage;
    }

    if (locked) {
      if (locked === "0") {
        matchConditions.locked = { $ne: 1 };
      } else {
        matchConditions.locked = parseInt(locked, 10);
      }

    }

    if (pcid) {
      matchConditions.pcid = parseInt(pcid, 10);
    }

    if (portfolioName) {
      matchConditions.portfolioName = portfolioName;
    }

    pipeline.push({ $match: matchConditions });

    // console.log("the pipeline match stages --->", matchConditions)  
    // const pageData = parseInt(page, 10) || 1;
    const limit = 20;
    const safePage = parseInt(page, 10) || 1;


    const safeSkip = (safePage - 1) * limit;

    // Add pagination stages
    pipeline.push({ $sort: { timestamp: -1 } })
    pipeline.push({ $skip: safeSkip });
    pipeline.push({ $limit: limit });

    // console.log("the pipeline --->", pipeline)
    const result = await db.aggregation(pipeline);

    // console.log("result length ---->", result.length);
    return { result };

  } catch (error) {
    console.log("error in the filreter --->", error)
  }
}


filters.getEscalationperBrand = async function (req) {
  try {

    const date = req.query.date || null
    let today = date ? new Date(date) : new Date();

    console.log("data from the filter -->",date,today)
    const hours = today.getHours();
    const minuts = today.getMinutes();
    if (!date) {
      if (hours >= 15 || (hours === 15 && minuts > 0)) {

        today.setDate(today.getDate() - 1);
      } else {
        today.setDate(today.getDate() - 2);
      }
    }

    const escalationDate = today.toISOString().split('T')[0];

    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic" },
          escalationDate
        }
      },
      {
        $group: {
          _id: { pcName: "$pcName", pcid: "$pcid" },
          totalEscalation: { $sum: 1 },
          date: { $first: "$escalationDate" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id.pcName",
          id: "$_id.pcid",
          totalEscalation: 1,
          date: 1
        }
      }
    ];

    const result = await db.aggregation(pipeline);

    console.log(result);
    return result;

  } catch (error) {
    // add the return statement
    console.log("Error in getEscalationperBrand API -->", error);
    return error
  }
};

filters.getAwsData = async function (req) {
  try {
    const BUCKET_NAME = "test-220425";
    const brand = "brand123";
    const dateStr = "2025-11-03"
    const detailKey = `emsAiSummary/${brand}/${dateStr}/escalation-summary.json`;
    const remarkKey = "emsAiSummary/182/2025-11-02/remark-summary.json"
    const detailRes = await Aws.s3.getObject({
      Bucket: BUCKET_NAME,
      Key: detailKey,
    }).promise();

    const remarkRes = await Aws.s3.getObject({
      Bucket: BUCKET_NAME,
      Key: remarkKey,
    }).promise();

    const detailJson = detailRes.Body.toString("utf-8");

    const result = JSON.parse(detailJson);
    const remark = JSON.parse(remarkRes);
    console.log(`✅ Loaded product data for ASIN: ${remark}`);
    return { escalation: result, remark: remark };

  } catch (error) {
    console.log("error in the aws ", error)
  }
}