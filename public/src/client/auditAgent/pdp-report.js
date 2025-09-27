
"use strict";

/**
 * PDP Audit Module
 */
define("forum/auditAgent/pdp-report", ['api'], function (api) {


    const pdpReport = {};


    let auditResults;
    let activeCategory = "";
    let productData = null;


    const CATEGORY_KEY_MAP = {
        title_optimization: 'title',
        bullet_points: 'bulletPoint',
        product_description: 'description',
        image_stack_quality: 'image'
    };


// progess bar
    function createProgressBar(percentage, className) {
        // console.log("progress bar");
        return `
            <div class="progress ${className}">
                <div class="progress-bar" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }

// check list 
    function createCriteriaItem(criterion) {
        // console.log("create criteria item");
        const statusClass = criterion.passed ? "text-success" : "text-danger";

        return `
            <div class="d-flex align-items-center gap-2">
                <i class="fas fa-check-circle ${statusClass}"></i>
                <span>${criterion.name}</span>
            </div>
        `;
    }


    function renderResults() {
        // console.log("rendering results");
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

// product info brand , audit date etc 
    function renderProductInfo() {
        // console.log("rendering product info");
        const productNameEl = document.getElementById("productName");
        const productInfoEl = document.getElementById("productInfo");


        if (productNameEl) productNameEl.textContent = productData.brand || 'N/A';
        if (productInfoEl) productInfoEl.textContent =
            ` Brand: ${productData.brand || 'N/A'} | ASIN: ${productData.asin || 'N/A'} | Last Updated: ${productData.lastUpdated || 'N/A'}`;
    }

// category grid title, image etc
    function renderCategoryGrid() {
        // console.log("rendering category grid");
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
        // console.log("generating suggestion HTML");


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

    // render category 
    function renderCategoryDetails() {
        // console.log("rendering category details");
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

    //render overall score
    function renderOverallScore() {
        // console.log("rendering overall score");
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

    // render category scores
    function renderCategoryScores() {
        // console.log("rendering category scores");
        const categoryScores = document.getElementById("categoryScores");
        if (!categoryScores || !productData || !productData.results) return;


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

    // rener priority issues
    function renderPriorityIssues() {
        // console.log("rendering priority issues");
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
        // console.log("download button clicked");
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

    // active category 
    const setActiveCategory = (categoryId) => {
        // console.log("setting active category:", categoryId);
        activeCategory = categoryId;
        renderCategoryGrid();
        renderCategoryDetails();
    };


    // init
    pdpReport.init = function () {
        // console.log("Initializing pdp report page.");
        let key = ajaxify.data.key;
        let asin = ajaxify.data.asin;
        // console.log("key is :", key);

        auditResults = document.getElementById("auditResults");
        let viewAmazon = document.getElementById("myLink");



        render();

        // render the api data
        async function render() {
            // console.log("rendering render function");


            try {

                const apiResponseData = ajaxify.data.report ? ajaxify.data.report : await api.post(`/agent/generate-report/${asin}`);
                // console.log("Api response data for the pdp report page:", apiResponseData, ajaxify.data.report);

                if (apiResponseData) {
                    productData = {
                        name: apiResponseData.product_title || (apiResponseData.metadata ? apiResponseData.metadata.brand + " Product" : 'N/A'),
                        brand: apiResponseData.brand || 'N/A',

                        asin: apiResponseData.asin || asin || apiResponseData.metadata.asin || 'N/A',
                        lastUpdated: apiResponseData.date || apiResponseData.metadata.date || 'N/A',
                        results: apiResponseData?.reports?.audit_overview && apiResponseData?.reports?.audit_overview.categories
                            ? apiResponseData?.reports?.audit_overview?.categories
                            : {},
                        reports: apiResponseData.reports || {},
                        priority_issues: apiResponseData?.reports?.priority_issues || [],
                        overallScore: apiResponseData?.reports?.audit_overview?.overall_score || 0
                    };


                    viewAmazon.href = ` https://www.amazon.in/dp/${productData.asin}`;


                    const firstCategoryKey = Object.keys(productData.results)[0];
                    if (firstCategoryKey) {
                        activeCategory = firstCategoryKey.toLowerCase().replace(/\s+/g, "-");
                    } else {
                        activeCategory = "";
                    }

                    renderResults();

                }

            } catch (error) {
                console.error("Audit error:", error);
                alert("Audit failed: " + error);
            }

        }


        // download report 
        const downloadReportBtn = document.getElementById("generateReportBtn");
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener("click", downloadFromS3);
        }
    };


    return pdpReport;
});


