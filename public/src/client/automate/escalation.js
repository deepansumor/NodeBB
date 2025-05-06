"use strict";

define("forum/automate/escalation", ["jquery", "api"], function ($, api) {
	const Escalation = {
		statuses: [{
			key: "UNRESOLVED",
			label: "UNRESOLVED"
		}, {
			key: "RESOLVED",
			label: "RESOLVED"
		}],
		category: {}
	};

	Escalation.init = function () {
		this.events();
	}

	Escalation.getStatusByLock = (locked) => locked ? 'RESOLVED' : "UNRESOLVED";
	Escalation.getLockByStatus = (status) => status == "RESOLVED";

	Escalation.renderStatuses = function (locked) {
		let status = Escalation.getStatusByLock(locked);
		let canModify = Escalation.category.privileges['topics:create'] ?? false;
		return `<select name="status" ${canModify ? '' : 'disabled="disabled"'}>
			${Escalation.statuses.map(_status => `<option value="${_status.key}" ${_status.key == status ? `selected='selected'` : ''}>${_status.label}</option>`)}
		</select>`
	}

	Escalation.events = function () {
		$('#accountFilter').on('change', async function () {
			let value = $(this).val();

			$(this).prop('disabled', true);

			try {
				let response = await api.get(`/api/category/${value}`);
				Escalation.render(response);
			} catch (error) {
				console.log(error)
			} finally {
				$(this).prop('disabled', false);
			}
		});

		$('#escalationTable').on('change', '[name="status"]', async function () {
			let isLocked = Escalation.getLockByStatus($(this).val());
			let tid = $(this).parents('.single-escalation').data('tid');
			$(this).prop('disabled', true);

			try {
				let response = await api[isLocked ? 'put' : 'del'](`/topics/${tid}/lock`);
				console.log(response);
				let index = Escalation.category.topics.findIndex(topic => topic.tid == tid);
				if(index > -1) Escalation.category.topics[index].locked = isLocked;
				else console.log("Unable to update in Cache")

			} catch (error) {
				console.log(error)
			} finally {
				$(this).prop('disabled', false);
			}
		});

		$('#escalationTable').on('click', '.view-posts', async function () {
			let $this = $(this);
			let pid = $this.data('pid');
			let $currentRow = $this.closest('tr');
			let tid = $currentRow.data('tid');

			let topic = Escalation.category.topics.find(topic => topic.tid == tid);
			if(!topic) return console.log("No Topic found with tid", tid);

			console.log(topic);

			let isLocked = topic.locked;
			// Remove any previously shown reply rows
			$('#escalationTable .reply-row').remove();

			try {
				let response = await api.get(`/posts/${pid}`, { replies: 1 });
				let replies =  [response, ...(response.replies || [])];

				// if (!replies.length) return;

				let replyHtml = `
					<tr class="reply-row">
						<td colspan="7">
							<table class="table table-sm table-bordered w-100">
								<thead><tr><th>#</th><th>Content</th><th>By</th><th>Time</th></tr></thead>
								<tbody>
									${replies.map((reply, i) => `
										<tr>
											<td>&#8595;</td>
											<td>${reply.content}</td>
											<td>${reply.user ? reply.user.displayname : "SYSTEM" }</td>
											<td>${new Date(reply.timestamp).toLocaleString()}</td>
										</tr>
									`).join('')}
									<tr class="${isLocked ? 'd-none': ''}">
										<td colspan="4">
											<div style="margin-top: 10px;">
												<textarea class="form-control reply-text" rows="3" placeholder="Write your reply..."></textarea>
												<button class="btn btn-primary btn-sm mt-2 post-reply"data-pid='${pid}' data-tid="${tid}">Post Reply</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				`;


				$currentRow.after(replyHtml);
			} catch (error) {
				console.log(error);
			}
		});


		$('#escalationTable').on('click', '.post-reply', async function () {
			let $textarea = $('.reply-text');
			let text = String($textarea.val()).trim();
			if (String(text).length < 16) {
				return alert("Content Length should be at least 16");
			}


			let tid = $(this).data('tid');
			let pid = $(this).data('pid');
			let topic = Escalation.category.topics.find(topic => topic.tid == tid);

			console.log(topic);

			if(!topic || topic.locked){
				return alert("Cant modify the topic now, it's locked");
			}

			try {
				$(this).prop('disabled', true);
				$textarea.prop('disabled', true);

				let response = await api.post(`/topics/${tid}`, { content: text, toPid:pid});
				console.log(response);
			} catch (error) {
				console.log(error)
			} finally {
				$(this).prop('disabled', !true);
				$textarea.prop('disabled', !true);
			}
		});
	}

	Escalation.render = function (response) {
		let { topics = [] } = response;
		Escalation.category = response;
		let html = topics.map((topic, index) => {
			return `<tr class="single-escalation" data-tid=${topic.tid}>
				<td>${index + 1}</td>
				<td>${topic.title || '--'}</td>
				<td>${topic.adType || '--'}</td>
				<td>${topic.cadence || '--'}</td>
				<td>${Escalation.renderStatuses(topic.locked)}</td>
				<td>${topic.summary || '--'}</td>
				<td><span class="view-posts" data-pid="${topic.mainPid}">view (${topic.postcount || '--'})</span></td>
			</tr>`
		}).join('');

		$('#escalationTable').html(html)
	}
	return Escalation;
});
