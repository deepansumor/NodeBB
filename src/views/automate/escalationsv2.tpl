<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Bootstrap Icons -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
<!-- Custom CSS -->


<div class="bg-light escalationv2_page_bg">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light escalationv2_page_bg border-bottom">
        <div class="container-fluid px-4">
            <div class="navbar-brand">
                <h1 class="h3 mb-0 text-dark fw-bold">Escalation Dashboard</h1>
                <small class="text-muted">Monitor and manage campaign escalations</small>
            </div>
            <div class="d-flex align-items-center gap-3">

            </div>
        </div>
    </nav>

    <div class="container-fluid p-4 escalationv2_page_bg" style="background-color: #f8f9fa !important;" id="main-content">
        <!-- Summary Cards -->
        <div class="row g-4 mb-4 escalationv2_page_bg">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title text-muted mb-0">Total Escalations</h6>
                            <i class="bi bi-activity text-primary fs-4"></i>
                        </div>
                        <div class="h2 fw-bold text-dark mb-1" id="total-escalations">0</div>
                        <small class="text-muted">All escalations tracked</small>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title text-muted mb-0">Unresolved</h6>
                            <i class="bi bi-x-circle text-danger fs-4"></i>
                        </div>
                        <div class="h2 fw-bold text-danger mb-1" id="unresolved-count">0</div>
                        <small class="text-muted">Require immediate attention</small>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title text-muted mb-0">Resolved</h6>
                            <i class="bi bi-check-circle text-success fs-4"></i>
                        </div>
                        <div class="h2 fw-bold text-success mb-1" id="resolved-count">0</div>
                        <small class="text-muted">Successfully handled</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Escalations Table -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom"
                style="position:sticky; top:0; z-index: 10; padding:1rem 0rem">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1 fw-semibold">Escalation Details</h5>

                    </div>
                    <div class="d-flex gap-2">
                        <!-- Date Range Filter -->
                        <select class="form-select form-select-sm" id="date-range-filter" style="width: 180px;">
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 days</option>
                            <option value="last30days" selected>Last 30 days</option>
                            <option value="last3months">Last 3 months</option>

                        </select>
                    </div>
                </div>
                <!-- Filters Row -->
                <div class="border-bottom filterClass" style="padding: 1rem 0;">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label small">Brand</label>
                            <select class="form-select form-select-sm" id="brand-filter">
                                <option value="">All Brands</option>
                                {{{each categories}}}
                                <option value="{categories.cid}">{categories.name}</option>
                                {{{end}}}
                            </select>
                        </div>

                        <!-- stage Filter  -->
                        <div class="col-md-2">
                            <label class="form-label small">Stage</label>
                            <select class="form-select form-select-sm" id="stage-filter">
                                <option value="">All Stages</option>
                                <option value="stage1">Stage 1</option>
                                <option value="stage2">Stage 2</option>
                                <option value="stage3">Stage 3</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small">Portfolio</label>
                            <select class="form-select form-select-sm" id="portfolio-filter">
                                <option value="null">All Types</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label small">Status</label>
                            <select class="form-select form-select-sm" id="status-filter">
                                <option value="">All Statuses</option>
                                <option value="1">Resolved</option>
                                <option value="0">Unresolved</option>
                            </select>
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <button class="btn btn-outline-secondary btn-sm w-100" id="clear-filters">
                                <i class="bi bi-x-circle me-1"></i>Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body p-0" style="position: relative;">
                <!-- filter row -->

                <!-- Table -->
                <div class="table-responsive">
                    <table class="table table-hover mb-0" style="min-height: 100px;">
                        <thead class="table-light">
                            <tr>
                                <th class="sortable" data-field="brand">
                                    Brand
                                </th>
                                <th class="sortable" data-field="stage">
                                    Stage
                                </th>
                                <th>Portfolio</th>
                                <th>Summary</th>
                                <th class="sortable" data-field="date">
                                    Date
                                </th>
                                <th class="sortable" data-field="status">
                                    Status
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="escalations-table-body">
                            <!-- Table rows will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>

                <div id="paginationControls" class="my-3 text-center"></div>

                <!--Loader (Initially Hidden) -->

                <div class="loader-container">
                    <div class="loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Detail Panel (Initially Hidden) -->
    <div class="detail-panel" id="detail-panel">
        <div class="detail-panel-header">
            <div>
                <h5 class="mb-1">Escalation Details</h5>
                <small class="text-muted" id="detail-panel-id">ID: ESC-</small>
            </div>
            <button class="btn btn-sm btn-outline-secondary" id="close-detail-panel">
                <i class="bi bi-x"></i>
            </button>
        </div>

        <div class="detail-panel-content">
            <!-- Summary Section -->
            <div class="mb-4">
                <h6 class="fw-semibold mb-3">Summary</h6>
                <div class="p-3 bg-light rounded border">
                    <p class="mb-0 small" id="detail-summary"></p>
                </div>
            </div>

            <!-- Details Section -->
            <div class="mb-4">
                <h6 class="fw-semibold mb-3">Details</h6>
                <div class="row g-3">
                    <div class="col-6">
                        <label class="form-label small text-muted">Brand</label>
                        <p class="mb-0 fw-medium" id="detail-brand"></p>
                    </div>
                    <div class="col-6">
                        <label class="form-label small text-muted">Stage</label>
                        <div id="detail-stage"></div>
                    </div>
                    <div class="col-6">
                        <label class="form-label small text-muted">Portfolio/Ad Type</label>
                        <p class="mb-0 text-muted" id="detail-portfolio"></p>
                    </div>
                    <div class="col-6">
                        <label class="form-label small text-muted">Cadence</label>
                        <p class="mb-0 text-muted">Daily</p>
                    </div>
                    <div class="col-6">
                        <label class="form-label small text-muted">Date</label>
                        <p class="mb-0 text-muted" id="detail-date"></p>
                    </div>
                    <div class="col-6">
                        <label class="form-label small text-muted">Status</label>
                        <div id="detail-status"></div>
                    </div>
                </div>
            </div>

            <!-- History Timeline -->
            <div class="mb-4">
                <h6 class="fw-semibold mb-3">History Log</h6>
                <div class="timeline" id="detail-timeline">
                    <!-- Timeline items will be populated by JavaScript -->
                </div>
            </div>

            <!-- Add Remark -->
            <div class="mb-4  addReplies">
                <h6 class="fw-semibold mb-3">Add Remark</h6>
                <div class="mb-3">
                    <textarea class="form-control" rows="3" placeholder="Write your remark..."
                        id="remark-textarea"></textarea>
                </div>
                <button class="btn btn-primary btn-sm post-reply">
                    <i class="bi bi-send me-1"></i>Post
                </button>
            </div>

            <!-- Escalation Reason -->
            <div class="mb-4 addReplies">
                <h6 class="fw-semibold mb-3">Reason for Escalation</h6>
                <div class="d-flex flex-column gap-2">
                    <select class="form-select form-select-sm flex-grow-1" id="escalation-reason">
                        <option value="">Select reason...</option>
                        <option value="budget-exceeded">Budget Exceeded</option>
                        <option value="performance-drop">Performance Drop</option>
                        <option value="technical-issue">Technical Issue</option>
                        <option value="policy-violation">Policy Violation</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea type="text" id="custom-reason" class="form-control mt-2"
                        placeholder="Enter escalation reason..." style="display:none;  "></textarea>
                    <button class="btn btn-primary btn-sm post-reason">Add</button>
                </div>
            </div>
        </div>



    </div>



    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JavaScript -->

</div>