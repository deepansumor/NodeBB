
 
  <div class="container bg-image">
    <div class="bg-white rounded">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h4 fw-bold text-primary">
          Escalations Dashboard
        </h1>
        <div class="d-flex gap-2">
          <label class="d-flex align-items-center">
            <span class="me-2 text-secondary text-nowrap">Filter by Account:</span>
            <select id="accountFilter" class="form-select">
              {{{each categories}}}
              <optgroup label="{categories.name}">

                {{{each categories.children}}}
                <option value="{categories.children.slug}">{categories.children.name}</option>
                {{{end}}}

              </optgroup>

              {{{end}}}
            </select>
          </label>
        </div>
      </div>

      <div class="table-responsive  bg-white rounded border-start border-end">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th class="text-center text-uppercase small fw-semibold">
                SR. NO
              </th>

              <th class="text-center text-uppercase small fw-semibold">
                AD TYPE
              </th>
              <th class="text-center text-uppercase small fw-semibold">
                CADENCE
              </th>
              <th class="text-center text-uppercase small fw-semibold">
                ESCALATION DATE
              </th>

              <th class="text-center text-uppercase small fw-semibold">
                STATUS
              </th>
              <th class="text-center text-uppercase small fw-semibold">
              <label>
                <span class="me-2  text-nowrap">Alert by Metrics:</span></label>
                <select id="metricFilter" class="form-select form-select-sm " style="width: auto; display: inline-block;">
                <option value="ALL">All Metrics</option>
                <option value="Sales">Sales</option>
                <option value="ACoS">ACOS</option>
                <option value="ROAS">ROAS</option>
                <option value="Spend">Spend</option>
                <option value="cpc">CPC</option>
                <option value="cvr">CVR</option>
                </select>
              </th>
              <th class="text-center text-uppercase small fw-semibold">
                Remark
              </th>
            </tr>
          </thead>
          <tbody id="escalationTable" class="table-group-divider">

          </tbody>
        </table>
        <div id="paginationControls" class="my-3 text-center"></div>
      </div>
    </div>
</div>