<!-- Header -->
<div class="header-section">
  <div class="container">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
      <div class="d-flex align-items-center mb-3 mb-md-0">
        <div class="d-flex align-items-center justify-content-center bg-primary rounded me-3" style="width: 2.5rem; height: 2.5rem;">
           <i class="bi bi-gear-fill text-white"></i>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings w-5 h-5 text-white"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </div>
        <div>
          <h1 class="h3 fw-bold text-dark mb-0">Threshold Configuration</h1>
          <p class="text-muted small mb-0">Manage performance thresholds for Amazon Ad portfolios</p>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
      
        <div class="d-flex align-items-center text-warning d-none" id="unsavedIndicator">
          <i class="bi bi-exclamation-triangle me-2"></i>
        
        </div>
        <button class="btn btn-outline-secondary btn-sm" id="resetBtn" >
          <i class="bi bi-arrow-clockwise me-1"></i>
          Reset All
        </button>
      </div>
    </div>
  </div>
</div>

 <!--Main container-->

<div class="container">

  <!-- Account Selection -->
  <div class="section-card">
    <h6 class="card-title">Account Selection</h6>
    <p class="card-description">Select the Amazon Ad account to configure thresholds for</p>
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Account</label>
        <select class="form-select" id="accountSelect" >
          <!--options populate by js -->
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Account ID</label>
        <input type="text" class="form-control bg-light" id="accountId"  readonly />
      </div>
      <div class="col-md-4">
        <label class="form-label">Portfolios</label>
        <input type="text" class="form-control bg-light" id="portfolioCount"  readonly />
      </div>
    </div>
  </div>

  <!-- Wait Time SOP -->
  <div class="section-card">
    <h6 class="card-title">Wait Time SOP</h6>
    <p class="card-description">Configure the number of days to wait before escalating to the next stage if issues are not resolved</p>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Stage 1 <span class="required-indicator">*</span></label>
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Enter days" value="3" min="1" id="stage1"  />
          <span class="input-group-text">days</span>
        </div>
        <div class="invalid-feedback d-none" id="stage1Error">Stage 1 wait time is required</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Stage 2 <span class="required-indicator">*</span></label>
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Enter days"  id="stage2" disabled />
          <span class="input-group-text">days</span>
        </div>
        <div class="invalid-feedback d-none" id="stage2Error">Stage 2 wait time is required</div>
      </div>
    </div>
    <div class="mt-3 info-box info-box-blue">
      <div class="d-flex align-items-start">
        <i class="bi bi-info-circle me-2 mt-1 flex-shrink-0"></i>
        <div>
          <p class="fw-medium mb-1 small">Escalation Process:</p>
          <ul class="mb-0 small ps-3">
            <li>If an escalation is not resolved within Stage 1 timeframe, it moves to Stage 2</li>
            <li>If still unresolved after Stage 2 timeframe, it escalates to Stage 3</li>
            <li>Configure appropriate wait times based on your team's response capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Critical Threshold -->
  <div class="section-card">
    <h6 class="card-title">Critical Threshold</h6>
    <p class="card-description">This is critical threshold value if this threshold breach the escalation will send ops head and the brand Pocs</p>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Critical </label>
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Enter 20/35/52.." id="critical"  />
          <span class="input-group-text">%</span>
        </div>
        
      </div>
     
    </div>
    <div class="mt-3 info-box info-box-blue">
      <div class="d-flex align-items-start">
        <i class="bi bi-info-circle me-2 mt-1 flex-shrink-0"></i>
        <div>
          <p class="fw-medium mb-1 small">Critical Threshold:</p>
          <ul class="mb-0 small ps-3">
            <li>Critical threshold is the buffer addon with the threshold </li>
            <li>This indicate a big change observed in that particular portfolio</li>
            <li>Example- if we set the sales 2% and we added critical 50% , this mean the critical threshold became 3% (threshold+ critical % of threshold)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Default Thresholds -->
  <div class="section-card">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div class="d-flex align-items-center">
        <h6 class="card-title mb-0 me-2">Default Thresholds for All Portfolios</h6>
        <i class="bi bi-info-circle text-muted" data-bs-toggle="tooltip" title="These default values will be applied to new portfolios and can be applied to existing ones using the Apply to All button"></i>
      </div>
      <button class="btn btn-primary-custom btn-sm" id="applyAllBtn" >
        <i class="bi bi-files me-1"></i>
        Apply to All Enabled
      </button>
    </div>
    <p class="card-description">Configure default threshold values that can be applied to portfolios</p>

    <div class="row g-3" id="defaultMetrics">
      <!-- Metrics will be populated by JavaScript -->
    </div>

    <div class="mt-3 info-box info-box-blue">
      <div class="d-flex align-items-start">
        <i class="bi bi-info-circle me-2 mt-1 flex-shrink-0"></i>
        <div>
          <p class="fw-medium mb-1 small">Threshold Configuration Guidelines:</p>
          <ul class="mb-0 small ps-3">
            <li>Fields with * are required</li>
            <li>Apply to All - we can apply this threshold configuration to all enabled portfolios</li>
            <li>Save Changes</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Portfolio Thresholds -->
  <div class="section-card">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h6 class="card-title">Portfolio Thresholds</h6>
        <p class="card-description">Configure individual portfolio threshold values</p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="badge badge-enabled small" id="enabledCount"></span>
        <button class="btn btn-success-custom btn-sm" id="saveChangesBtn">
          <i class="bi bi-check me-1"></i>
          Save All Changes
        </button>
      </div>
    </div>

    <!-- Search/Filter Section -->
    <div class="mb-4">
      <div class="position-relative" id="searchContainer">
        <div class="search-input">
          <i class="bi bi-search search-icon"></i>
          <input type="text" class="form-control" id="portfolioSearch" placeholder="Search portfolios or select multiple..." 
                 >
          <button class="clear-btn d-none" id="clearBtn" >&times;</button>
        </div>
        
        <!-- Search Dropdown -->
        <div class="search-dropdown d-none" id="searchDropdown">
          <div class="p-2">
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div class="d-flex align-items-center">
                <input type="checkbox" class="form-check-input me-2" id="selectAll" onchange="handleSelectAll()">
                <label class="form-check-label small fw-medium" for="selectAll">Select All (<span id="searchCount">0</span>)</label>
              </div>
              <button class="btn btn-sm btn-link text-muted p-0" onclick="hideDropdown()">Done</button>
            </div>
            <div id="portfolioOptions">
              <!-- Portfolio options will be populated by JavaScript -->
            </div>
          </div>
        </div>

        <!-- No results message -->
        <div class="search-dropdown d-none" id="noResults">
          <div class="p-4 text-center text-muted">
            <p class="small mb-0">No portfolios found matching "<span id="searchTerm"></span>"</p>
          </div>
        </div>
      </div>

      <!-- Selection Summary -->
      <div class="selection-summary d-none" id="selectionSummary">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex gap-3">
            <span>Showing <span id="filteredCount">0</span> of <span id="totalCount">0</span> portfolios</span>
            <span class="text-blue-600 d-none" id="selectedInfo">0 selected</span>
            <span class="text-blue-600 d-none" id="searchInfo">Search: ""</span>
          </div>
          <button class="btn btn-outline-secondary btn-sm" onclick="clearAllFilters()">Clear All</button>
        </div>
      </div>
    </div>

    <!-- Portfolio List -->
    <div id="portfolioList">
      <!-- Portfolios will be populated by JavaScript -->
    </div>

    <!-- Empty State -->
    <div class="empty-state d-none" id="emptyState">
      <p class="small">No portfolios match your current selection.</p>
      <button class="btn btn-outline-secondary btn-sm" onclick="clearAllFilters()">Clear All</button>
    </div>
  </div>
</div>

<!-- Modals -->
<!-- Apply Confirmation Modal -->
<div class="modal fade" id="applyModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Apply Default Thresholds</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>This will apply the default threshold configuration to all <span id="enabledPortfolioCount">0</span> enabled portfolios. Any custom values will be overwritten.</p>
        <p>You can undo this action immediately after applying.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary-custom" onclick="confirmApplyToAll()">Apply Changes</button>
      </div>
    </div>
  </div>
</div>

<!-- Save Confirmation Modal -->
<div class="modal fade" id="saveModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Save All Changes</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to save these changes?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success-custom" onclick="confirmSaveAll()">Confirm</button>
      </div>
    </div>
  </div>
</div>