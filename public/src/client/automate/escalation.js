"use strict";

define("forum/automate/escalation", ["jquery"], function ($) {
	const escalations = {};

	escalations.init = function () {
		const accountFilter = document.getElementById("accountFilter");
		const escalationTable = document.getElementById("escalationTable");

		// API Endpoints
		const API = {
			ACCOUNTS: "/get_accounts",
			ESCALATIONS: "/get_escalations",
			UPDATE_STATUS: "/update_escalation_status",
			UPDATE_REMARKS: "/update_escalation_remarks",
		};
		//dummy data
		const escalationsData = [
			{
				escalation_id: "001",
				escalation_name: "shubham",
				account_id: "123",
				status: "pending_at_am",
				file_link_url: "#",
			},
			{
				escalation_id: "002",
				escalation_name: "rahul",
				account_id: "456",
				status: "resolved",
				file_link_url: "#",
			},
		];

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

		// Load accounts
		function loadAccounts() {
			setLoadingState(accountFilter, "Loading accounts...");
			fetch(API.ACCOUNTS)
				.then((res) => res.json())
				.then((data) => populateAccounts(data))
				.catch(() => setLoadingState(accountFilter, "Error loading accounts"));
		}

		// Load escalations
		function loadEscalations() {
			setTableLoading();

			fetch(API.ESCALATIONS)
				.then((res) => res.json())
				.then((data) => renderEscalations(data))
				.catch(() =>
					// showError("Error loading escalations. Please try again later.")
					renderEscalations(escalationsData)
				);
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

		// Render escalations table
		function renderEscalations(escalationsList) {
			if (!escalationsList.length) {
				showError("No escalations found.");
				return;
			}

			escalationTable.innerHTML = "";

			escalationsList.forEach((escalation) => {
				const row = document.createElement("tr");
				row.dataset.account = escalation.account_id;
				row.innerHTML = `
					<td class="text-center">${escalation.escalation_id}</td>
					<td class="text-center">${escalation.escalation_name}</td>
					<td class="text-center">${escalation.account_id}</td>
					<td class="text-center">
						<select class="status-dropdown form-select px-3 py-1 rounded border-2" data-escalation="${
							escalation.escalation_id
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
							escalation.escalation_id
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

		// Render status options
		function renderStatusOptions(selectedStatus) {
			const options = [
				{ value: "resolved", label: "Resolved" },
				{ value: "mail_sent_to_am", label: "Mail Sent to AM" },
				{ value: "pending_at_am", label: "Pending at AM" },
			];

			return options
				.map((opt) => {
					const selected = opt.value === selectedStatus ? "selected" : "";
					return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
				})
				.join("");
		}

		// Bind change event to status dropdown
		function bindStatusListeners() {
			document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
				dropdown.addEventListener("change", function () {
					const originalValue = this.value;
					this.disabled = true;
					this.classList.add("opacity-50");

					fetch(API.UPDATE_STATUS, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							escalation_id: this.dataset.escalation,
							status: this.value,
						}),
					})
						.then((res) => res.json())
						.then(() => {
							showFeedback(this, "Status updated", "text-green-500");
							setTimeout(() => location.reload(), 500);
						})
						.catch(() => {
							this.value = originalValue;
							showFeedback(this, "Failed to update", "text-red-500");
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

					fetch(API.UPDATE_REMARKS, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							escalation_id: escalationId,
							remarks: remarks,
						}),
					})
						.then((res) => res.json())
						.then(() => showFeedback(this, "Remarks updated", "text-green-500"))
						.catch(() =>
							showFeedback(this, "Failed to update remarks", "text-red-500")
						);
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
		loadAccounts();
		loadEscalations();
	};

	// Make sure it runs after page is ready
	$(document).ready(function () {
		escalations.init();
	});

	return escalations;
});
