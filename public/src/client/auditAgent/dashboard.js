"use strict";

define("forum/auditAgent/dashboard", ["api"], function (api) {
  const dashboard = {};

  dashboard.init = function () {
    // console.log("this is the dashboard page");

    const totalAudits = document.getElementById("totalAudits");
    const container = document.querySelector(".card-body.pt-3");


    // status badge 
    function renderStatusBadge(status) {
      let label = "";
      let color = "";

      switch (status) {
        case "started":
          label = "Started";
          color = "primary";
          break;
        case "in_progress":
          label = "In Progress";
          color = "warning";
          break;
        case "completed":
          label = "Completed";
          color = "success";
          break;
        default:
          label = status;
          color = "secondary";
      }

      return `<span class="badge bg-${color} text-white py-1 px-2">${label}</span>`;
    }


    // render audits
    const renderAudits = (audits) => {
      totalAudits.textContent = audits.length;
      container.innerHTML = "";

      if (audits.length === 0) {
        container.innerHTML = `
          <div class="text-center py-5">
            <h5 class="text-muted">No data found</h5>
          </div>`;
        return;
      }

      audits.forEach((item) => {
        const iconClass = item.type === "Brand Store" ? "fa-chart-bar" : "fa-file-text";
        const type = item.type || "PDP";
        const brand = item.brand || item.brandName || "No Brand";
        const date = item.date || item.createdAt || "Just now";
        const asin = item.asin ? `• ASIN: ${item.asin}` : "";
        const score = item.reports?.audit_overview?.overall_score || "";
        const viewLink = item._key ? `/agents/pdp-report?key=${item._key}` : item.auditId ? `/agents/brand-summary?auditId=${item.auditId}` : "#";
        const statusBadge = item.status ? renderStatusBadge(item.status) : "";
        const viewBtnDisabled = item.type === "Brand Store" && item.status !== "completed" ? "disabled" : "";


        const auditHTML = `
          <div class="audit-item d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3 flex-grow-1">
              <div class="d-flex align-items-center gap-2">
                <i class="fas ${iconClass} text-primary fs-5"></i>
                <span class="badge bg-light text-dark py-2 px-3">${type}</span>
                
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">${brand}</h6>
                <div class="text-muted small">${date} ${asin}</div>
              </div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="text-end">
                <div class="fw-bold fs-5">${statusBadge} ${type == 'PDP' ? score : ''}</div>
                <div class="text-muted small">${type == 'PDP' ? 'Score' : ''}</div>
              </div>
              <a href="${viewLink}" class="btn btn-sm btn-outline-primary ${viewBtnDisabled}">
                View <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        `;

        container.insertAdjacentHTML("beforeend", auditHTML);
      });
    };


    // fetch audit data 
    const fetchAuditData = async (type) => {
      try {
        let response;

        if (type === "store") {

          response = await api.get("/agent/brand-audit");

        } else {

          response = await api.get("/agent/report");
        }

        // console.log(`${type.toUpperCase()} API Data:`, response);
        renderAudits(response || []);
      } catch (error) {
        console.error("Error fetching audits:", error);
      }
    };

    // Initial PDP load
    fetchAuditData("pdp");

    // Setup toggle
    const pdpToggle = document.getElementById("pdpToggle");
    const storeToggle = document.getElementById("storeToggle");

    if (pdpToggle && storeToggle) {
      pdpToggle.addEventListener("change", () => {
        if (pdpToggle.checked) {
          fetchAuditData("pdp");
        }
      });

      storeToggle.addEventListener("change", () => {
        if (storeToggle.checked) {
          fetchAuditData("store");
        }
      });
    }
  };

  return dashboard;
});
