 <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
 
    <!-- Navbar -->
    
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center gap-2" href="#">
                <div class="brand-logo"></div>
                <span class="brand-text">Audit System</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link " aria-current="page" href="/agents">
                           </i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="/agents/audit">
                            PDP Audit
                        </a>
                    </li>
                   
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Initial Form -->
        <div id="auditForm" class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="text-center mb-5">
                        <h1 class="display-5 fw-bold mb-3">PDP Audit Tool</h1>
                        <p class="text-muted">
                            Analyze your Amazon product detail page across 4 key optimization categories
                        </p>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Start Your PDP Audit</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="asinInput" class="form-label">ASIN or Product URL</label>
                                <input type="text" class="form-control font-monospace" id="asinInput" 
                                       placeholder="B08XXXX123 ">
                            </div>
                            <button class="btn btn-primary btn-lg w-100" id="startAuditBtn">
                                <i class="fas fa-search me-2"></i>
                                Start PDP Audit
                            </button>
                            <div class="text-center text-muted small mt-3">
                                Evaluates: Title, Images, Bullet Points & Description
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results -->
        <div id="auditResults" class="container-fluid py-4" style="display: none;">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold mb-1">PDP Audit Results</h2>
                    <div class="text-muted small">
                        Comprehensive analysis based on Amazon optimization best practices
                    </div>
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
                    <!---preview-->
                    <div class = "card" id="productPreview">
                    </div>

                    <!-- Categories -->
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-1">Audit Categories</h5>
                            <p class="text-muted small mb-0">Select a category to view detailed analysis</p>
                        </div>
                        <div class="card-body">
                            <!-- Category Grid -->
                            <div class="row g-3 mb-4" id="categoryGrid">
                                <!-- Categories will be populated by JavaScript -->
                            </div>

                            <!-- Category Details -->
                            <div id="categoryDetails">
                                <!-- Details will be populated by JavaScript -->
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
                            
                            <div id="categoryScores">
                                <!-- Category scores will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>

                    <!-- Priority Issues -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h6 class="card-title mb-0">Priority Issues</h6>
                        </div>
                        <div class="card-body">
                            <div id="priorityIssues">
                                <!-- Issues will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="card">
                        <div class="card-header">
                            <h6 class="card-title mb-0">Actions</h6>
                        </div>
                        <div class="card-body">
                            <button class="btn btn-primary w-100 mb-2 border-0" id="generateReportBtn">
                                <i class="fas fa-file-download me-2" ></i>
                                Generate Report
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

