"use strict";

define("forum/auditAgent/store-audit", ['api', 'jquery'], function (api, $) {
    const storeAudit = {};

    storeAudit.init = function () {
        console.log("this is the brand store audit page");

        const auditForm = $("#auditForm");
        const startAuditBtn = $("#startAuditBtn");
        const asinInput = $("#asinInput");



        if (startAuditBtn) {
            startAuditBtn.on("click", async function () {

                const asin = asinInput.val().trim();
                const brandName = asin;

                if (brandName) {
                    startAuditBtn.prop("disabled", true);
                    const data = await api.post(`/agent/generate-report/store/${brandName}`)

                    console.log("api response:", data || "");



                    if (!data || !Array.isArray(data.recentData) || data.recentData.length == 0) {
                        alert(data?.message || "No audit data found.");
                        window.location.href = `/agents`;
                        return;
                    }

                    const audit = data.recentData[0] || {};
                    const auditId = audit.auditId || "";
                    console.log("auditId:", auditId);

                    if (audit.status == "completed") {
                        window.location.href = `/agents/brand-summary?auditId=${auditId}`;
                    } else if (audit.status == "in_progress") {
                        alert("Audit in Progress. Check dashboard.");
                        window.location.href = `/agents`;
                    } else {
                        alert(data.message || "No Audit found.");
                        window.location.href = `/agents`;
                    }

                } else {
                    alert("Please enter brand name.");
                }

            });
        }
    };

    return storeAudit;
});