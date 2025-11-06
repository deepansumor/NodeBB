<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
<!-- Font Awesome for Icons -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />


<div id="container">
  <!-- Header -->
  <header class="border-bottom bg-light sticky-top">
    <div class="container-fluid px-4 py-3">
      <div class="d-flex justify-content-start align-items-center">
        <div>
          <h1 class="h3 mb-0">Escalation Dashboard</h1>
          <p class="text-muted small mb-0">
            Multi-brand performance insights
          </p>
        </div>

      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container-fluid px-4 py-5">
    <!-- KPI Cards -->
    <div class="row mb-5" id="kpiContainer">
      <!-- KPI cards will be inserted here -->

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted small mb-2">Total Brands Tracked</p>
                <h3 class="mb-0 boldText" id="totalBrand">65</h3>
              </div>
              <div class="bg-primary bg-opacity-10 p-3 rounded">
                <i class="fas fa-building text-primary" style="font-size: 1.5rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted small mb-2">
                  Total Unresolved Escalations
                </p>
                <h3 class="mb-0 boldText" id="totalEscalation">65</h3>
              </div>
              <div class="bg-warning bg-opacity-10 p-3 rounded">
                <i class="fas fa-triangle-exclamation text-warning" style="font-size: 1.5rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted small mb-2">
                  Total resolved Escalation
                </p>
                <h3 class="mb-0 boldText" id="totalResolvedEscalation">50</h3>
              </div>
              <div class="bg-info bg-opacity-10 p-3 rounded">
                <i class="fas fa-chart-line text-info" style="font-size: 1.5rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3 mb-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <p class="text-muted small mb-2">
                  Highest Escalation Brand
                </p>
                <h3 class="mb-0 text-danger boldText" id="highestEscalationBrand">
                  Gits
                </h3>
                <p class="text-muted small mt-2"><span id="highestEscalation">0</span> Escalations</p>
              </div>
              <div class="bg-danger bg-opacity-10 p-3 rounded">
                <i class="fas fa-bullseye text-danger" style="font-size: 1.5rem"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row mb-5" id="chartsContainer">

      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="mb-0">Distribution by Brand</h5>

          </div>
          <div class="card-body" style="height:350px">
            <div id="pieChart" height="150" style="padding-bottom:8px"></div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 mb-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-bottom">
            <h5 class="mb-0">Escalations by Brand</h5>
          </div>
          <div class="card-body" style="height:350px">
            <div id="barChart" height="150" style="padding-bottom:8px"></div>
          </div>
        </div>
      </div>



    </div>

    <!-- Brand Table Section -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Brand Overview</h5>
        <div class="d-flex gap-2 align-items-center">
          <div>
            <label for="escDateFilter" class="form-label mb-0 small text-muted">Date:</label>
            <input id="escDateFilter" class="form-select form-select-sm" type="date" />
          </div>
          <div>
            <label for="sortSelect" class="form-label mb-0 small text-muted" style="width: 150px;">Sort by:</label>
            <select class="form-select form-select-sm" id="sortSelect" style="width: auto">
              <option value="escalations-desc">
                Escalations: High to Low
              </option>
              <option value="escalations-asc">
                Escalations: Low to High
              </option>
            </select>
          </div>

        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0" id="brandTable">
            <thead class="table-light">
              <tr class="p-4">
                <th>Brand Name</th>
                <th class="text-center">Unresolved Escalation</th>
                <th class="text-center">Date</th>
                <th class="text-end" style="width: 120px">Action</th>
              </tr>
            </thead>
            <tbody id="tableBody">
              <!-- Table rows will be inserted here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <!-- Detail Modal -->
  <div class="modal fade" id="detailModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" id="modalBody">
          <!-- Modal content will be inserted here -->
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>-->