// define("forum/automate/portfolio/state", [], function () {
//   return {
//     accounts: [],
//     currentAccount: null,
//     searchTerm: "",
//     selectedPortfolios: [],
//     hasUnsavedChanges: false
//   };
// });


define("forum/automate/portfolio/state", [], function () {
  const state = {
    accounts: [],
    currentAccount: null,
    searchTerm: "",
    selectedPortfolios: [],
    hasUnsavedChanges: false,
  };

  return {
    getAccounts: () => state.accounts,
    setAccounts: (val) => { state.accounts = val; },

    getCurrentAccount: () => state.currentAccount,
    setCurrentAccount: (val) => { state.currentAccount = val; },

    getSearchTerm: () => state.searchTerm,
    setSearchTerm: (val) => { state.searchTerm = val; },

    getSelectedPortfolios: () => state.selectedPortfolios,
    setSelectedPortfolios: (val) => { state.selectedPortfolios = val; },

    getHasUnsavedChanges: () => state.hasUnsavedChanges,
    setHasUnsavedChanges: (val) => { state.hasUnsavedChanges = val; },
  };
});
