define("forum/auditAgent/store-summary", ["api"], function (api) {
  const storeSummary = {};

  storeSummary.init = async function () {
    // console.log("this is the store summary page");

    const auditId = ajaxify.data.auditId || "apple_20250717"

    const response = await api.get(`/agent/report/brand/${auditId}`)
    // console.log("API response for store summary:", response);

    const data = response.data || "No data found";

    // store summary 
    const metaCategoryScores = data.metaCategoryScores || "";
    const summaryIssues = data.summaryIssues || "";

    // render the category score total image ,title etc
    const labelMap = {
      title_optimization: "Title",
      bullet_points: "Bullets",
      product_description: "Description",
      image_stack_quality: "Images"
    };

    const scores = Object.entries(metaCategoryScores).map(([key, value]) => ({
      label: labelMap[key] || key,
      score: parseFloat(value)
    }));

    const scoreContainer = document.getElementById("scoreContainer");

    scores.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-6 mb-4";

      const circle = document.createElement("div");
      circle.className = `score-circle ${item.score >= 7 ? "circle-red" : "circle-yellow"}`;
      circle.style.setProperty("--value", item.score * 10);

      const scoreText = document.createElement("span");
      scoreText.textContent = item.score;

      circle.appendChild(scoreText);

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = item.label;

      col.appendChild(circle);
      col.appendChild(label);

      scoreContainer.appendChild(col);
    });


    // set brand name
const brandName = document.getElementById("brand-name");
brandName.innerHTML=`<p>Premium Analytics for <span class="badge text-primary fs-4">${data.storeName}</span> Brand</p>`;

    // score judgement
    const getScoreClass = score => {
      if (score >= 8) return 'score-excellent';
      if (score >= 7) return 'score-good';
      if (score >= 6) return 'score-fair';
      return 'score-poor';
    };


    // format category issues:
    function formatCategory(category) {
      return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // render summary
    const renderSummary = () => {
      const container = document.getElementById("summary-section");

      if (!data.summary || !data.asins || data.asins.length === 0) {
        container.innerHTML = `<div class="alert alert-warning">No data found</div>`;
        return;
      }

      container.innerHTML = `
    <div class="card shadow mb-4">
      <div class="card-header bg-white border-bottom">
        <h4 class="mb-0">
          <i class="bi bi-graph-up-arrow text-warning me-2"></i>Executive Summary
        </h4>
      </div>

      <div class="card-body">
        <div class="row">
          <!-- Left: Summary Text -->
          <div class="col-md-8">
            <p>
              Your brand portfolio demonstrates a 
              <span class="fw-semibold text-warning">${data.summary.overallScore}/10</span> overall performance score across 
              <span class="fw-semibold">${data.summary.totalProducts}</span> products. 
              <span class="text-success">${data.summary.highPerforming} high performing products</span>, 
              <span class="text-danger">${data.summary.needsAttention} products need attention</span>.
            </p>
            <ul class="text-muted small">
    ${summaryIssues
          .map(item => `<li><strong>${formatCategory(item.category)}:</strong> ${item.text}</li>`)
          .join('')}
  </ul>
          </div>

          <!-- Right: Performance Metrics Card -->
          <div class="col-md-4">
            <div class="border rounded shadow-sm p-3 bg-white h-100">
              <h6 class="mb-3 text-muted"><i class="bi bi-bar-chart-line-fill me-1 text-warning"></i>Performance Metrics</h6>
             <div class="text-center mb-3">
              <h3 class="text-warning fw-bold mb-1">${data.summary.overallScore}</h3>
              <span class="badge bg-warning text-white mb-2">Good</span>
</div>
              <div class="small text-muted mb-1">Portfolio Optimization</div>
              <div class="progress mb-2" style="height: 6px;">
                <div class="progress-bar bg-success" style="width: ${data.summary.overallScore * 10}%"></div>
              </div>
              <div class="d-flex justify-content-between small">
                <div class="bg-light-success p-2 rounded text-center flex-fill me-2">
                  <div class="fw-bold text-success">${data.summary.highPerforming}</div>
                  <div class="text-muted">High Performers</div>
                </div>
                <div class="bg-light-danger p-2 rounded text-center flex-fill">
                  <div class="fw-bold text-danger">${data.summary.needsAttention}</div>
                  <div class="text-muted">Need Attention</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
    };



    // render produts
    const renderProducts = () => {
      const list = document.getElementById("product-list");
      let products = [...data.asins];
      const search = document.getElementById("search-input").value.toLowerCase();
      const filter = document.getElementById("performance-filter").value;
      const sort = document.getElementById("sort-by").value;
      // const viewLink =  `/agents/audit?key=${item._key}`;
      
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(search)) ||
        (p.asin && p.asin.toLowerCase().includes(search))
      );


      if (filter !== "all") {
        products = products.filter(p => {
          const s = p.overallScore;
          return (filter === "excellent" && s >= 8) ||
            (filter === "good" && s >= 7 && s < 8) ||
            (filter === "fair" && s >= 6 && s < 7) ||
            (filter === "poor" && s < 6);
        });
      }

      // Sort
      products.sort((a, b) => sort === "asc" ? a.overallScore - b.overallScore : b.overallScore - a.overallScore);

      if (products.length === 0) {
        list.innerHTML = `<div class="alert alert-info">No products match the selected criteria.</div>`;
        return;
      }

   
     


      // control title length 
      function truncateWords(str, wordLimit = 7) {
        const words = str.trim().split(/\s+/);
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : str;
      }

      list.innerHTML = products.map(p => `
  <div class="card shadow-sm rounded-4 p-3 mb-3">
   <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">

  <!-- Overall Score -->
  <div class="text-center px-3 py-2 bg-light rounded-3" style="width: 120px;">
    <p class="text-muted small mb-1">OVERALL SCORE</p>
        <h4 class="fw-bold ${getScoreClass(p.overallScore)} mb-0">${p.overallScore.toFixed(1)}</h4>
        <span class="text-muted small">/10</span><br>
        <span class="text-muted small">${p.overallScore >= 8 ? "Excellent" : p.overallScore >= 7 ? "Good" : p.overallScore >= 6 ? "Fair" : "Needs Work"}</span>
  </div>

  <!-- Title + ASIN -->
  <div style="width: 300px;">
    <h6 class="fw-semibold mb-1" title="${p.title}">${truncateWords(p.title)}</h6>
    <p class="mb-1 small">ASIN: <code class="text-danger">${p.asin}</code></p>
    <p class="text-muted small mb-0">Last audited: ${p.lastAudited}</p>
  </div>

  <!-- Category Scores -->
  <div class="d-flex flex-wrap gap-2" style="flex: 1 1 auto; min-width: 360px;">
    ${Object.entries(p.categoryScores).map(([cat, score]) => `
      <div class="border rounded-3 p-2 text-center" style="width: 100px;">
        <div class="fw-bold ${getScoreClass(score)}">${score !== null && score !== undefined ? score.toFixed(1) : "N/A"}</div>
        <div class="text-muted small text-capitalize text-truncate">${cat}</div>
        <div class="progress bg-light mt-1" style="height: 5px;">
          <div class="progress-bar ${getScoreClass(score)}" style="width: ${score * 10}%"></div>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- Preview Button -->
  <div style="width: 150px;" class="text-end">
    <a href="pdp-report?key=${p._key}" class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1">
      <i class="fas fa-eye"></i> Preview Audit
    </a>
  </div>

</div>

  </div>
`).join('');


      ;
    }




    // Event listeners
    document.getElementById("search-input").addEventListener("input", renderProducts);
    document.getElementById("performance-filter").addEventListener("change", renderProducts);
    document.getElementById("sort-by").addEventListener("change", renderProducts);

    renderSummary();
    renderProducts();
  }
  return storeSummary;

});