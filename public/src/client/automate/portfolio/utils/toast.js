define("forum/automate/portfolio/utils/toast", [], function () {
  function showToast(title, message) {
    const toast = $(`
      <div class="toast show position-fixed top-0 end-0 p-3" style="z-index:1055;">
        <div class="toast-header">
          <strong class="me-auto">${title}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    `);
    $('body').append(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  return { showToast };
});
