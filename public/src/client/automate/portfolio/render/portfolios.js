// define("forum/automate/portfolio/render/portfolios", [
//   "jquery", 
//   "../state", 
//   "../config"
// ], function ($, state, config) {
//   function renderPortfolioMetrics(portfolio) {
//     return Object.entries(portfolio.thresholds).map(([metric, value]) => {
//       const unit = config.metricUnits[metric] || '';
//       const isDisabled = !portfolio.alertsEnabled;
//       return `
//         <div class="col-lg-2-4 col-md-4 col-sm-6">
//           <div class="p-3 border rounded">
//             <label class="form-label mb-1 small">${metric}</label>
//             <input type="number" class="form-control form-control-sm metric-value-input"
//               data-portfolio-id="${portfolio.portfolioId}"
//               data-metric="${metric}"
//               value="${value ?? ''}" step="0.01"
//               ${isDisabled ? 'disabled' : ''}>
//             ${unit}
//           </div>
//         </div>
//       `;
//     }).join('');
//   }

//   function renderPortfolios() {
//     const container = $('#portfolioList');
//     const emptyState = $('#emptyState');

//     const account = state.accounts.find(a => a.meta.profileId == state.currentAccount);
//     const portfolios = account?.meta?.portfolios || [];

//     const filtered = portfolios.filter(p =>
//       p.portfolioName.toLowerCase().includes(state.searchTerm.toLowerCase())
//     );

//     if (filtered.length == 0) {
//       container.html('');
//       emptyState.removeClass('d-none');
//       return;
//     }

//     emptyState.addClass('d-none');
//     container.html(filtered.map(p => `
//       <div class="portfolio-card">
//         <div class="p-3">
//           <h6>${p.portfolioName}</h6>
//           ${renderPortfolioMetrics(p)}
//         </div>
//       </div>
//     `).join(''));
//   }

//   return { renderPortfolios };
// });


