define("forum/automate/portfolio/config", [], function () {
  return {
    requiredMetrics: ['ACOS', 'ROAS', 'sales', 'spend'],
    defaultThresholds: {
      ACOS: 2.0, ROAS: 12, sales: 1000, spend: 1000,
      orders: 100, CTR: 1.2, CVR: 2.5, CPC: 8, clicks: 150, impressions: 5000
    },
    metricUnits: { 
      // CTR: '%', CPC: '₹'
     }
  };
});
