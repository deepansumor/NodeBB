<!-- pdp-audit-result.tpl -->



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
                <li class="nav-item"><a class="nav-link active" href="/agents/audit">PDP Audit</a></li>
                <li class="nav-item"><a class="nav-link " href="/agents/brand-audit">Store Audit</a></li>
            </ul>
        </div>
    </div>
</nav>
<div>
  <a href="#" class="btn btn-outline-secondary bg-white" onclick="window.history.back(); return false;">
    &larr; Back
  </a>
</div>

<!-- Main Content -->
<div class="main-content">
    <!-- Results -->
    <div id="auditResults" class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-1">PDP Audit Results</h2>
                <div class="text-muted small">Comprehensive analysis based on Amazon optimization best practices</div>
            </div>
            <a class="btn btn-outline-primary btn-sm" id="myLink" href="#" target="_blank">
                <i class="fas fa-external-link-alt me-1"></i>
                View on Amazon
            </a>
        </div>

        <div class="row">
            <div class="col-lg-9">
                <!-- Product Info -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="fw-semibold mb-1" id="productName">Puma Men Dazzler Sneaker</h4>
                        <div class="text-muted small" id="productInfo">
                            Brand: Puma | ASIN: B08XXXX123 | Last Updated: June 4, 2025
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div class="card" id="productPreview"></div>

                <!-- Categories -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-1">Audit Categories</h5>
                        <p class="text-muted small mb-0">Select a category to view detailed analysis</p>
                    </div>
                    <div class="card-body">
                        <!-- Category Grid -->
                        <div class="row g-3 mb-4" id="categoryGrid">
                            <!-- Categories populated by JS -->
                        </div>

                        <!-- Category Details -->
                        <div id="categoryDetails">
                            <!-- Details populated by JS -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3">
                <!-- Overall Score -->
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <div class="score-circle mx-auto mb-3" id="overallScoreCircle">
                            <div class="score-text">
                                <span class="score-number">7.3</span>
                                <span class="score-total">/10</span>
                            </div>
                        </div>
                        <h6 class="fw-semibold">Overall Score</h6>
                        <hr>
                        <div id="categoryScores"></div>
                    </div>
                </div>

                <!-- Priority Issues -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h6 class="card-title mb-0">Priority Issues</h6>
                    </div>
                    <div class="card-body">
                        <div id="priorityIssues"></div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="card">
                    <div class="card-header">
                        <h6 class="card-title mb-0">Actions</h6>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-primary w-100 mb-2 border-0" id="generateReportBtn">
                            <i class="fas fa-file-download me-2"></i>
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> <!-- .main-content -->
