"use strict";

define("forum/automate/escalation", ["jquery", "api"], function ($, api) {
	const Escalation = {
		statuses: [
			{ key: "UNRESOLVED", label: "UNRESOLVED" },
			{ key: "RESOLVED", label: "RESOLVED" }
		],
		category: {}
	};

	// Extract numeric profile ID from topic title
	const extractProfileId = (title = '') => {
		const match = title.match(/Profile (\d+)/);
		return match ? match[1] : '--';
	};

	// Parse alert summary and format it into HTML
	const parseSummary = (summary = '', fallback = 'No alert details available.') => {
		const lines = summary.split('\n').map(line => line.trim());
		const details = lines.filter(line => line.startsWith('-'));
		return details.length ? details.join('<br>') : fallback;
	};

	// Initialize escalation module
	Escalation.init = function () {
		this.events();

		const categoriesWithTopics = ajaxify.data.categories.filter(cat =>
			cat.children.some(sub => sub.topic_count > 0)
		);

		const subcategories = (categoriesWithTopics[0]?.children || [])
			.filter(sub => sub.topic_count > 0);

		const defaultSlug = subcategories[0]?.slug;
		if (defaultSlug) {
			$('#accountFilter').val(defaultSlug).trigger('change');
		}
	};

	// Mapping between lock state and status
	Escalation.getStatusByLock = locked => locked ? 'RESOLVED' : 'UNRESOLVED';
	Escalation.getLockByStatus = status => status === 'RESOLVED';

	// Render status dropdown for each row
	Escalation.renderStatuses = function (locked) {
		const currentStatus = Escalation.getStatusByLock(locked);
		const canModify = Escalation.category.privileges?.['topics:create'] ?? false;

		return `<select name="status" ${canModify ? '' : 'disabled'}>
			${Escalation.statuses.map(s => `
				<option value="${s.key}" ${s.key === currentStatus ? 'selected' : ''}>
					${s.label}
				</option>`).join('')}
		</select>`;
	};

	// Register event handlers
	Escalation.events = function () {
		// Category change (filter)
		$('#accountFilter').on('change', async function () {
			const value = $(this).val();
			$(this).prop('disabled', true);

			try {
				const response = await api.get(`/api/category/${value}`);
				Escalation.render(response);
			} catch (error) {
				console.error("Failed to fetch category:", error);
			} finally {
				$(this).prop('disabled', false);
			}
		});

		// Status change
		$('#escalationTable').on('change', '[name="status"]', async function () {
			const $select = $(this);
			const isLocked = Escalation.getLockByStatus($select.val());
			const $row = $select.closest('.single-escalation');
			const tid = $row.data('tid');

			$select.prop('disabled', true);

			try {
				await api[isLocked ? 'put' : 'del'](`/topics/${tid}/lock`);

				const topic = Escalation.category.topics.find(t => t.tid === tid);
				if (topic) {
					topic.locked = isLocked;
				} else {
					console.warn("Topic not found in cache");
				}

				$('.reply-textarea-row')[isLocked ? 'addClass' : 'removeClass']('d-none');
			} catch (error) {
				console.error("Failed to change lock status:", error);
				alert(error.message || "Something went wrong! Please try again.");
				$(this).val(Escalation.getStatusByLock(!isLocked));
			} finally {
				$select.prop('disabled', false);
			}
		});

		let fetchingPosts = false;
		// View topic replies
		$('#escalationTable').on('click', '.view-posts', async function () {
			const $this = $(this);
			const pid = $this.data('pid');
			const $row = $this.closest('tr');
			const tid = $row.data('tid');
			if (fetchingPosts) return alert("Please wait while we fetch remarks");

			const topic = Escalation.category.topics.find(t => t.tid === tid);
			if (!topic) return console.warn("No topic found with TID", tid);

			const isLocked = topic.locked;
			$('#escalationTable .reply-row').remove(); // Remove any open reply rows

			try {
				fetchingPosts = true;

				const response = await api.get(`/posts/${pid}`, { replies: 1 });
				const replies = [response, ...((response.replies || []).reverse())];

				const replyHtml = `
					<tr class="reply-row">
						<td colspan="7">
							<table class="table table-sm table-bordered w-100">
								<thead>
									<tr>
										<th>#</th><th>Content</th><th>By</th><th>Time</th>
									</tr>
								</thead>
								<tbody>
									${replies.map(reply => `
									<tr>
										<td>&#8595;</td>
										<td>${parseSummary(reply.content, reply.content)}</td>
										<td>${reply.user?.displayname || "SYSTEM"}</td>
										<td>${new Date(reply.timestamp).toLocaleString()}</td>
									</tr>`).join('')}
									<tr class="reply-textarea-row ${isLocked ? 'd-none' : ''}">
										<td colspan="4">
											<div style="margin-top: 10px;">
												<textarea class="form-control reply-text" rows="3" placeholder="Write your remark..."></textarea>
												<button class="btn btn-primary float-end btn-sm mt-2 post-reply" data-pid="${pid}" data-tid="${tid}">Post Reply</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>`;

				$row.after(replyHtml);
			} catch (error) {
				console.error("Error loading replies:", error);
			} finally {
				fetchingPosts = !true;

			}
		});

		// Post a reply to a topic
		$('#escalationTable').on('click', '.post-reply', async function () {
			const $btn = $(this);
			const $textarea = $('.reply-text');
			const text = String($textarea.val()).trim();

			if (text.length < (config.minimumPostLength || 0)) {
				return alert(`Content must be at least ${config.minimumPostLength} characters long.`);
			}

			const tid = $btn.data('tid');
			const pid = $btn.data('pid');
			const topic = Escalation.category.topics.find(t => t.tid === tid);

			if (!topic || topic.locked) {
				return alert("Cannot reply: topic is locked.");
			}

			try {
				$btn.prop('disabled', true);
				$textarea.prop('disabled', true);

				await api.post(`/topics/${tid}`, { content: text, toPid: pid });

				// Refresh reply view after posting
				$(`.view-posts[data-pid="${pid}"]`).click();
			} catch (error) {
				console.error("Reply post failed:", error);
				alert(error.message || "Something went wrong! Please try again.");
			} finally {
				$btn.prop('disabled', false);
				$textarea.prop('disabled', false);
			}
		});
	};

	// Render topics table
	Escalation.render = function (response) {
		Escalation.category = response;
		const { topics = [] } = response;

		const rows = topics.map((topic, index) => {
			const profileId = extractProfileId(topic.title);
			const alertDetails = parseSummary(topic.summary);
			const postTime = topic.timestampISO
				? new Date(topic.timestampISO).toLocaleString()
				: '--';

			return `
				<tr class="single-escalation" data-tid="${topic.tid}">
					<td>${index + 1}</td>
					<td>${topic.adType || '--'}</td>
					<td>${topic.cadence || '--'}</td>
					<td>${topic.escalationDate || '--'}</td>
					<td>${Escalation.renderStatuses(topic.locked)}</td>
					<td>${alertDetails}</td>
					<td>
						<span class="view-posts cursor-pointer" data-pid="${topic.mainPid}">
							view
						</span>
					</td>
				</tr>`;
		}).join('');

		$('#escalationTable').html(rows);
	};

	return Escalation;
});