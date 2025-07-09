"use strict";

define("forum/auditAgent/dashboard", ['api'], function (api) {
    const dashboard = {};

    dashboard.init = function () {
        console.log("this is the dashboard page");

        const totalAudits = document.getElementById("totalAudits");


        const dbData = async function () {
            try {
                const response = await api.get("/agent/report");
                console.log("API Data:", response);

                const audits = response || [];
                const container = document.querySelector(".card-body.pt-3");

                totalAudits.textContent = audits.length;
                // Clear existing content
                container.innerHTML = "";

                if (audits.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-5">
                            <h5 class="text-muted">No data found</h5>
                        </div>`;
                    return;
                }

                audits.forEach(item => {
                    const iconClass = item.type === "Brand Store" ? "fa-chart-bar" : "fa-file-text";
                    const type = item.type || "PDP";
                    const brand = item.brand || "No Brand";
                    const date = item.date || "Just now";
                    const asin = item.asin ? `• ASIN: ${item.asin}` : "";
                    const score = item.reports?.audit_overview?.overall_score|| 0;
                    // const viewLink = item._key || "#";
                    const viewLink = item._key ? `/agents/audit?key=${item._key}` : "#";

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
                                    <div class="fw-bold fs-5">${score}</div>
                                    <div class="text-muted small">Score</div>
                                </div>
                                <a href="${viewLink}" class="btn btn-sm btn-outline-primary">
                                    View <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    `;

                    container.insertAdjacentHTML("beforeend", auditHTML);
                });

            } catch (error) {
                console.log("error fetching audits", error);
            }
        };

        dbData();
    };

    return dashboard;
});
