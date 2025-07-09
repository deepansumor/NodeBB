define("forum/automate/portfolio/handlers", [
  "jquery",
  "./state",
  "./render/portfolios",
  "./utils/helpers", // where useDefaults etc. are defined
  "./api-service",
  "./config"    // where save API lives
], function ($, state, portfoliosRenderer, helpers, apiService, config) {

  function setupHandlers() {
    // $('#accountSelect').on('change', function () {
    //   const selectedId = parseInt($(this).val(), 10);
    //   // const selected = state.accounts.find(a => a.meta.profileId == selectedId);
    //   const selected = state.getAccounts().find(a => a.meta.profileId == selectedId);

    //   if (!selected) return;

    //   state.currentAccount = selected.meta.profileId;
    //   portfoliosRenderer.renderPortfolios();
    // });

    $('#accountSelect').on('change', function () {
      const selectedId = $(this).val(); // don't parseInt; profileId is a string
      const selected = state.getAccounts().find(a => a.meta.profileId == selectedId);

      if (!selected) return;

      // Update state
      state.setCurrentAccount(selected.meta.profileId);
      helpers.renderWaitTimeSop(selected);

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



    // $('#portfolioSearch').on('input', function () {
    //   state.searchTerm = this.value.toLowerCase();
    //   portfoliosRenderer.renderPortfolios();
    // });

    // $('body').on('click', '.use-defaults-btn', function () {
    //   helpers.useDefaults($(this).data('id'));
    // });
    $('#portfolioSearch').on('input', function () {
      state.setSearchTerm($(this).val().toLowerCase()); // ✅ fix
      require(["./render/portfolios"], function (portfolioRenderer) {
        portfolioRenderer.renderPortfolios();
      });
    });

    $('body').on('click', '.use-defaults-btn', function () {
      const portfolioId = $(this).data('id');
      const accounts = state.getAccounts();
      console.log("accounts in usedefault:", accounts);


      let portfolio = null;
      // accounts.some(acc => {
      for (const acc of accounts) {
        if (acc.meta?.portfolios) {
          portfolio = acc.meta.portfolios.find(p => p.portfolioId == portfolioId);
          if (portfolio) break; // found portfolio, exit loop
        }
      }

      console.log("portfolio data:", portfolio);

      if (!portfolio) {
        console.warn(`Portfolio with ID ${portfolioId} not found.`);
        return;
      }

      // Pass portfolio object and default thresholds to helper
      helpers.useDefaults(portfolio, config.defaultThresholds);

      // Re-render portfolios after update
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

    // $('body').on('change', '.toggle-enabled-checkbox', function () {
    //   helpers.togglePortfolioEnabled($(this).data('id'), $(this).is(':checked'));
    // });

    //     $('body').on('change', '.toggle-enabled-checkbox', function () {
    //   const portfolioId = $(this).data('id');
    //   const isChecked = $(this).is(':checked');
    //   helpers.togglePortfolioEnabled(portfolioId, isChecked);
    //   require(["./render/portfolios"], function (portfolioRenderer) {
    //     portfolioRenderer.renderPortfolios(); // ✅ re-render
    //   });
    // });

    $('body').on('change', '.toggle-enabled-checkbox', function () {
      const portfolioId = $(this).data('id');
      const isChecked = $(this).is(':checked');


      helpers.togglePortfolioEnabled(portfolioId, isChecked);


      const account = state.getAccounts().find(
        a => a.meta.profileId == state.getCurrentAccount()
      );


      require(["./api-service"], function (apiService) {
        apiService.saveThresholds(account).then(() => {
          require(["./render/portfolios"], function (portfolioRenderer) {
            portfolioRenderer.renderPortfolios();
          });
        });
      });
    });


    $('body').on('change', '.toggle-metric-checkbox', function () {
      helpers.togglePortfolioMetric($(this).data('portfolio-id'), $(this).data('metric'), $(this).is(':checked'));
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

      apiService.saveThresholds(account)
        .then(() => {
          console.log("Thresholds saved successfully!");
        })
        .catch((err) => {
          console.error("Failed to save thresholds:", err);
        });
    });

  }

  return { setupHandlers };
});
