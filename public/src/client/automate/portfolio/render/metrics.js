// define("forum/automate/portfolio/render/metrics", [
//   "jquery",
//   "../state",
//   "../config",
//   "../utils/helpers"
// ], function ($, state, config, helpers) {

//   const $container = $('#defaultMetrics');

//   function renderDefaultMetrics() {
//     $container.empty();

//     Object.entries(config.defaultThresholds).forEach(([metric, value]) => {
//       const isRequired = config.requiredMetrics.includes(metric);
//       const isEnabled = value !== null && value !== undefined;
//       const unit = config.metricUnits[metric] || '';
//       const inputDisabled = !isEnabled && !isRequired;

//       const toggleHTML = !isRequired
//         ? `<div class="form-check form-switch me-2">
//              <input class="form-check-input metric-toggle" type="checkbox" data-metric="${metric}"
//                     ${isEnabled ? 'checked' : ''}>
//            </div>`
//         : '';

//       const unitHTML = unit ? `<span class="unit-label">${unit}</span>` : '';

//       const html = `
//         <div class="col-lg-2-4 col-md-4 col-sm-6 mb-3">
//           <div class="metric-card">
//             <div class="d-flex align-items-center justify-content-between mb-2">
//               <div class="d-flex align-items-center">
//                 ${toggleHTML}
//                 <label class="form-label mb-0 small">
//                   ${metric} ${isRequired ? '<span class="required-indicator">*</span>' : ''}
//                 </label>
//               </div>
//             </div>
//             <div class="position-relative">
//               <input type="number" class="form-control form-control-sm metric-input" 
//                      data-metric="${metric}" value="${value}" step="0.01"
//                      ${inputDisabled ? 'disabled' : ''}>
//               ${unitHTML}
//             </div>
//           </div>
//         </div>
//       `;

//       $container.append(html);
//     });

//     // Event listeners
//     $('.metric-toggle').on('change', function () {
//       const metric = $(this).data('metric');
//       const isChecked = $(this).is(':checked');
//       config.defaultThresholds[metric] = isChecked ? config.defaultThresholds[metric] || 0 : null;
//       renderDefaultMetrics();
//       helpers.markUnsaved();
//     });

//     $('.metric-input').on('input', function () {
//       const metric = $(this).data('metric');
//       const newVal = parseFloat(this.value);
//       config.defaultThresholds[metric] = isNaN(newVal) ? null : newVal;
//       helpers.markUnsaved();
//     });
//   }

//   return { renderDefaultMetrics };
// });


define("forum/automate/portfolio/render/metrics", [
  "jquery",
  "../state",
  "../config",
  "../utils/helpers"
], function ($, state, config, helpers) {

  function renderDefaultMetrics() {
    const $container = $('#defaultMetrics'); // moved inside
    $container.empty();

    Object.entries(config.defaultThresholds).forEach(([metric, value]) => {
      const isRequired = config.requiredMetrics.includes(metric);
      const isEnabled = value !== null && value !== undefined;
      const unit = config.metricUnits[metric] || '';
      const inputDisabled = !isEnabled && !isRequired;

      const toggleHTML = !isRequired
        ? `<div class="form-check form-switch me-2">
            <input class="form-check-input metric-toggle" type="checkbox"
                   data-metric="${metric}" ${isEnabled ? 'checked' : ''}>
          </div>`
        : '';

      const unitHTML = unit ? `<span class="unit-label">${unit}</span>` : '';

      const html = `
      <div class="col-lg-2-4 col-md-4 col-sm-6 mb-3">
        <div class="metric-card">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center">
              ${toggleHTML}
              <label class="form-label mb-0 small">
                ${metric} ${isRequired ? '<span class="required-indicator">*</span>' : ''}
              </label>
            </div>
          </div>
          <div class="position-relative">
            <input type="number" class="form-control form-control-sm metric-input"
                   data-metric="${metric}" value="${value}" step="0.01"
                   ${inputDisabled ? 'disabled' : ''}>
            ${unitHTML}
          </div>
        </div>
      </div>`;

      $container.append(html);
    });

    $('.metric-toggle').on('change', function () {
      const metric = $(this).data('metric');
      const isChecked = $(this).is(':checked');
      config.defaultThresholds[metric] = isChecked ? config.defaultThresholds[metric] || 0 : null;
      renderDefaultMetrics(); // re-render after change
      helpers.markUnsaved();
    });

    $('.metric-input').on('input', function () {
      const metric = $(this).data('metric');
      const newVal = parseFloat(this.value);
      config.defaultThresholds[metric] = isNaN(newVal) ? null : newVal;
      helpers.markUnsaved();
    });
  }

  return { renderDefaultMetrics };
});
