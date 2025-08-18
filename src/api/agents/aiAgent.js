

const db = require("../../database");
// const { ObjectId, Collection } = require("mongodb");
const COLLECTIONS = require("../../database/mongo/collections");
// const prompts = require("../../services/prompts");
const nconf = require("nconf");
const AuditOrchestrator = require("../../services/agentSuite/orchestrator");


const {
  getBrandName,
  getLast15DaysRange,
  checkIfAuditExists,
  getAsinListForBrand,
  generateAuditId,
  insertAuditRun,
  sendAsinsToQueue
} = require("./services/storeAuditServices");



// Create orchestrator instance
const orchestrator = new AuditOrchestrator();
const agentApi = module.exports;


agentApi.generateReport = async (req) => {
  try {
    const asin = req.params.asin
    const date = new Date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const checkReport = await db.getObject(`asin:${asin}:month:${year}-${month}`, [], COLLECTIONS.REPORT);
    if (checkReport) {
      console.log("check report data --->", checkReport)
      return checkReport
    }


    const data = await orchestrator.executeAllAgents(asin);
    console.log("data of the audit -->", data);


    return data;


  } catch (error) {
    console.log("error in the generate report -->", error);
    throw new Error("Error in the generate report api");


  }
};

agentApi.brandStoreReport = async (req) => {
  try {
    const brandName = getBrandName(req);
    const dateRange = getLast15DaysRange();
    const existingAudit = await checkIfAuditExists(brandName, dateRange);

    if (existingAudit) {
      return {
        
        message: "Audit already available. Please check in dashboard.",
        recentData: existingAudit
      };
    }

    const asinList = await getAsinListForBrand(brandName);
    if (asinList.length == 0) {
      return {
        message: `No ASINs found for brand: ${brandName}.`
      };
    }

    const auditId = generateAuditId(brandName);
    const auditDoc = await insertAuditRun(brandName, auditId, asinList.length);
    await sendAsinsToQueue(asinList, brandName, auditId);

    return {
      message: "Audit started successfully. Please check the dashboard for progress.",
      auditDoc};

  } catch (err) {
    console.error("Error in Starting the Audit:", err);
  }
};

agentApi.getBrandAudit = async (req) => {
try{
  const data = await db.client.collection(COLLECTIONS.AUDIT_RUNS).find({}).toArray();
  console.log("data of the audit runs --->", data);
  return data; 

}catch(err){
  console.error("Error in fetching brand audits:", err);
  return {
      message: "Error fetching brand audits. Please try again later.",
      error: err.message,
    };
}
}


// agentApi.getBrandAsins = async (req) => {
//   try {
//     const { auditId } = req.params;

//     if (!auditId) {
//       return {
//         success: false,
//         message: "Missing auditId parameter",
//         data: {}
//       };
//     }

//     const auditMeta = await db.client
//       .collection(COLLECTIONS.AUDIT_RUNS)
//       .findOne({ auditId });

//     const reports = await db.client
//       .collection(COLLECTIONS.REPORT)
//       .find({ auditId })
//       .toArray();

//     if (!auditMeta || reports.length === 0) {
//       return {
//         success: true,
//         message: "No reports found for this auditId",
//         data: {
//           storeName: auditMeta?.brandName || "",

//           summary: {
//             overallScore: 0,
//             totalProducts: 0,
//             highPerforming: 0,
//             needsAttention: 0
//           },
//           asins: []
//         }
//       };
//     }

//     // Summary Calculation
//     const totalProducts = reports.length;
//     let highPerforming = 0;
//     let needsAttention = 0;
//     let scoreSum = 0;

//     const asins = reports.map(report => {
//       const {
//         asin,
//         title = "",
//         reports: detailReports,
//         _key,
//         date
//       } = report;

//       // Pull individual category scores safely
//       const titleScore = detailReports?.title?.overall_score || null;
//       const imageScore = detailReports?.image?.overall_score || null;
//       const bulletScore = detailReports?.bulletPoint?.overall_score || null;
//       const descriptionScore = detailReports?.description?.overall_score || null;

//       // Compute overall score (from audit_overview if available)
//       const overallScore = detailReports?.audit_overview?.overall_score || null;

