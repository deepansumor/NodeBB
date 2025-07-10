
"use strict";


/**
 * PDP Audit Module
 */
define("forum/auditAgent/pdp-audit", ['api'], function (api) {


    const pdpAudit = {};


    let auditForm, auditResults, startAuditBtn, asinInput;
    let activeCategory = "";
    let productData = null;


    const CATEGORY_KEY_MAP = {
        title_optimization: 'title',
        bullet_points: 'bulletPoint',
        product_description: 'description',
        image_stack_quality: 'image'
    };


    // preview


    // function renderProductPreview(previewData) {
    //         const previewContainer = document.getElementById("productPreview");
    //         if (!previewContainer || !previewData) return;


    //         const { title, description, bullet_points, images } = previewData.data || {};


    //         const carouselItems = images?.map((src, idx) => `
    //             <div class="carousel-item${idx === 0 ? ' active' : ''}">
    //                 <img src="${src}" class="d-block w-100 product-image" alt="${idx + 1}" />
    //             </div>
    //         `).join('') || '';


    //         const bulletsHtml = bullet_points?.map((point, index) => `
    //             <li class="${index >= 4 ? 'extra-bullet' : ''}" style="${index >= 4 ? 'display:none' : ''}">${point}</li>
    //         `).join('') || '';


    //         previewContainer.innerHTML = `
    //             <div class="card shadow">
    //                 <div class="card-body">
    //                     <h4 class="mb-4">🔍 Product Preview</h4>
    //                     <div class="row g-4">
    //                         <div class="col-md-4">
    //                             <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
    //                                 <div class="carousel-inner rounded border" id="carousel-inner">
    //                                     ${carouselItems}
    //                                 </div>
    //                                 <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
    //                                     <span class="carousel-control-prev-icon"></span>
    //                                 </button>
    //                                 <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
    //                                     <span class="carousel-control-next-icon"></span>
    //                                 </button>
    //                             </div>
    //                         </div>
    //                         <div class="col-md-8">
    //                             <p><strong>Title:</strong> ${title || 'N/A'}</p>
    //                             <p><strong>Brand:</strong> ${productData.brand || 'N/A'}</p>
    //                             <p><strong>Description:</strong> ${description || 'N/A'}</p>
    //                             <p><strong>Bullet Points:</strong></p>
    //                             <ul id="bullet-points">${bulletsHtml}</ul>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         `;


    //         if (bullet_points && bullet_points.length > 4) {
    //             const readMoreBtn = document.createElement('button');
    //             readMoreBtn.textContent = 'Read more';
    //             readMoreBtn.className = 'btn btn-link p-0 mt-2';
    //             readMoreBtn.addEventListener('click', () => {
    //                 document.querySelectorAll('.extra-bullet').forEach(li => li.style.display = 'list-item');
    //                 readMoreBtn.style.display = 'none';
    //             });
    //             document.getElementById('bullet-points').after(readMoreBtn);
    //         }
    //     }






    function createProgressBar(percentage, className) {
        return `
            <div class="progress ${className}">
                <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }


    function createCriteriaItem(criterion) {
        const statusClass = criterion.passed ? "text-success" : "text-danger";
        return `
            <div class="d-flex align-items-center gap-2">
                <i class="fas fa-check-circle ${statusClass}"></i>
                <span>${criterion.name}</span>
            </div>
        `;
    }


    function renderResults() {
        if (!productData) {
            console.error("No data.");
            return;
        }
        renderProductInfo();
        renderCategoryGrid();
        renderCategoryDetails();
        renderOverallScore();
        renderCategoryScores();
        renderPriorityIssues();
    }


    function renderProductInfo() {
        const productNameEl = document.getElementById("productName");
        const productInfoEl = document.getElementById("productInfo");


        if (productNameEl) productNameEl.textContent = productData.brand || 'N/A';
        if (productInfoEl) productInfoEl.textContent =
            ` Brand: ${productData.brand || 'N/A'} | ASIN: ${productData.asin || 'N/A'} | Last Updated: ${productData.lastUpdated || 'N/A'}`;
    }


    function renderCategoryGrid() {
        const categoryGrid = document.getElementById("categoryGrid");
        if (!categoryGrid || !productData || !productData.results) return;


        // results is now an object, not an array
        categoryGrid.innerHTML = Object.entries(productData.results)
            .map(([key, category]) => {
                
                const categoryId = key.toLowerCase().replace(/\s+/g, "-");
                const isActive = activeCategory === categoryId;
                const score = category.score || 0;
                const maxScore = 10; // Each category score is out of 10 in your schema
                const badgeVariant = score < (maxScore * 0.6) ? "danger" : score < (maxScore * 0.8) ? "warning" : "success";
                return `
                  <div class="col-md-4 col-lg-3">
                      <button class="category-btn ${isActive ? "active" : ""}"
                              data-category-id="${categoryId}">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                              <div class="category-title">${key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                              <span class="badge bg-${badgeVariant}">${score}</span>
                          </div>
                          <div class="category-weight">${category.weight_percent || 'N/A'} Weight</div>
                          ${createProgressBar((score / maxScore) * 100, "progress-sm")}
                      </button>
                  </div>
                `;
            })
            .join("");


        categoryGrid.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', () => {
                setActiveCategory(button.dataset.categoryId);
            });
        });
    }


    // rendering suggestion
    function generateSuggestionHTML(suggestions) {


        let html = '';
        if (Array.isArray(suggestions)) {
            $.each(suggestions, function (index, suggestion) {
                html += `<li>${suggestion}</li>`;
            });


            return html;
        }
        if (!suggestions || Object.keys(suggestions).length === 0) {
            return 'No specific notes available.';
        }






        $.each(suggestions, function (category, suggestionData) {
            html += `<strong>${category.replaceAll('_', ' ')}:</strong>`;


            if (Array.isArray(suggestionData)) {
                // If it's an array, render list items
                html += '<ul>';
                $.each(suggestionData, function (index, suggestion) {
                    html += `<li>${suggestion}</li>`;
                });
                html += '</ul>';
            } else if (typeof suggestionData === 'object' && suggestionData !== null) {
                // If it's an object, render key-value pairs
                html += '<ul>';
                $.each(suggestionData, function (key, value) {
                    html += `<li><strong>${key}:</strong> ${value}</li>`;
                });
                html += '</ul>';
            } else {
                // If it's a primitive (string, number, boolean), render directly
                html += `<p>${suggestionData}</p>`;
            }
        });


        return html;
    }




    function renderCategoryDetails() {
        const categoryDetails = document.getElementById("categoryDetails");
        if (!categoryDetails || !productData || !productData.reports) return;


        // reports keys are like "title_optimization", so activeCategory uses hyphen, convert to underscore
        // const reportKey = activeCategory.replace(/-/g, "_");
        const reportKey = activeCategory.replace(/-/g, "_");




        const actualKey = CATEGORY_KEY_MAP[reportKey] || reportKey;
        const categoryReport = productData.reports[actualKey];


        // const categoryReport = productData.reports[reportKey];
        if (!categoryReport) {
            categoryDetails.innerHTML = '<p class="text-muted text-center mt-5">Select category details.</p>';
            return;
        }


        // Subcategories are keys in categoryReport except "overall_score" and "timestamp"
        const subcategoriesHtml = Object.keys(categoryReport)
            .filter(key => key !== 'overall_score' && key !== 'timestamp')
            .map(subCategoryKey => {

                if(subCategoryKey =="recommended_keywords"){
                    return;
                }
                const subcategory = categoryReport[subCategoryKey];
                const subcategoryMaxScore = 10;


                const criteriaHtml = Object.keys(subcategory.checklist || {})
                    .map(criterionKey => {
                        return createCriteriaItem({
                            name: criterionKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                            passed: subcategory.checklist[criterionKey]
                        });
                    })
                    .join("");


                return `
                    <div class="subcategory-card">
                        <div class="row flex flex-row-reverse">
                            <div class="col-md-3">
                               
                                <div class="text-center ${!subcategory.score ? 'd-none' : ''}">
                                    <div class="fw-semibold fs-5">${subcategory.score || 0}/${subcategoryMaxScore}</div>
                                    ${createProgressBar(((subcategory.score || 0) / subcategoryMaxScore) * 100, "mt-2")}
                                </div>
                            </div>
                            <div class="col-md-9">
                                <h5 class="fw-semibold mb-3">${subCategoryKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</h5>
                                <div class="row g-3 mb-4">
                                    ${criteriaHtml}
                                </div>
                                </div>
                                <div>
                                <div class="col-md-12">
                                    <h6 class="fw-semibold mb-2 text-secondary">Analysis & Recommendations</h6>
                                    <div class="analysis-box">${subcategory.comment ? subcategory.comment : (subCategoryKey == "suggestions" ? generateSuggestionHTML(subcategory) : subCategoryKey == "recommended_keywords" ? generateSuggestionHTML(subcategory) : 'No specific notes available.')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");




        // Find the category name and weight from productData.results (object)
        const categorySummary = productData.results[reportKey];


        categoryDetails.innerHTML = `
            <div class="subcategory-header">
                <div class="d-flex align-items-center gap-3">
                    <h4 class="fw-semibold mb-0">${categorySummary ? reportKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : 'Category'}</h4>
                    <span class="badge bg-outline-secondary">${categorySummary ? categorySummary.weight_percent : 'N/A'} Weight</span>
                </div>
                <div class="fs-5 fw-semibold">
                    Score: ${categorySummary ? categorySummary.score : 0}/10
                </div>
            </div>
            ${subcategoriesHtml}
        `;
    }


    function renderOverallScore() {
        const scoreCircle = document.getElementById("overallScoreCircle");
        if (!scoreCircle || !productData) return;


        const score = productData.overallScore || 0;
        const color = score >= 8 ? "#22c55e" : score >= 6 ? "#FF7757" : "#ef4444";


        scoreCircle.style.borderColor = color;
        const scoreNumberElement = scoreCircle.querySelector(".score-number");
        if (scoreNumberElement) {
            scoreNumberElement.textContent = score.toFixed(1);
        }
    }


    function renderCategoryScores() {
        const categoryScores = document.getElementById("categoryScores");
        if (!categoryScores || !productData || !productData.results) return;

        console.log("product data result from the grid --->",productData.results)
        categoryScores.innerHTML = Object.entries(productData.results)
            .map(([key, category]) => {
                const score = category.score || 0;
                const maxScore = 10;
                return `
                    <div class="mb-2">
                        <div class="d-flex justify-content-between align-items-center small mb-1">
                            <span>${key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                            <span class="fw-medium">${score}</span>
                        </div>
                        ${createProgressBar((score / maxScore) * 100, "progress-sm")}
                    </div>
                `;
            })
            .join("");
    }


    function renderPriorityIssues() {
        const priorityIssues = document.getElementById("priorityIssues");
        if (!priorityIssues || !productData || !productData.priority_issues) return;


        if (productData.priority_issues.length === 0) {
            priorityIssues.innerHTML = '<p class="text-muted text-center">No issues found.</p>';
            return;
        }


        priorityIssues.innerHTML = productData.priority_issues
            .map((issue) => {
                const iconClass =
                    issue.severity === "high"
                        ? "fas fa-exclamation-triangle text-danger"
                        : "fas fa-exclamation-triangle text-warning";


                return `
                    <div class="priority-issue">
                        <i class="${iconClass} issue-icon"></i>
                        <div class="issue-content">
                            <div class="issue-title">${issue.category || 'N/A'} › ${issue.subcategory || ''}: ${issue.issue || 'N/A'}</div>
                            <div class="issue-score">Score: ${issue.score || 'N/A'}</div>
                        </div>
                    </div>
                `;
            })
            .join("");
    }


    // pdf download


    function downloadFromS3() {
        console.log("download button clicked");
        const brand = productData.brand;
        const asin = productData.asin;
        const date = productData.lastUpdated




        const link = document.createElement("a");
        link.href = `/api/v3/agent/report/download/${brand}/${asin}/${date}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const setActiveCategory = (categoryId) => {
        activeCategory = categoryId;
        renderCategoryGrid();
        renderCategoryDetails();
    };


    // key


    // let key = ajaxify.data.key;
    // console.log(key);




    pdpAudit.init = function () {
        console.log("Initializing audit.");
        let key = ajaxify.data.key;
        console.log("key is :", key);


        auditForm = document.getElementById("auditForm");
        auditResults = document.getElementById("auditResults");
        startAuditBtn = document.getElementById("startAuditBtn");
        asinInput = document.getElementById("asinInput");
        let viewAmazon = document.getElementById("myLink");




        if (auditForm) auditForm.style.display = "block";
        if (auditResults) auditResults.style.display = "none";


        if (startAuditBtn) {
            startAuditBtn.addEventListener("click", () => render(true));


            async function render(latest) {
                const asinValue = asinInput ? asinInput.value.trim() : '';


                const asin = asinValue;


                // if (!asinValue && ajaxify.data.report) {
                //     alert("Enter ASIN.");
                //     return;
                // }


                startAuditBtn.innerHTML = `
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    Analyzing Product...
                `;
                startAuditBtn.disabled = true;


                try {
                    // const apiResponseData = require("./auditReport.json");
                    // console.log(apiResponseData);
                    // const asin = asinValue;
                    // const apiResponseData = await api.post(/agent/generate-report/${asin}, { "asin": asinValue });
                    const apiResponseData = ajaxify.data.report && !latest ? ajaxify.data.report : await api.post((`/agent/generate-report/${asin}`));
                    console.log("this is the api response --->",apiResponseData);


                    // preview api
                    // if(apiResponseData){
                    //     const asin = apiResponseData.asin || asinValue;
                    //     const previewData = await api.get(`/agent/data/${asin}`)
                    //         renderProductPreview(previewData);
                    // }
                    // Map response data based on the new schema
                    // results is now an object: audit_overview.categories
                    productData = {
                        name: apiResponseData.product_title || (apiResponseData.brand ? apiResponseData.brand + " Product" : 'N/A'),
                        brand: apiResponseData.brand || apiResponseData.data.brand || 'N/A',
                        asin: apiResponseData.asin || asinValue,
                        lastUpdated: apiResponseData.date ||apiResponseData.data.date || 'N/A',
                        results: apiResponseData?.reports?.audit_overview && apiResponseData?.reports?.audit_overview.categories
                            ? apiResponseData?.reports?.audit_overview?.categories
                            : {},
                        reports: apiResponseData.reports || {},
                        priority_issues: apiResponseData?.reports?.priority_issues || [],
                        overallScore: apiResponseData?.reports?.audit_overview?.overall_score || 0
                    };


                    viewAmazon.href = ` https://www.amazon.in/dp/${productData.asin}`;


                    if (auditForm) auditForm.style.display = "none";
                    if (auditResults) auditResults.style.display = "block";


                    // Set active category to first category key
                    const firstCategoryKey = Object.keys(productData.results)[0];
                    if (firstCategoryKey) {
                        activeCategory = firstCategoryKey.toLowerCase().replace(/\s+/g, "-");
                    } else {
                        activeCategory = "";
                    }


                    renderResults();


                } catch (error) {
                    console.error("Audit error:", error);
                    alert("Audit failed: " + error);
                    if (auditForm) auditForm.style.display = "block";
                    if (auditResults) auditResults.style.display = "none";
                } finally {
                    startAuditBtn.innerHTML = 'Start Audit';
                    startAuditBtn.disabled = false;
                }
            }


            ajaxify.data.report && render()


        }
        const downloadReportBtn = document.getElementById("generateReportBtn");
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener("click", downloadFromS3);
        }
    };


    return pdpAudit;
});
