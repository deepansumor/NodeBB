
// "forum/automate/escalations-ui",

define( ["./core"], (escalationsCore) =>{
  const escalationsUI = {}
  let selectedEscalation = null

  //render status function
  escalationsUI.renderStatuses = (locked, tid) => {
    const currentStatus = escalationsCore.getStatusByLock(locked)
    // change the code for previllageous
    const topic = escalationsCore.category.result.find((topic) => topic.tid === tid)
    const canModify =
      topic.privileges.length > 0 ? topic.privileges.some((obj) => obj._key.includes("topics:create")) : false
    return `<select name="status" class="status-badge ${currentStatus === "RESOLVED" ? "badge-resolved" : "badge-unresolved"}" data-tid="${tid}" ${canModify ? "" : "disabled"}>
            ${escalationsCore.statuses
              .map(
                (s) => `                <option value="${s.key}" class="" ${s.key === currentStatus ? "selected" : ""}>
                    ${s.label}
                </option>`,
              )
              .join("")}
        </select>`
  }

  // Render table
  escalationsUI.renderTable = (response) => {
    escalationsCore.category = response
    const { result = [] } = response
    const topics = result
    console.log("the response of the topics -->", topics)
    const rows = topics
      .map((topic, index) => {
        const profileId = escalationsCore.extractProfileId(topic.title)
        const alertDetails = escalationsCore.parseSummary(topic.summary)
        const stage = topic.stage
        const name = topic.subcategory.name.replace(/Stage\d+/, "").trim()
        const postTime = topic.timestampISO ? new Date(topic.timestampISO).toLocaleString() : "--"
        return `                <tr class="single-escalation" data-tid="${topic.tid}">
                    <td>${name}</td>
                    <td><span class="stage-badge ${escalationsUI.getStageBadgeClass(stage)}">${stage}</span></td>
                    <td>${topic.portfolioName || topic.adType || "--"}</td>
                    <td>${alertDetails}</td>
                    <td style="white-space:nowrap">${topic.escalationDate || "--"}</td>
                    <td data-tid="${topic.tid}"><span>${escalationsUI.renderStatuses(topic.locked, topic.tid)}</span></td>
                    <td>
                        <span class="view-posts cursor-pointer" data-tid="${topic.tid}" data-pid="${topic.mainPid}">
                            view
                        </span>
                    </td>
                </tr>`
      })
      .join("")
    $("#escalations-table-body").html(rows)
    escalationsUI.renderPagination()
  }

  // Render pagination
  escalationsUI.renderPagination = () => {
    const paginationContainer = $("#paginationControls")
    paginationContainer.empty()
    const prevBtn = $("<button>")
      .text("< Previous")
      .addClass("btn btn-sm")
      .attr("id", "prevPage")
      .css({
        margin: "0 10px",
        padding: "8px 5px",
        "background-color": "#2fa4e7",
        width: "100px",
        border: "none",
        color: "white",
      })
      .prop("disabled", escalationsCore.page <= 1)
    const nextBtn = $("<button>")
      .text("Next >")
      .addClass("btn btn-sm")
      .attr("id", "nextPage")
      .css({
        margin: "0 10px",
        padding: "8px 5px",
        "background-color": "#2fa4e7",
        width: "100px",
        border: "none",
        color: "white",
      })
      .prop("disabled", escalationsCore.category?.result?.length < 20)
    const pageText = $("<span>").attr("id", "currentPage").text(`Page: ${escalationsCore.page}`)
    if (escalationsCore.page === 1 && escalationsCore.category?.result?.length < 20) {
      paginationContainer.hide()
    } else {
      paginationContainer.show()
      paginationContainer.append(prevBtn, pageText, nextBtn)
    }
  }

  // Get stage badge class
  escalationsUI.getStageBadgeClass = (stage) => {
    switch (stage) {
      case "stage1":
        return "stage-stage1"
      case "stage2":
        return "stage-stage2"
      case "stage3":
        return "stage-stage3"
      default:
        return "bg-primary text-white"
    }
  }

  // Get status badge class
  escalationsUI.getStatusBadgeClass = (status) => (status === 1 ? "badge-resolved" : "badge-unresolved")

  // Show detail panel
  escalationsUI.showDetailPanel = (escalation, replies) => {
    selectedEscalation = escalation
    const stage = selectedEscalation.stage

    console.log("Showing detail panel for topic:", escalation.tid)

    // Update panel content
    document.getElementById("detail-panel-id").textContent = `ID: ESC-${escalation.tid}`
    document.getElementById("detail-summary").textContent = escalationsCore.parseSummary(escalation.summary)
    document.getElementById("detail-brand").textContent = escalation.subcategory.name.replace(/Stage\d+/, "").trim()
    document.getElementById("detail-stage").innerHTML =
      `<span class="stage-badge ${escalationsUI.getStageBadgeClass(stage)}">${stage}</span>`
    document.getElementById("detail-portfolio").textContent = escalation.portfolioName || escalation.adType
    document.getElementById("detail-date").textContent = new Date(escalation.escalationDate).toISOString().split("T")[0]
    document.getElementById("detail-status").innerHTML =
      `<span class="status-badge ${escalationsUI.getStatusBadgeClass(escalation.locked)}">${escalationsCore.getStatusByLock(escalation.locked)}</span>`

    // Update timeline
    escalationsUI.updateTimeline(replies)

    // Show panel
    document.getElementById("detail-panel").classList.add("show")
    document.getElementById("main-content").classList.add("panel-open")

    const lock = escalationsCore.getStatusByLock(escalation.locked)
    const isLocked = escalationsCore.getLockByStatus(lock)
    $(".addReplies")[isLocked ? "addClass" : "removeClass"]("d-none")
  }

  // Close detail panel
  escalationsUI.closeDetailPanel = () => {
    console.log("Closing detail panel")
    selectedEscalation = null
    document.getElementById("detail-panel").classList.remove("show")
    document.getElementById("main-content").classList.remove("panel-open")

    // Clear form data when closing panel
    $("#remark-textarea").val("")
    $("#escalation-reason").val("")
    $("#custom-reason").hide().val("")
  }

  // Update timeline
  escalationsUI.updateTimeline = (replies) => {
    const timeline = document.getElementById("detail-timeline")
    timeline.innerHTML = replies
      .map((item, i) => {
        if (i === 0) return ""
        return `        <div class="timeline-item">
            <i class="timeline-icon bi-chat-square text-primary"></i>
            <div class="timeline-content">
                <div class="timeline-title">${item.content}</div>
                <div class="timeline-meta">${new Date(item.timestampISO).toISOString().split("T")[0]} by ${item.user.username}</div>
            </div>
        </div>`
      })
      .join("")
  }

  return escalationsUI
})