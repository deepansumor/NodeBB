// define("forum/automate/portfolio/render/accounts", ["jquery", "../state"], function ($, state) {
//   function renderAccounts() {
//     const $select = $('#accountSelect').empty();

//     state.accounts.forEach((acc, i) => {
//       const profileId = acc?.meta?.profileId;
//       const name = acc?.name || `Account ${i + 1}`;
//       if (profileId) {
//         $select.append(`<option value="${profileId}" ${i === 0 ? 'selected' : ''}>${name}</option>`);
//       }
//     });

//     updateAccount();
//   }

//   function updateAccount() {
//     const selectedId = parseInt($('#accountSelect').val(), 10);
//     const selected = state.accounts.find(a => a.meta.profileId == selectedId);
//     if (!selected) return;

//     $('#accountId').val(selected.meta.profileId || '');
//     $('#portfolioCount').val(`${selected.meta.PortfolioCount} portfolio${selected.meta.PortfolioCount !== 1 ? 's' : ''}`);
//     state.currentAccount = selected.meta.profileId;
//   }

//   return { renderAccounts, updateAccount };
// });


// define("forum/automate/portfolio/render/accounts", [
//   "jquery",
//   "../state",
//   "./portfolios"  
// ], function ($, state, portfolioRenderer) {

//   function renderAccounts() {
//     const $select = $('#accountSelect').empty();

//     state.accounts.forEach((acc, i) => {
//       const profileId = acc?.meta?.profileId;
//       const name = acc?.name || `Account ${i + 1}`;
//       if (profileId) {
//         $select.append(`<option value="${profileId}" ${i === 0 ? 'selected' : ''}>${name}</option>`);
//       }
//     });

//     updateAccount(); // ✅ initializes default account
//   }

//   function updateAccount() {
//     const selectedId = parseInt($('#accountSelect').val(), 10);
//     const selected = state.accounts.find(a => a.meta.profileId == selectedId);
//     if (!selected) return;

//     $('#accountId').val(selected.meta.profileId || '');
//     $('#portfolioCount').val(`${selected.meta.PortfolioCount} portfolio${selected.meta.PortfolioCount !== 1 ? 's' : ''}`);

//     state.currentAccount = selected.meta.profileId;

//     portfolioRenderer.renderPortfolios(); // ✅ ensure portfolio updates on change
//   }

//   return {
//     renderAccounts,
//     updateAccount
//   };
// });


define("forum/automate/portfolio/render/accounts", [
  "jquery",
  "../state",
  "./portfolios",
  "../utils/helpers"  
], function ($, state, portfolioRenderer) {

  function renderAccounts() {
    const $select = $('#accountSelect').empty();

    const accounts = state.getAccounts(); // ✅ Use getter

    accounts.forEach((acc, i) => {
      const profileId = acc?.meta?.profileId;
      const name = acc?.name || `Account ${i + 1}`;
      if (profileId) {
        $select.append(`<option value="${profileId}" ${i === 0 ? 'selected' : ''}>${name}</option>`);
      }
    });

    updateAccount(); // ✅ initializes default account
  }

  function updateAccount() {
    const selectedId = $('#accountSelect').val();

    const accounts = state.getAccounts(); // ✅ Use getter
    const selected = accounts.find(a => a.meta.profileId == selectedId);
    if (!selected) return;


    $('#accountId').val(selected.meta.profileId || '');
    $('#portfolioCount').val(
      `${selected.meta.portfolios?.length || 0} portfolio${(selected.meta.portfolios?.length !== 1 ? 's' : '')}`
    );

    state.setCurrentAccount(selected.meta.profileId); // ✅ Use setter

    portfolioRenderer.renderPortfolios(); // ✅ update portfolios
  }

  return {
    renderAccounts,
    updateAccount
  };
});
