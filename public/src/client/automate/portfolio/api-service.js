define("forum/automate/portfolio/api-service", ["api", "./state"], function (api, state) {
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

  function saveThresholds(account) {
  if (!account || !account.meta) {
    console.error("Invalid account object passed to saveThresholds:", account);
    return;
  }

  const flattenThresholds = (thresholds) => {
    const flattened = {};
    Object.entries(thresholds).forEach(([metric, val]) => {
      if (val && typeof val === 'object' && 'value' in val) {
        flattened[metric] = val.value;
      } else {
        flattened[metric] = val;
      }
    });
    return flattened;
  };

  const payload = {
    meta: {
      profileId: account.meta.profileId,
      waitTimeSop:account.meta.waitTimeSop,
      updatedAt: new Date().toISOString(),
      updatedBy: "Current User",

      portfolios: account.meta.portfolios.map(p => ({
        portfolioId: p.portfolioId,
        portfolioName: p.portfolioName,
        createdAt: p.createdAt,
        alertsEnabled: p.alertsEnabled,
        thresholds: flattenThresholds(p.thresholds),

      }))
    }
  };

  return api.put(`/categories/${account.cid}`, payload);
}


  return { fetchAccounts, saveThresholds };
});
