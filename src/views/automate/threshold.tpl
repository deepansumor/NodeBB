<body class="bg-light">

    <div class="container py-5">
        <div class="card mx-auto p-4" style="max-width: 900px;">
            <h2 class="h3 font-weight-bold text-primary mb-5 text-center">
                Account Thresholds Configuration
            </h2>

            <form id="AccountForm" class="space-y-6">
                <!-- Account Selection Section -->
                <section class="bg-light p-4 rounded border mb-4">
                    <h3 class="h5 font-weight-semibold text-primary mb-3">
                        Account Details
                    </h3>

                    <div class="row g-4">
                        <!-- Account Name -->
                        <div class="col-md-6">
                            <label for="account_name" class="form-label text-secondary">
                                Account Name
                            </label>
                            <select id="account_name" name="account_name" required class="form-select form-control-lg">
                                <option value="">Select Account</option>
                            </select>
                        </div>

                        <!-- Account ID -->
                        <div class="col-md-6">
                            <label for="account_id" class="form-label text-secondary">
                                Account ID
                            </label>
                            <input type="text" id="account_id" name="account_id" readonly
                                class="form-control form-control-lg bg-light" />
                        </div>
                    </div>
                </section>

                <!-- wait time sop Section -->
                <section class="bg-light p-4 rounded border mb-4">
                    <h3 class="h5 font-weight-semibold text-primary mb-3">
                        Escalations Wait Time SOP
                    </h3>

                    <div class="row g-4">

                        <!-- MANDATORY METRICS -->
                        {{{each wait_time_sop}}}
                        <div class="col-md-4">

                            <label for="{{ wait_time_sop.key }}" class="form-label">
                                {{ wait_time_sop.label }} <span class="text-danger">*</span>
                            </label>
                            <input type="number" id="{{ wait_time_sop.key }}" name="{{ wait_time_sop.key }}"
                               required class="form-control form-control-lg" />
                        </div>
                        {{{end}}}

                       

                    </div>
                </section>

                <!-- Thresholds Section -->
                <section class="bg-light p-4 rounded border mb-4">
                    <h3 class="h5 font-weight-semibold text-primary mb-3">
                        Performance Thresholds
                    </h3>

                    <div class="row g-4">

                        <!-- MANDATORY METRICS -->
                        {{{each mandatory_metrics}}}
                        <div class="col-md-4">

                            <label for="{{ mandatory_metrics.key }}" class="form-label">
                                {{ mandatory_metrics.label }} <span class="text-danger">*</span>
                            </label>
                            <input type="number" id="{{ mandatory_metrics.key }}" name="{{ mandatory_metrics.key }}"
                                step="0.01" required class="form-control form-control-lg" />
                        </div>
                        {{{end}}}

                        <!-- OPTIONAL METRICS -->
                        {{{each optional_metrics}}}
                        <div class="col-md-4">
                            <input type="checkbox" id="{{ optional_metrics.key }}_check"
                                name="{{ optional_metrics.key }}_check" class="form-check-input mb-2" />
                            <label for="{{ optional_metrics.key }}" class="form-label">
                                {{ optional_metrics.label }}
                            </label>
                            <input type="number" id="{{ optional_metrics.key }}" name="{{ optional_metrics.key }}"
                                step="0.01" required class="form-control form-control-lg" disabled />
                        </div>
                        {{{end}}}

                    </div>
                </section>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-primary w-100 py-3">
                    Save Thresholds
                </button>
            </form>

            <!-- Response Message -->
            <div id="responseMessage" class="mt-4 text-center h5 text-secondary d-none"></div>
        </div>
    </div>

</body>