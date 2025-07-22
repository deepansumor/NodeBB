<title>Amazon Audit Dashboard</title>
    <nav class="navbar navbar-expand-lg navbar-light bg-red border-bottom py-3">
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
                        <a class="nav-link active" aria-current="page" href="/agents">
                             Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/agents/audit">
                           PDP Audit
                        </a>
                    </li>
                   
                </ul>
            </div>
        </div>
    </nav>

    <div class="main-content">
        <div class="container py-4">
            <div class="text-center mb-5">
                <h1 class="display-4 fw-bold">
                    Amazon <span class="text-primary">Audit</span> Dashboard
                </h1>
                <p class="lead text-muted">
                    Analyze your Amazon product listings and brand stores to identify optimization opportunities and boost your performance.
                </p>
                <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                    <a href="/agents/audit" class="btn btn-primary btn-lg">
                        Start PDP Audit
                        <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                   
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-3 col-sm-6">
                    <div class="card stat-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="text-muted mb-4">Total Audits</p>
                                    <h3 class="fw-bold mb-0" id="totalAudits">10</h3>
                                </div>
                                <i class="fas fa-chart-bar fa-2x text-primary"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="card stat-card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="text-muted mb-1">Avg PDP Score</p>
                                    <h3 class="fw-bold mb-0">73.2</h3>
                                </div>
                                <i class="fas fa-chart-line fa-2x text-success"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
               
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-white pb-0">
                    <h5 class="card-title mb-1">Available Audits</h5>
                    <p class="text-muted mb-0">Your audit results and performance insights</p>
                </div>
                <div class="card-body pt-3">


</div>

            </div>
        </div>
    </div>