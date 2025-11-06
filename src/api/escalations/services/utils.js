

/**
 * Groups escalation data by pcName and pcid
 * @param {Array} result - Array of escalation records
 * @returns {Array} escalationData - Processed escalation summary grouped by brand
 */
function groupEscalationData(result) {
  const grouped = result.reduce((acc, item) => {
    const key = `${item.pcName}-${item.pcid}`; // unique key
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  let escalationData = [];

  for (const key in grouped) {
    const items = grouped[key];

    // Build escalation list for each brand
    const escalationList = items.map((item) => ({
      pcName: item.pcName,
      tid: item.tid,
      summary: item.summary,
      escalationDate: item.escalationDate,
      portfolioName: item.portfolioName,
      postcount: item.postcount,
      resolvedAt: item.resolvedAt || "Not resolved",
      postContent: item.postContent || "No post content available",
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
}




/**
 * Prepares formatted brand data text for escalation or remark summaries
 * @param {Object} brand - Brand object containing escalation details
 * @param {string} type - Type of summary ("remark" or "escalation")
 * @returns {string} brandDataText - Formatted string for AI prompt
 */
function prepareBrandDataText(brand, type) {
  return `
Brand: ${brand.brandName}
Date: ${brand.date}
BrandId: ${brand.brandId}
Total Escalations: ${brand.totalEscalations}

${brand.escalations
    .map(e => {
      if (type === "remark") {
        return `Portfolio: ${e.portfolioName}
Post Content: ${typeof e.postContent === "object" ? JSON.stringify(e.postContent) : e.postContent}
Resolved At: ${e.resolvedAt}`;
      } else {
        return `Portfolio: ${e.portfolioName}
Summary: ${e.summary}`;
      }
    })
    .join("\n\n")}
`;
}


module.exports = {groupEscalationData, prepareBrandDataText};
