// define("forum/automate/portfolio/utils/helpers", ["../state"], function (state) {
//   function markUnsaved() {
//     state.hasUnsavedChanges = true;
//     $('#unsavedIndicator').removeClass('d-none');
//   }

//   return { markUnsaved };
// });

// define("forum/automate/portfolio/utils/helpers", ["../state"], function (state) {
  
//   function markUnsaved() {
//     state.setHasUnsavedChanges(true);
//     $('#unsavedIndicator').removeClass('d-none');
//   }

// //   function showToast(title, message) {
// //     const toastContainer = document.createElement('div');
// //     toastContainer.className = 'position-fixed top-0 end-0 p-3';
// //     toastContainer.style.zIndex = '1055';

// //     toastContainer.innerHTML = `
// //       <div class="toast show" role="alert">
// //         <div class="toast-header">
// //           <strong class="me-auto">${title}</strong>
// //           <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
// //         </div>
// //         <div class="toast-body">${message}</div>
// //       </div>`;

// //     document.body.appendChild(toastContainer);

// //     setTimeout(() => {
// //       toastContainer.remove();
// //     }, 4000);
// //   }

//   function resetAll() {
//     location.reload();
//   }

//   return { markUnsaved,  resetAll };
// });

define("forum/automate/portfolio/utils/helpers", ["../state","../config"], function (state,defaultThresholds ) {

  function markUnsaved() {
    state.setHasUnsavedChanges();
    $('#unsavedIndicator').removeClass('d-none');
  }

  // function useDefaults(portfolio, defaults) {
  //   Object.assign(portfolio.thresholds, JSON.parse(JSON.stringify(defaults)));
  //   markUnsaved();
  // }
    function useDefaults(portfolio,defaultThresholds) {

      Object.entries(defaultThresholds).forEach(([metric, config]) => {
        // portfolio.thresholds[metric] = { ...config, custom: false };
        portfolio.thresholds[metric] = defaultThresholds[metric] ?? null;

      });
      markUnsaved();
      // renderPortfolios();
    
  }

  // applyall
//   function applyToAll() {
//   const accounts = state.getAccounts();
//   const defaultThresholds = defaultThresholds;

//   accounts.forEach((acc) => {
//     acc.meta.portfolios.forEach((portfolio) => {
//       if (portfolio.alertsEnabled) {
//         Object.entries(defaultThresholds).forEach(([metric, value]) => {
//           if (typeof portfolio.thresholds[metric] === 'object') {
//             portfolio.thresholds[metric].value = value;
//           } else {
//             portfolio.thresholds[metric] = value;
//           }
//         });
//       }
//     });
//   });

//   markUnsaved();
// }
 // apply to all 
  function applyToAll(account,defaultThresholds) {



for (let index = 0; index < [...jQuery('.use-defaults-btn')].length; index++) {
        [...jQuery('.use-defaults-btn')][index].click()
}
  }

  // wait time sop
//   function renderWaitTimeSop(account) {
//   const waitTime = account?.meta?.waitTimeSop || {};

//   $('#stage1').val(waitTime.stage1 ?? '');
//   $('#stage2').val(waitTime.stage2 ?? '');
// }

function renderWaitTimeSop(account) {
  const waitTime = account?.meta?.waitTimeSop || {};

  $('#stage1').val(waitTime.stage1 ?? '');
  $('#stage2').val(waitTime.stage2 ?? '');

  // 🔒 Disable inputs if the user is not an admin
  if (!app.user.isAdmin) {
    $('#stage1').prop('disabled', true);
    $('#stage2').prop('disabled', true);
  } else {
    $('#stage1').prop('disabled', false);
    // $('#stage2').prop('disabled', false);
  }
}

function renderCritical(account) {
  const critical = account?.meta?.critical || {};

  $('#critical').val(critical?.critical)||"";


}


// update portfolio metrics
  function updatePortfolioMetric(portfolioId, metric, value) {
  const accounts = state.getAccounts();
  accounts.forEach((acc) => {
    const portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
    console.log(portfolio);
    if (portfolio && portfolio.thresholds) {
      // If it's an object like { value, enabled }, update `value`
      if (portfolio.thresholds[metric] && typeof portfolio.thresholds[metric] == 'object') {
        portfolio.thresholds[metric].value = value;
      } else {
        // Otherwise directly assign the value
        portfolio.thresholds[metric] = value;
      }
    }
  });
  markUnsaved();
}




  function togglePortfolioExpanded(portfolioId) {
    const accounts = state.getAccounts();
    accounts.forEach((acc) => {
      const portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
      if (portfolio) {
        portfolio.expanded = !portfolio.expanded;
      }
    });
    markUnsaved();
  }


  function togglePortfolioEnabled(portfolioId, isEnabled) {
    const accounts = state.getAccounts();
    accounts.forEach((acc) => {
      const portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
      if (portfolio) {
        portfolio.alertsEnabled = isEnabled;
      }
    });
    markUnsaved();
  }

  function togglePortfolioMetric(portfolioId, metric, value) {
    const accounts = state.getAccounts();
    accounts.forEach((acc) => {
      const portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
      if (portfolio && portfolio.thresholds[metric]) {
        portfolio.thresholds[metric].enabled = value;
      }
    });
    markUnsaved();
  }

  return {
    markUnsaved,
    useDefaults,
    applyToAll,
    renderWaitTimeSop,
    renderCritical,
    updatePortfolioMetric,
    togglePortfolioExpanded,
    togglePortfolioEnabled,
    togglePortfolioMetric,
  };
});