define("forum/automate/portfolio/render/portfolios", [
  "jquery",
  "../state",
  "../config"
], function ($, state, config) {

  // function renderPortfolioMetrics(portfolio) {
  //   return Object.entries(portfolio.thresholds).map(([metric, value]) => {

  //      const isRequired = config.requiredMetrics.includes(metric);
  //     const isEnabled = value !== null && value !== undefined;
  //     const unit = config.metricUnits[metric] || '';
  //     const isDisabled = !portfolio.alertsEnabled;
  //     return `
  //       <div class="col-lg-2-4 col-md-4 col-sm-6">
  //         <div class="p-3 border rounded">
  //           <label class="form-label mb-1 small">${metric}</label>
  //           <input type="number" class="form-control form-control-sm metric-value-input"
  //             data-portfolio-id="${portfolio.portfolioId}"
  //             data-metric="${metric}"
  //             value="${value ?? ''}" step="0.01"
  //             ${isDisabled ? 'disabled' : ''}>
  //           ${unit}
  //         </div>
  //       </div>
  //     `;
  //   }).join('');
  // }


function renderPortfolioMetrics(portfolio) {
  return Object.entries(config.defaultThresholds).map(([metric]) => {
    const isRequired = config.requiredMetrics.includes(metric);

    // 🔒 Ensure thresholds object exists
    portfolio.thresholds = portfolio.thresholds || {};

    // ✅ Handle missing metrics gracefully
    const value = portfolio.thresholds.hasOwnProperty(metric)
      ? portfolio.thresholds[metric]
      : null;

    const isEnabled = value !== null && value !== undefined;
    const unit = config.metricUnits[metric] || '';
    const disabledByAlerts = !portfolio.alertsEnabled;
    const inputDisabled = disabledByAlerts || (!isRequired && !isEnabled);

    const toggleHTML = !isRequired
      ? `<div class="form-check form-switch me-2">
          <input class="form-check-input toggle-metric-checkbox" type="checkbox"
            data-portfolio-id="${portfolio.portfolioId}" data-metric="${metric}" 
            ${isEnabled ? 'checked' : ''} ${disabledByAlerts ? 'disabled' : ''}>
        </div>`
      : '';

    const unitHTML = unit ? `<span class="unit-label">${unit}</span>` : '';

    return `
      <div class="col-lg-2-4 col-md-4 col-sm-6">
        <div class="p-3 border rounded">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center">
              ${toggleHTML}
              <label class="form-label mb-0 small">
                ${metric} ${isRequired ? '<span class="required-indicator">*</span>' : ''}
              </label>
            </div>
          </div>
          <div class="position-relative">
            <input type="number" class="form-control form-control-sm metric-value-input"
              data-portfolio-id="${portfolio.portfolioId}"
              data-metric="${metric}" value="${value ?? ''}" step="0.01"
              ${inputDisabled ? 'disabled' : ''}>
            ${unitHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');
}


//   function renderPortfolioMetrics(portfolio) {
//   return Object.entries(config.defaultThresholds).map(([metric]) => {
//     const isRequired = config.requiredMetrics.includes(metric);
//     // const value = portfolio.thresholds[metric] || '';
//     const thresholds = portfolio.thresholds || {};
// const value = thresholds.hasOwnProperty(metric) ? thresholds[metric] : '';
//     const isEnabled = value !== null && value !== undefined;
//     const unit = config.metricUnits[metric] || '';
//     const disabledByAlerts = !portfolio.alertsEnabled;
//     const inputDisabled = disabledByAlerts || (!isRequired && !isEnabled);

//     const toggleHTML = !isRequired
//       ? `<div class="form-check form-switch me-2">
//           <input class="form-check-input toggle-metric-checkbox" type="checkbox"
//             data-portfolio-id="${portfolio.portfolioId}" data-metric="${metric}" 
//             ${isEnabled ? 'checked' : ''} ${disabledByAlerts ? 'disabled' : ''}>
//         </div>`
//       : '';

//     const unitHTML = unit ? `<span class="unit-label">${unit}</span>` : '';

//     return `
//       <div class="col-lg-2-4 col-md-4 col-sm-6">
//         <div class="p-3 border rounded">
//           <div class="d-flex align-items-center justify-content-between mb-2">
//             <div class="d-flex align-items-center">
//               ${toggleHTML}
//               <label class="form-label mb-0 small">
//                 ${metric} ${isRequired ? '<span class="required-indicator">*</span>' : ''}
//               </label>
//             </div>
//           </div>
//           <div class="position-relative">
//             <input type="number" class="form-control form-control-sm metric-value-input"
//               data-portfolio-id="${portfolio.portfolioId}"
//               data-metric="${metric}" value="${value ?? ''}" step="0.01"
//               ${inputDisabled ? 'disabled' : ''}>
//             ${unitHTML}
//           </div>
//         </div>
//       </div>
//     `;
//   }).join('');
// }

  // function renderPortfolios() {
  //   const container = $('#portfolioList');
  //   const emptyState = $('#emptyState');

  //   const account = state.accounts.find(a => a.meta.profileId == state.currentAccount);
  //   const portfolios = account?.meta?.portfolios || [];

  //   const filtered = portfolios.filter(p =>
  //     p.portfolioName.toLowerCase().includes(state.searchTerm.toLowerCase())
  //   );

  //   if (filtered.length == 0) {
  //     container.html('');
  //     emptyState.removeClass('d-none');
  //     return;
  //   }

  //   emptyState.addClass('d-none');

  //   container.html(filtered.map(p => {
  //     const expanded = p.expanded ?? true;

  //     const lastUpdated = p.lastUpdatedBy
  //       ? `<p class="text-muted small mb-0">Last updated by ${p.lastUpdatedBy} at ${p.lastUpdatedAt}</p>`
  //       : '';

  //     const metricsSection = expanded
  //       ? `<div class="mt-3 pt-3 border-top">
  //           <div class="row g-3">
  //             ${renderPortfolioMetrics(p)}
  //           </div>
  //         </div>`
  //       : '';

  //     return `
  //     <div class="portfolio-card ${p.alertsEnabled ? '' : 'disabled'} ${expanded ? 'expanded' : ''}">
  //       <div class="p-3">
  //         <div class="d-flex justify-content-between align-items-center">
  //           <div class="d-flex align-items-center gap-3">
  //             <div class="form-check form-switch">
  //               <input class="form-check-input toggle-enabled-checkbox" type="checkbox"
  //                 data-id="${p.portfolioId}" ${p.alertsEnabled ? 'checked' : ''}>
  //             </div>
  //             <div class="flex-grow-1">
  //               <h6 class="mb-0 fw-semibold">${p.portfolioName}</h6>
  //               <p class="text-muted small mb-0">Portfolio ID: ${p.portfolioId}</p>
  //               ${lastUpdated}
  //             </div>
  //           </div>
  //           <div class="d-flex align-items-center gap-2">
  //             <button class="btn btn-outline-primary btn-sm use-defaults-btn"
  //               data-id="${p.portfolioId}" ${!p.alertsEnabled ? 'disabled' : ''}>
  //               <i class="fas fa-files me-1"></i> Use Defaults
  //             </button>
  //             <button class="btn btn-ghost btn-sm toggle-expand-btn" data-id="${p.portfolioId}">
  //               <i class="fas fa-chevron-${expanded ? 'up' : 'down'}"></i>
  //             </button>
  //           </div>
  //         </div>
  //         ${metricsSection}
  //       </div>
  //     </div>
  //     `;
  //   }).join(''));
  // }

//  function renderPortfolioMetrics(portfolio) {
//   return Object.entries(portfolio.thresholds).map(([metric, value]) => {
//     const enabled = portfolio.enabledMetrics?.[metric] ?? true; // default: true
//     const isDisabled = !portfolio.alertsEnabled || !enabled;

//     return `
//       <div class="col-lg-2-4 col-md-4 col-sm-6">
//         <div class="p-3 border rounded">
//           <div class="d-flex justify-content-between align-items-center mb-1">
//             <label class="form-label small mb-0">${metric}</label>
//             <div class="form-check form-switch m-0">
//               <input class="form-check-input toggle-metric-checkbox" type="checkbox"
//                 data-portfolio-id="${portfolio.portfolioId}"
//                 data-metric="${metric}" ${enabled ? 'checked' : ''}>
//             </div>
//           </div>
//           <div class="input-group input-group-sm">
//             <input type="number" class="form-control metric-value-input"
//               data-portfolio-id="${portfolio.portfolioId}"
//               data-metric="${metric}"
//               value="${value ?? ''}" step="0.01"
//               ${isDisabled ? 'disabled' : ''}>
//             <span class="input-group-text">${config.metricUnits?.[metric] || ''}</span>
//           </div>
//         </div>
//       </div>
//     `;
//   }).join('');
// }


// render portfolio

// function renderPortfolioMetrics(portfolio) {
//   return Object.entries(portfolio.thresholds).map(([metric, value]) => {
//     const unit = config.metricUnits[metric] || '';
//     const isRequired = config.requiredMetrics.includes(metric);
//     const isEnabled = isRequired || value !== null && value !== undefined;
//     const inputDisabled = !isEnabled || !portfolio.alertsEnabled;

//     const toggleHTML = !isRequired
//       ? `<div class="form-check form-switch mb-2">
//           <input class="form-check-input toggle-metric-checkbox"
//                  type="checkbox"
//                  data-portfolio-id="${portfolio.portfolioId}"
//                  data-metric="${metric}"
//                  ${isEnabled ? 'checked' : ''}>
//         </div>`
//       : '';

//     return `
//       <div class="col-lg-2-4 col-md-4 col-sm-6">
//         <div class="p-3 border rounded">
//           <div class="d-flex align-items-center justify-content-between mb-2">
//             ${toggleHTML}
//             <label class="form-label mb-0 small">
//               ${metric} ${isRequired ? '<span class="required-indicator">*</span>' : ''}
//             </label>
//           </div>
//           <input type="number" class="form-control form-control-sm metric-value-input"
//             data-portfolio-id="${portfolio.portfolioId}"
//             data-metric="${metric}"
//             value="${value ?? ''}" step="0.01"
//             ${inputDisabled ? 'disabled' : ''}>
//           ${unit}
//         </div>
//       </div>
//     `;
//   }).join('');
// }




  function renderPortfolios() {
  const container = $('#portfolioList');
  const emptyState = $('#emptyState');

  const accounts = state.getAccounts(); 
  const currentAccountId = state.getCurrentAccount(); 

  const account = accounts.find(a => a.meta.profileId == currentAccountId);
  const portfolios = account?.meta?.portfolios || [];

  const searchTerm = state.getSearchTerm(); 
  const filtered = portfolios.filter(p =>
    p.portfolioName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length == 0) {
    container.html('');
    emptyState.removeClass('d-none');
    return;
  }

  emptyState.addClass('d-none');

  container.html(filtered.map(p => {
    const expanded = p.expanded ?? true;

    const lastUpdated = p.lastUpdatedBy
      ? `<p class="text-muted small mb-0">Last updated by ${p.lastUpdatedBy} at ${p.lastUpdatedAt}</p>`
      : '';

    const metricsSection = expanded
      ? `<div class="mt-3 pt-3 border-top">
          <div class="row g-3">
            ${renderPortfolioMetrics(p)}
          </div>
        </div>`
      : '';

    return `
    <div class="portfolio-card ${p.alertsEnabled ? '' : 'disabled'} ${expanded ? 'expanded' : ''}">
      <div class="p-3">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="form-check form-switch">
              <input class="form-check-input toggle-enabled-checkbox" type="checkbox"
                data-id="${p.portfolioId}" ${p.alertsEnabled ? 'checked' : ''}>
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-0 fw-semibold">${p.portfolioName}</h6>
              <p class="text-muted small mb-0">Portfolio ID: ${p.portfolioId}</p>
              ${lastUpdated}
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-primary btn-sm use-defaults-btn"
              data-id="${p.portfolioId}" ${!p.alertsEnabled ? 'disabled' : ''}>
              <i class="fas fa-files me-1"></i> Use Defaults
            </button>
            <button class="btn btn-ghost btn-sm toggle-expand-btn" data-id="${p.portfolioId}">
              <i class="fas fa-chevron-${expanded ? 'up' : 'down'}"></i>
            </button>
          </div>
        </div>
        ${metricsSection}
      </div>
    </div>
    `;
  }).join(''));
}


  return { renderPortfolios };
});
