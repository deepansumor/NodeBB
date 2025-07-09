// define("forum/automate/p-threshold", [
//   "forum/automate/portfolio/state",
//   "forum/automate/portfolio/api-service",
//   "forum/automate/portfolio/render/accounts",
//   "forum/automate/portfolio/render/portfolios",
//   "forum/automate/portfolio/render/metrics",
//   "forum/automate/portfolio/handlers"
// ], function (state, api, accountsRenderer, portfoliosRenderer, metricsRenderer, handlers) {

//   const accountForm = {};

//   accountForm.init = async function () {
//     try {
//       const categories = await api.fetchAccounts();
//       const accounts = categories.filter(c => !c.parentCid && c.meta?.profileId);
//       accounts.forEach(acc => {
//         if (Array.isArray(acc.meta?.portfolios)) {
//           acc.meta.portfolios.forEach(p => p.expanded ??= false);
//         }
//       });

//       state.accounts = accounts;
//       state.currentAccount = accounts[0]?.meta?.profileId;

//       accountsRenderer.renderAccounts();
//       metricsRenderer.renderDefaultMetrics();
//       portfoliosRenderer.renderPortfolios();
//       handlers.setupHandlers();

//       $('#unsavedIndicator').hide();

//     } catch (err) {
//       alert("Error initializing Threshold Page.");
//       console.error(err);
//     }
//   };

//   return accountForm;
// });


define(
  "forum/automate/p-threshold",
  [
    "./portfolio/state",
    "./portfolio/api-service",
    "./portfolio/render/accounts",
    "./portfolio/render/portfolios",
    "./portfolio/render/metrics",
    "./portfolio/handlers",
    "./portfolio/utils/helpers"
  ],
  function (state, api, accountsRenderer, portfoliosRenderer, metricsRenderer, handlers, helpers) {
    const accountForm = {};

    accountForm.init = async function () {
      console.log("🚀 Threshold page initialized");

      try {
        // Fetch accounts
        const data = await api.fetchAccounts();
         console.log('api fetch account:', data);

        // const allCategories = Array.isArray(data.response?.categories) ? data.response.categories : [];

         const allCategories = data || [];
        console.log("all category data:", allCategories);

        const topLevelAccounts = allCategories.filter(
          (category) =>
            (category.parentCid == 0 || category.parentCid == null) &&
            category.meta?.profileId
        );
        console.log(topLevelAccounts);

        topLevelAccounts.forEach((acc) => {
          if (Array.isArray(acc.meta?.portfolios)) {
            acc.meta.portfolios.forEach((p) => {
              if (typeof p.expanded == "undefined") {
                p.expanded = false;
              }
            });
          }
        });

        state.setAccounts(topLevelAccounts);
        state.setCurrentAccount(topLevelAccounts[0]?.meta?.profileId || null);

        // if (!state.getCurrentAccount()) {
        //   throw new Error("No valid account found.");
        // }


        if (!state.getCurrentAccount()) {
  throw new Error("No valid account found.");
}


        // Hide unsaved indicator using helper or jQuery
        $('#unsavedIndicator').hide();

        // Render UI components
        accountsRenderer.renderAccounts();
        metricsRenderer.renderDefaultMetrics();
        portfoliosRenderer.renderPortfolios();

        // Setup event handlers
        handlers.setupHandlers();

      } catch (err) {
        console.error(err);
        alert("Something went wrong while initializing the Threshold page.");
      }
    };

    return accountForm;
  }
);