//       if (overallScore !== null) {
//         scoreSum += overallScore;
//         if (overallScore >= 7) highPerforming += 1;
//         else needsAttention += 1;
//       }

//       return {
//         asin,
//         title,
//         _key,
//         lastAudited: date,
//         overallScore,
//         categoryScores: {
//           title: titleScore,
//           images: imageScore,
//           bullets: bulletScore,
//           description: descriptionScore
//         }
//       };
//     });

//     const averageScore =
//       totalProducts > 0 ? Number((scoreSum / totalProducts).toFixed(2)) : null;

//     const formattedData = {
//       storeName: auditMeta.brandName,
//       summary: {
//         overallScore: averageScore,
//         totalProducts,
//         highPerforming,
//         needsAttention
//       },
//       asins
//     };

//     return {
//       success: true,
//       message: "Data fetched successfully",
//       data: formattedData
//     };

//   } catch (err) {
//     console.error("Error fetching audit reports:", err);
//     return {
//       success: false,
//       message: "Internal Server Error",
//       error: err.message || err,
//       data: {}
//     };
//   }
// };

agentApi.getBrandAsins = async (req) => {
  try {
    const { auditId } = req.params;

    if (!auditId) {
      return {
        success: false,
        message: "Missing auditId parameter",
        data: {}
      };
    }

    const auditMeta = await db.client
      .collection(COLLECTIONS.AUDIT_RUNS)
      .findOne({ auditId });

    const reports = await db.client
      .collection(COLLECTIONS.REPORT)
      .find({ auditId })
      .toArray();

    if (!auditMeta || reports.length === 0) {
      return {
        success: true,
        message: "No reports found for this auditId",
        data: {
          storeName: auditMeta?.brandName || "",
          summary: {
            overallScore: 0,
            totalProducts: 0,
            highPerforming: 0,
            needsAttention: 0
          },
          asins: []
        }
      };
    }

    // 🆕 Extract category_scores.scores from auditMeta.summary
   let metaCategoryScores = null;
let humanSummary = null;

if (Array.isArray(auditMeta.summary)) {
  for (const item of auditMeta.summary) {
    if (item?.type === "category_scores" && typeof item.scores === "object") {
      metaCategoryScores = item.scores;
    }

    if (item?.type === "human_summary") {
      humanSummary = item.text;
    }

    // Break early if both are found
    if (metaCategoryScores && humanSummary) break;
  }
}
    // Summary Calculation
    const totalProducts = reports.length;
    let highPerforming = 0;
    let needsAttention = 0;
    let scoreSum = 0;

    const asins = reports.map(report => {
      const {
        asin,
        title = "",
        reports: detailReports,
        _key,
        date
      } = report;

      const titleScore = detailReports?.title?.overall_score || null;
      const imageScore = detailReports?.image?.overall_score || null;
      const bulletScore = detailReports?.bulletPoint?.overall_score || null;
      const descriptionScore = detailReports?.description?.overall_score || null;

      const overallScore = detailReports?.audit_overview?.overall_score || null;

      if (overallScore !== null) {
        scoreSum += overallScore;
        if (overallScore >= 7) highPerforming += 1;
        else needsAttention += 1;
      }

      return {
        asin,
        title,
        _key,
        lastAudited: date,
        overallScore,
        categoryScores: {
          title: titleScore,
          images: imageScore,
          bullets: bulletScore,
          description: descriptionScore
        }
      };
    });

    const averageScore =
      totalProducts > 0 ? Number((scoreSum / totalProducts).toFixed(2)) : null;

    // Final data format
    const formattedData = {
      storeName: auditMeta.brandName,
      summary: {
        overallScore: averageScore,
        totalProducts,
        highPerforming,
        needsAttention
      },
      asins,
       metaCategoryScores ,
      humanSummary
    };

    return {
      success: true,
      message: "Data fetched successfully",
      data: formattedData
    };

  } catch (err) {
    console.error("Error fetching audit reports:", err);
    return {
      success: false,
      message: "Internal Server Error",
      error: err.message || err,
      data: {}
    };
  }
};
