"use strict";

/**
 * PDP Audit Module
 */
define("forum/auditAgent/pdp-audit", ['api'], function (api) {


    const pdpAudit = {};


    let auditForm, startAuditBtn, asinInput;


    pdpAudit.init = function () {
        // console.log("Initializing audit.");


        auditForm = document.getElementById("auditForm");
        startAuditBtn = document.getElementById("startAuditBtn");
        asinInput = document.getElementById("asinInput");



        if (startAuditBtn) {
            startAuditBtn.addEventListener("click", () => render(true));


            async function render(latest) {
                const asinValue = asinInput ? asinInput.value.trim() : '';


                const asin = asinValue;


                if (!asinValue) {
                    alert("Enter ASIN.");
                    return;
                }


                startAuditBtn.innerHTML = `
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    Analyzing Product...
                `;
                startAuditBtn.disabled = true;
                window.location.href = `pdp-report?asin=${asin}`;



        

    }}};


    return pdpAudit;
});
