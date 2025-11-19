define("forum/automate/portfolio/handlers", [
  "jquery",
  "./state",
  "./render/portfolios",
  "./utils/helpers", // where useDefaults etc. are defined
  "./api-service",
  "./config"    // where save API lives
], function ($, state, portfoliosRenderer, helpers, apiService, config) {

  function setupHandlers() {
   

    $('#accountSelect').on('change', function () {
      const selectedId = $(this).val(); // don't parseInt; profileId is a string
      const selected = state.getAccounts().find(a => a.meta.profileId == selectedId);

      if (!selected) return;

      // Update state
      state.setCurrentAccount(selected.meta.profileId);
      helpers.renderWaitTimeSop(selected);
      helpers.renderCritical(selected);

      // Update UI
      $('#accountId').val(selected.meta.profileId || '');
      $('#portfolioCount').val(
        `${selected.meta.PortfolioCount || selected.meta.portfolios?.length || 0} portfolio(s)`
      );

      // Re-render based on selected account
      require(['./render/portfolios'], function (portfolioRenderer) {
        portfolioRenderer.renderPortfolios();
      });
    }).trigger('change');



  
    $('#portfolioSearch').on('input', function () {
      state.setSearchTerm($(this).val().toLowerCase()); // ✅ fix
      require(["./render/portfolios"], function (portfolioRenderer) {
        portfolioRenderer.renderPortfolios();
      });
    });

    // use default 
    $('body').on('click', '.use-defaults-btn', function () {
  const portfolioId = $(this).data('id');

  const accounts = state.getAccounts();
  const currentAccountId = state.getCurrentAccount(); //  get currently selected account
  const account = accounts.find(a => a.meta.profileId == currentAccountId); //  find that account

  if (!account || !account.meta?.portfolios) {
    console.warn("Current account or its portfolios not found.");
    return;
  }

  const portfolio = account.meta.portfolios.find(p => p.portfolioId == portfolioId); // ✅ only look here

  console.log("portfolio data:", portfolio);

  if (!portfolio) {
    console.warn(`Portfolio with ID ${portfolioId} not found in current account.`);
    return;
  }

  // Apply default thresholds
  helpers.useDefaults(portfolio, config.defaultThresholds);

  // Re-render only the current account’s portfolios
  portfoliosRenderer.renderPortfolios();
});

    // $('body').on('click', '.toggle-expand-btn', function () {
    //   helpers.togglePortfolioExpanded($(this).data('id'));
    // });

    $('body').on('click', '.toggle-expand-btn', function () {
      const portfolioId = $(this).data('id');
      helpers.togglePortfolioExpanded(portfolioId);
      require(["./render/portfolios"], function (portfolioRenderer) {
        portfolioRenderer.renderPortfolios(); // ✅ re-render
      });
    });

   

    $('body').on('change', '.toggle-enabled-checkbox', function () {
      const portfolioId = $(this).data('id');
      const isChecked = $(this).is(':checked');


      helpers.togglePortfolioEnabled(portfolioId, isChecked);


      const account = state.getAccounts().find(
        a => a.meta.profileId == state.getCurrentAccount()
      );


      require(["./api-service"], function (apiService) {
        apiService.updateAlertsStatus(account).then(() => {
          require(["./render/portfolios"], function (portfolioRenderer) {
            portfolioRenderer.renderPortfolios();
          });
        });
      });
    });



   
  // $('body').on('change', '.toggle-metric-checkbox', function () {
  //     // helpers.togglePortfolioMetric($(this).data('portfolio-id'), $(this).data('metric'), $(this).is(':checked'));
  //   });

  $('body').on('change', '.toggle-metric-checkbox', function () {
  const portfolioId = $(this).data('portfolio-id');
  const metric = $(this).data('metric');
  const isEnabled = $(this).is(':checked');

  const accounts = state.getAccounts();
  accounts.forEach(acc => {
    const portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
    if (portfolio) {
      portfolio.thresholds[metric] = isEnabled ? (portfolio.thresholds[metric] || 0) : null;
    }
  });

  const inputSelector = `.metric-value-input[data-portfolio-id="${portfolioId}"][data-metric="${metric}"]`;
  $(inputSelector).prop('disabled', !isEnabled);

  helpers.markUnsaved();
});


    $('body').on('input', '.metric-value-input', function () {
      helpers.updatePortfolioMetric($(this).data('portfolio-id'), $(this).data('metric'), parseFloat($(this).val()));
    });

    $('#applyAllBtn').on('click', function () {
      const accounts = state.getAccounts();
      const currentAccountId = state.getCurrentAccount();
      const account = accounts.find(a => a.meta.profileId == currentAccountId);
      console.log("apply all account:", account);

      helpers.applyToAll(account, config.defaultThresholds)
    });

    $('#resetBtn').on('click', function () {
      location.reload();
    });

    $('#saveChangesBtn').on('click', function () {
      const accounts = state.getAccounts();
      const currentAccountId = state.getCurrentAccount();
      const account = accounts.find(a => a.meta.profileId == currentAccountId);

      if (!account || !account.cid) {
        console.error("Valid account not found or missing 'cid':", account);
        return;
      }

      account.meta.waitTimeSop = {
        stage1: parseInt($('#stage1').val(), 10),
        stage2: parseInt($('#stage2').val(), 10)
      };
      account.meta.critical = {
        critical: $('#critical').val()||""
      };
      apiService.saveThresholds(account)
        .then(() => {
          alert("Thresholds saved successfully!") ;
        })
        .catch((err) => {
          alert(err.message);
        });
    });

  }

  return { setupHandlers };
});
