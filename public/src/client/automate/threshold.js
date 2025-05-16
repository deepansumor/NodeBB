
define("forum/automate/thresholds", ["jquery", "api"], function (jquery, api) {
	const accountForm = {};

	accountForm.init = function () {
		const accountSelect = $("#account_name");
        let allCategories =[];
		// Dummy accounts fallback
		// const dummyAccounts = [
		// 	{ account_id: "123", account_name: "Account One" },
		// 	{ account_id: "456", account_name: "Account Two" },
		// ];

		// API endpoints
		const API = {
			GET_ACCOUNTS: "/categories",
			// SUBMIT_THRESHOLDS: "/automate/update-thresholds",
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
					`<option value="${account?.meta?.profileId}">${account.name}</option>`
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
					// console.log("Loading threshold...");
					// console.log("data from the threshold -->", data.categories);
					// if (!data || !Array.isArray(data))
					// 	return console.error("No Matching Accounts Found");
					// data = data.filter((account) => account.profileId);
					allCategories = data.categories.filter(category => !category?.parentCid && (category?.meta || {}).profileId)
					
					// console.log("filter category-->", allCategories);
					populateAccounts(allCategories);
				})
				.catch((err) => {
					console.error("Error loading threshold:", err);
					throw new Error("error -->"+ err);
				});
		}
		// Bind account select change
		function bindAccountSelect() {
			accountSelect.on("change", function () {

				// making sure the fields are empty
				$('input[type="number"]').val('');
				$('input[type="text"]').val('');
                $('input[type="checkbox"]').prop('checked', false);

				$("#account_id").val(this.value);

				
				const category = allCategories?.find( category => category?.meta?.profileId == (this.value))
				// console.log("hey this is category --->",category);

				$.each(category?.meta?.thresholds, function(key, value) {
					$(`#${key}`).val(value);

					// if the checkbox id present make the checkbox true
					$(`#${key}_check`).prop('checked', true);

					// Enable the input field for editing
					$(`#${key}`).prop('disabled', false).val(value);
					
				  });

				  $.each(category?.meta?.waitTimeSop, function(key, value) {
					$(`[name="${key}"]`).val(value);
				  });

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
				const sopData ={};
				$(this)
					.serializeArray()
					.forEach(function ({ name, value }) {
						if (!name.endsWith("_check")) {
							const num = parseFloat(value);
							if(name.includes("Stage")){
								sopData[name] = value;
							}else{
							formData[name] = !isNaN(num) ? num : value || null;
						    }
						}
					});

				let profileId = formData.account_id;
				// console.log("profileid -->",profileId,allCategories)
				const category = allCategories?.find( category => category?.meta?.profileId == profileId)
				const cid = category?.cid
				// console.log("filter category",category);
				delete formData.account_id;
				delete formData.account_name;
				const data ={
					meta:{
						profileId,
						thresholds:formData,
						waitTimeSop:sopData
					}
					}
				
                // console.log("form and sop data -->",data);
				api
					.put(`/categories/${cid}`, data)
					.then((res) => {
						// console.log("Server Response:", res);
						alert("Threshold Saved Successfully");
					})
					.catch((err) => {
						console.error("Error submitting form.");
						alert("Failed to submit data. Please try again.");
					});
			});
		}

		// Initialize everything
		console.log("this is working");
		loadAccounts();
		bindAccountSelect();
		bindCheckboxListeners();
		bindFormSubmit();
	};

	return accountForm;
});
