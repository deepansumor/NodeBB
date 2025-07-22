<!-- pdp-audit-form.tpl -->



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

<!-- Main Content -->
<div class="main-content">
    <!-- Initial Form -->
    <div id="auditForm" class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="text-center mb-5">
                    <h1 class="display-5 fw-bold mb-3">PDP Audit Tool</h1>
                    <p class="text-muted">Analyze your Amazon product detail page across 4 key optimization categories</p>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Start Your PDP Audit</h5>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="asinInput" class="form-label">ASIN or Product URL</label>
                            <input type="text" class="form-control font-monospace" id="asinInput" placeholder="B08XXXX123">
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
</div> <!-- .main-content -->
