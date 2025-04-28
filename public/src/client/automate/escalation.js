"use strict";

define("forum/automate/escalation", ["jquery", "api"], function ($, api) {
	const escalations = {};

	escalations.init = function () {
		const accountFilter = document.getElementById("accountFilter");
		const escalationTable = document.getElementById("escalationTable");
		let escalationsData;

		// API Endpoints
		const API = {
			ESCALATIONS: "/automate/get-escalations",
			GET_ACCOUNTS: "/api/v3/automate/get-accounts",
			UPDATE_ESCALATIONS: "/automate/update-escalations",
		};

		// Helper: Set loading state for dropdown
		function setLoadingState(selectElement, message) {
			selectElement.innerHTML = `<option value="">${message}</option>`;
		}

		// Helper: Populate accounts into dropdown
		function populateAccounts(accounts) {
			accountFilter.innerHTML = `<option value="all">All Accounts</option>`;
			accounts.forEach((account) => {
				const option = new Option(account.account_name, account.account_id);
				accountFilter.appendChild(option);
			});
		}

		// Load escalations from API
		function loadEscalations() {
			setTableLoading();
			console.log("Loading escalations...");
			api
				.get(API.ESCALATIONS)
				.then((data) => {
					escalationsData = data;
					renderEscalations(data);
				})
				.catch((err) => {
					console.error("Error loading escalations:", err);
					showError("Error loading data from the server.");
				});
		}

		// Table loading state
		function setTableLoading() {
			escalationTable.innerHTML = `
        <tr><td colspan="6" class="text-center py-4 text-gray-500">Loading...</td></tr>
      `;
		}

		// Show error in table
		function showError(message) {
			escalationTable.innerHTML = `
        <tr><td colspan="6" class="text-center py-4 text-red-500">${message}</td></tr>
      `;
		}
		// Render the static options (fixed status options)
		function renderStatusOptions(currentStatus) {
			const statusOptions = [
				"resolved",
				"unresolved",
				"in-progress",
				"pending",
			]; // Static options
			return statusOptions
				.map((status) => {
					const isSelected = status === currentStatus ? "selected" : ""; // Mark current status as selected
					return `<option value="${status}" ${isSelected}>${status}</option>`;
				})
				.join("");
		}

		// Render escalations table
		function renderEscalations(escalationsList) {
			if (!escalationsList.length) {
				showError("No escalations found.");
				return;
			}

			escalationTable.innerHTML = "";
			escalationsList.forEach((escalation) => {
				// console.log("escalation data", escalationsData);
				// console.log("id:", escalation._id);

				const row = document.createElement("tr");
				row.dataset.account = escalation._id;

				row.innerHTML = `
      <td class="text-center">${escalation._id}</td>
      <td class="text-center">${escalation.name}</td>
      <td class="text-center">12345</td>
      <td class="text-center">
        <select class="status-dropdown form-select px-3 py-1 rounded border-2" data-escalation-id="${
					escalation._id
				}">
         ${renderStatusOptions(escalation.status)}
        </select>
      </td>
      <td class="text-center">
        <a href="${
					escalation.file_link_url
				}" class="text-primary hover:underline" target="_blank">View File</a>
      </td>
      <td class="text-center">
        <textarea class="remarks-input form-control w-full p-2 mb-2" rows="2"></textarea>
        <button class="update-remarks-btn btn btn-primary btn-sm mt-1" data-escalation="${
					escalation._id
				}">
          Send
        </button>
      </td>
    `;

				escalationTable.appendChild(row);
			});

			bindStatusListeners();
			bindRemarksListeners();
		}

		// Render status options based on an array of status values
		// function renderStatusOptions(statusArray, selectedStatus) {
		// 	if (!Array.isArray(statusArray) || !statusArray.length) {
		// 		return "<option>No status available</option>";
		// 	}

		// 	return statusArray
		// 		.map((status) => {
		// 			const isSelected = status === selectedStatus ? "selected" : "";
		// 			return `<option value="${status}" ${isSelected}>${status}</option>`;
		// 		})
		// 		.join("");
		// }

		// Bind change event to status dropdown
		function bindStatusListeners() {
			document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
				dropdown.addEventListener("change", function () {
					const selectedStatus = this.value; // the new status

					const escalationId = this.getAttribute("data-escalation-id"); // escalation key
					console.log("this is escalation Id", escalationId);

					//send the updated status to the backend
					api
						.post(API.UPDATE_ESCALATIONS, {
							_id: escalationId,
							status: selectedStatus,
						})
						.then(() => {
							console.log("Status updated for escalation:", escalationId);
							showFeedback(this, "Status updated", "text-green-500");
							setTimeout(() => location.reload(), 500);
						})
						.catch((err) => {
							console.error("Failed to update status:", err);

							showFeedback(this, "Failed to update", "text-red-500");
							this.value = selectedStatus;
						})
						.finally(() => {
							this.disabled = false;
							this.classList.remove("opacity-50");
						});
				});
			});
		}

		// Bind click event to remarks button
		function bindRemarksListeners() {
			document.querySelectorAll(".update-remarks-btn").forEach((button) => {
				button.addEventListener("click", function () {
					const escalationId = this.dataset.escalation;
					const remarksInput =
						this.closest("td").querySelector(".remarks-input");
					const remarks = remarksInput.value.trim();

					if (!remarks) {
						showFeedback(this, "Remarks cannot be empty", "text-red-500");
						return;
					}

					console.log("Updating remarks for escalation:", escalationId);

					api
						.post(API.UPDATE_ESCALATIONS, {
							_id: escalationId,
							remarks: remarks,
						})
						.then(() => {
							console.log("Remarks updated for escalation:", escalationId);
							showFeedback(this, "Remarks updated", "text-green-500");
						})
						.catch((err) => {
							console.error("Failed to update remarks:", err);
							showFeedback(this, "Failed to update remarks", "text-red-500");
						});
				});
			});
		}

		// Show feedback message
		function showFeedback(element, message, className) {
			const feedback = document.createElement("div");
			feedback.className = `${className} text-xs mt-1`;
			feedback.textContent = message;
			element.parentNode.appendChild(feedback);
			setTimeout(() => feedback.remove(), 2000);
		}

		// Filter the escalations by selected account
		accountFilter.addEventListener("change", function () {
			const selected = this.value;
			document.querySelectorAll("#escalationTable tr").forEach((row) => {
				row.style.display =
					selected === "all" || row.dataset.account === selected ? "" : "none";
			});
		});

		// Initialize
		loadEscalations();
	};

	// Make sure it runs after page is ready
	$(document).ready(function () {
		escalations.init();
	});

	return escalations;
});
