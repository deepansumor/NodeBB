define("forum/automate/portfolio/api-service", ["api", "./state","./config"], function (api, state, config) {
  async function fetchAccounts() {
    const data = await api.get('/categories');
    return Array.isArray(data.categories) ? data.categories : [];
  }

  // function saveThresholds(account) {
  //   if (!account || !account.meta) {
  //   console.error("Invalid account object passed to saveThresholds:", account);
  //   return;
  //   }
  //   const payload = {
  //     meta: {
  //       profileId: account.meta.profileId,
  //       updatedAt: new Date().toISOString(),
  //       updatedBy: "Current User",
  //       portfolios: account.meta.portfolios.map(p => ({
  //         portfolioId: p.portfolioId,
  //         portfolioName: p.portfolioName,
  //         createdAt: p.createdAt,
  //         alertsEnabled: p.alertsEnabled,
  //         thresholds: p.thresholds,
  //       }))
  //     }
  //   };
  //   return api.put(`/categories/${account.cid}`, payload);
  // }

//   function saveThresholds(account) {
//   if (!account || !account.meta) {
//     console.error("Invalid account object passed to saveThresholds:", account);
//     return;
//   }

//   const flattenThresholds = (thresholds) => {
//     const flattened = {};
//     Object.entries(thresholds).forEach(([metric, val]) => {
//       if (val && typeof val == 'object' && 'value' in val) {
//         flattened[metric] = val.value;
//       } else {
//         flattened[metric] = val;
//       }
//     });
//     return flattened;
//   };

//   const payload = {
//     meta: {
//       profileId: account.meta.profileId,
//       waitTimeSop:account.meta.waitTimeSop,
//       updatedAt: new Date().toISOString(),
//       updatedBy: "Current User",

//       portfolios: account.meta.portfolios.map(p => ({
//         portfolioId: p.portfolioId,
//         portfolioName: p.portfolioName,
//         createdAt: p.createdAt,
//         alertsEnabled: p.alertsEnabled,
//         thresholds: flattenThresholds(p.thresholds),

//       }))
//     }
//   };

//   return api.put(`/categories/${account.cid}`, payload);
// }

function saveThresholds(account) {
  if (!account || !account.meta) {
    console.error("Invalid account object passed to saveThresholds:", account);
    return;
  }

  // ✅ Step 1: Validate required metrics for all enabled portfolios
  const REQUIRED_METRICS = config.requiredMetrics;
  const invalidPortfolios = [];

  account.meta.portfolios.forEach(p => {
    if (p.alertsEnabled) {
      const missingRequired = REQUIRED_METRICS.filter(metric =>
        p.thresholds[metric] == null || p.thresholds[metric] == undefined
      );
      if (missingRequired.length > 0) {
        invalidPortfolios.push({
          name: p.portfolioName,
          missing: missingRequired
        });
      }
    }
  });

  if (invalidPortfolios.length > 0) {
    alert(
      `Please fill the required metrics for the following portfolios:\n` +
      invalidPortfolios.map(p => `• ${p.name}: ${p.missing.join(', ')}`).join('\n')
    );
    return; 
  }

  // ✅ Step 2: Proceed with preparing the payload
  const payload = {
    meta: {
      profileId: account.meta.profileId,
      waitTimeSop: account.meta.waitTimeSop,
      critical : account.meta.critical || "",
      updatedAt: new Date().toISOString(),
      updatedBy:  app?.user?.username||"Current User",
      portfolios: account.meta.portfolios.map(p => ({
        portfolioId: p.portfolioId,
        portfolioName: p.portfolioName,
        createdAt: p.createdAt,
        alertsEnabled: p.alertsEnabled,
        thresholds: p.thresholds
        // flattenThresholds(p.thresholds), 
      }))
    }
  };

  return api.put(`/categories/${account.cid}`, payload);
}

// enable disable alert for portfolio

function updateAlertsStatus(account) {
  if (!account || !account.meta) {
    console.error("Invalid account object passed to updateAlertsStatus:", account);
    return;
  }

  const payload = {
    meta: {
      profileId: account.meta.profileId,
      waitTimeSop: account.meta.waitTimeSop,
      critical : account.meta.critical || "",
      updatedAt: new Date().toISOString(),
      updatedBy: "Current User",
      portfolios: account.meta.portfolios.map(p => ({
        portfolioId: p.portfolioId,
        portfolioName: p.portfolioName,
        createdAt: p.createdAt,
        alertsEnabled: p.alertsEnabled,
        // ✅ Always include thresholds to avoid deletion
        thresholds: p.thresholds || {}
      }))
    }
  };

  return api.put(`/categories/${account.cid}`, payload);
}




  return { fetchAccounts, saveThresholds, updateAlertsStatus  };
});
