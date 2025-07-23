const db = require("../../database");

const filters = module.exports



filters.get = async function (req) {

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

  console.log("filters called with params --->", req.query)
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
    const pipeline = buildAggregationPipeline({
      pcid,
      stage,
      startDate,
      endDate,
      locked,
      privilegeValue,
      portfolioName
    });

    // const pageData = parseInt(page, 10) || 1;
    const limit = 20;
    const safePage = parseInt(page, 10) || 1;


    const safeSkip = (safePage - 1) * limit;

    // Add pagination stages
    pipeline.push({ $skip: safeSkip });
    pipeline.push({ $limit: limit });

    console.log("the pipeline --->", pipeline)
    const result = await db.aggregation(pipeline);

    console.log("result length ---->", result.length);
    return { result };

  } catch (error) {
    console.log("error in the filreter --->", error)
  }
}



function buildAggregationPipeline({
  pcid = null,
  stage = null,
  startDate = null,
  endDate = null,
  locked = null,
  privilegeValue = "05", // default if not provided
  portfolioName = null

}) {


  // Build dynamic $match object
  console.log("checking the pipeline")


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

  if (portfolioName){
    matchConditions.portfolioName = portfolioName;
  }


  console.log("the pipeline match stages -->", matchConditions)

  const pipeline = [];

  // 1. Match topics
  pipeline.push({ $match: matchConditions });

  // 2. Add default locked field
  pipeline.push({
    $addFields: {
      locked: { $ifNull: ["$locked", 0] }
    }
  });

  // 3. Lookup subcategory
  pipeline.push({
    $lookup: {
      from: "objects",
      let: { topicCid: "$cid" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$cid", "$$topicCid"] },
                { $ne: ["$parentCid", 0] },
                {
                  $regexMatch: {
                    input: { $ifNull: ["$_key", ""] },
                    regex: "^category"
                  }
                }
              ]
            }
          }
        }
      ],
      as: "subcategory"
    }
  });

  pipeline.push({ $unwind: "$subcategory" });

  if (pcid !== null) {
    pipeline.push({
      $match: {
        $expr: {
          $eq: ["$subcategory.parentCid", parseInt(pcid, 10)]
        }
      }
    });
  }
  // 5. Lookup privileges
  pipeline.push({
    $lookup: {
      from: "objects",
      let: { cid: "$subcategory.cid" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $regexMatch: {
                    input: "$_key",
                    regex: {
                      $concat: [
                        "^group:cid:",
                        { $toString: "$$cid" },
                        ":privileges:"
                      ]
                    }
                  }
                },
                {
                  $eq: ["$value", String(privilegeValue)]
                }
              ]
            }
          }
        }
      ],
      as: "privileges"
    }
  });

  // 6. Merge subcategory and privileges into result
  pipeline.push({
    $addFields: {

      privileges: "$privileges"
    }
  });



  return pipeline;
}

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

filters.getAllPortfolios = async function (req) {
  try {

    const pcid = parseInt(req.query.pcid, 10);
    console.log("pcid in the getAllPortfolios --->", req.query)
    const pipeline = [
      {
        $match: {
          _key: { $regex: "^topic:" },
          cid: { $exists: true, $ne: null },
          portfolioName: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: "objects",
          let: { topicCid: "$cid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$cid", "$$topicCid"] },
                    { $ne: ["$parentCid", 0] },
                    {
                      $regexMatch: {
                        input: { $ifNull: ["$_key", ""] },
                        regex: "^category"
                      }
                    }
                  ]
                }
              }
            }
          ],
          as: "subcategory"
        }
      },
      {
        $unwind: "$subcategory"
      },
      {
        $match: {
          "subcategory.parentCid": pcid
        }
      },
      {
        $group: {
          _id: "$portfolioName"
        }
      },
      {
        $project: {
          _id: 0,
          portfolioName: "$_id"
        }
      }
    ]

    const result = await db.aggregation(pipeline);
    return result;

  } catch (error) {
    console.log("error in the getAllPortfolios -->", error)
  }
}
