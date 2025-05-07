  <div class="container py-5">
    <div class="bg-white rounded shadow p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h4 fw-bold text-primary">
          Escalations Dashboard
        </h1>
        <div class="d-flex gap-2">
          <label class="d-flex align-items-center">
            <span class="me-2 text-secondary">Filter by Account:</span>
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

      <div class="table-responsive bg-white rounded shadow-sm">
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
                ALERT DETAILS
              </th>
              <th class="text-center text-uppercase small fw-semibold">
                Remark
              </th>
            </tr>
          </thead>
          <tbody id="escalationTable" class="table-group-divider">

          </tbody>
        </table>
      </div>
    </div>
</div>