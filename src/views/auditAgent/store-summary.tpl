
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#">
            <div class="brand-logo"></div>
            <span class="brand-text">Audit System</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="/agents">Dashboard</a></li>
                <li class="nav-item"><a class="nav-link " href="/agents/audit">PDP Audit</a></li>
                <li class="nav-item"><a class="nav-link active" href="/agents/audit">Store Audit</a></li>
            </ul>
        </div>
    </div>
</nav>

<div>
  <a href="#" class="btn btn-outline-secondary bg-white" onclick="window.history.back(); return false;">
    &larr; Back
  </a>
</div>



<div class="container py-5">
  <h1 class="display-5 fw-bold mb-4">Brand Performance Dashboard</h1>
  <p class="brand" id="brand-name"></p>

  <!-- Summary -->
  <div id="summary-section"></div>

  <!--category Analysis section-->
    <div class="container py-5 px-0">
    <div class="card shadow-sm p-4 rounded">
      <h5 class="mb-4 d-flex align-items-center">
        <span class="dot me-2"></span> Category Performance Analysis
      </h5>
      <div class="row text-center" id="scoreContainer">
        <!-- JavaScript will inject content here -->
      </div>
    </div>
  </div>

  <!--product section-->


<div class="card border-0 shadow-sm mb-0" style="background: linear-gradient(to right, #f0f2f5, #f8f9fa);">
  <div class="card-body py-3 px-4">
    <h5 class="fw-semibold mb-1 text-dark">
      <i class="bi bi-bar-chart-line-fill me-2 text-secondary"></i>Product Performance Analysis
    </h5>
    <p class="text-muted small mb-1">Individual product scores and optimization opportunities</p>
  </div>
</div>
  <!-- Filters -->
  <div class="product" style="background: white">
  <div class="row m-4  ">
    <div class="col-md-6 mb-2">
      <input id="search-input" type="text" class="form-control" placeholder="Search by title or ASIN...">
    </div>
    <div class="col-md-3 mb-2">
      <select id="performance-filter" class="form-select">
        <option value="all">All Performance Levels</option>
        <option value="excellent">Excellent (8+)</option>
        <option value="good">Good (7-7.9)</option>
        <option value="fair">Fair (6-6.9)</option>
        <option value="poor">Needs Work (&lt;6)</option>
      </select>
    </div>
    <div class="col-md-3 mb-2">
      <select id="sort-by" class="form-select">
        <option value="desc">Score: High to Low</option>
        <option value="asc">Score: Low to High</option>
      </select>
    </div>
  </div>

  <!-- ASIN Cards -->
  <div id="product-list" class="m-4"></div>
</div>
</div>