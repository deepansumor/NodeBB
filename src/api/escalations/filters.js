const db = require("../../database");
const filters = module.exports


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
    pipeline.push({ $sort: {timestamp: -1 } })
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