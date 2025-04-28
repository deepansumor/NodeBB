define("forum/automate/thresholds", ["jquery","api"], function (api) {
	const accountForm = {};

	accountForm.init = function () {
		const accountSelect = $("#account_name");
        
		// Dummy accounts fallback
		const dummyAccounts = [
			{ account_id: "123", account_name: "Account One" },
			{ account_id: "456", account_name: "Account Two" },
		];

		// API endpoints
		const API = {
			GET_ACCOUNTS: "/api/v3/automate/get-accounts",
			SUBMIT_THRESHOLDS: "/api/v3/automate/update-thresholds",
		};

		// Set loading state
		function setLoadingState(selectElement, message) {
			selectElement.html(`<option value="">${message}</option>`);
		}

		// Populate account dropdown
		function populateAccounts(accounts) {
			
			accountSelect.empty().append('<option value="">Select Account</option>');
			accounts.forEach((account) => {
				accountSelect.append(
					`<option value="${account.groupSlug}">${account.groupName}</option>`
				);
			});
		}

		// Load accounts from API
		function loadAccounts() {
			
			setLoadingState(accountSelect, "Loading accounts...");
		
				// setTableLoading();
				
				api
					.get(API.GET_ACCOUNTS)
					.then((data) => {
						console.log("Loading threshold...");
						console.log("data from the threshold -->",data)
						populateAccounts(data);
						
					})
					.catch((err) => {
						console.error("Error loading threshold:", err);
						throw new Error("error -->",err);
						;
					});
		}
		// Bind account select change
		function bindAccountSelect() {
			accountSelect.on("change", function () {
				$("#account_id").val(this.value);
			});
		}

		// Bind checkbox toggles
		function bindCheckboxListeners() {
			$('input[type="checkbox"]').on("change", function () {
				const input = $("#" + this.id.replace("_check", ""));
				input.prop("disabled", !this.checked);
				if (!this.checked) input.val("");
			});
		}

		// Bind form submit
		function bindFormSubmit() {
			$("#AccountForm").on("submit", function (event) {
				event.preventDefault();

				const formData = {};
				$(this)
					.serializeArray()
					.forEach(function ({ name, value }) {
						if (!name.endsWith("_check")) {
							const num = parseFloat(value);
							formData[name] = !isNaN(num) ? num : value || null;
						}
					});

				$.ajax({
					url: API.SUBMIT_THRESHOLDS,
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify(formData),
					success: function (data) {
						console.log("Server Response:", data.message);
						alert(data.message);
					},
					error: function () {
						console.error("Error submitting form.");
						alert("Failed to submit data. Please try again.");
					},
				});
			});
		}

		// Initialize everything
		console.log("this is working")
		loadAccounts();
		bindAccountSelect();
		bindCheckboxListeners();
		bindFormSubmit();
	};

	$(document).ready(function () {
		console.log("this is working")
		accountForm.init();
	});

	return accountForm;
});
