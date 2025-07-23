

// "forum/automate/escalations-events",
define( [
  "./core",
  "./ui",
  "ajaxify",
], (escalationsCore, escalationsUI, ajaxify) => {
  const escalationsEvents = {}
  let fetchingPosts = false

  // Store current active topic context
  let currentTopicContext = {
    tid: null,
    pid: null,
    topic: null,
  }

  // Define fallback config if NodeBB config is not available
  const config = window.config || {
    minimumPostLength: 1,
    maximumPostLength: 32767,
    relative_path: "",
    uid: 0,
  }

  // Function to get user ID with multiple fallbacks
  const getUserId = () => {
    try {
      // Try multiple ways to get the user ID
      let userId = null

      // Method 1: ajaxify.data.loggedInUser.uid
      if (ajaxify && ajaxify.data && ajaxify.data.loggedInUser && ajaxify.data.loggedInUser.uid) {
        userId = ajaxify.data.loggedInUser.uid
        console.log("User ID from ajaxify.data.loggedInUser.uid:", userId)
        return userId
      }

      // Method 2: window.app.user.uid
      if (window.app && window.app.user && window.app.user.uid) {
        userId = window.app.user.uid
        console.log("User ID from window.app.user.uid:", userId)
        return userId
      }

      // Method 3: config.uid
      if (config && config.uid) {
        userId = config.uid
        console.log("User ID from config.uid:", userId)
        return userId
      }

      // Method 4: window.config.uid
      if (window.config && window.config.uid) {
        userId = window.config.uid
        console.log("User ID from window.config.uid:", userId)
        return userId
      }

      // Method 5: Check if user data is in ajaxify but in different structure
      if (ajaxify && ajaxify.data && ajaxify.data.uid) {
        userId = ajaxify.data.uid
        console.log("User ID from ajaxify.data.uid:", userId)
        return userId
      }

      // Method 6: Try to get from DOM elements (some NodeBB themes store it)
      const userElement = document.querySelector("[data-uid]")
      if (userElement) {
        userId = userElement.getAttribute("data-uid")
        console.log("User ID from DOM element:", userId)
        return userId
      }

      // Method 7: Try to get from meta tags
      const metaUid = document.querySelector('meta[name="uid"]')
      if (metaUid) {
        userId = metaUid.getAttribute("content")
        console.log("User ID from meta tag:", userId)
        return userId
      }

      console.warn("Could not find user ID using any method")
      return null
    } catch (error) {
      console.error("Error getting user ID:", error)
      return null
    }
  }

  escalationsEvents.init = () => {
    console.log("Escalation Dashboard initialized")

    // Debug: Log available objects
    console.log("Available objects:")
    console.log("- ajaxify:", ajaxify)
    console.log("- ajaxify.data:", ajaxify?.data)
    console.log("- ajaxify.data.loggedInUser:", ajaxify?.data?.loggedInUser)
    console.log("- window.app:", window.app)
    console.log("- window.config:", window.config)
    console.log("- config:", config)

    const userId = getUserId()
    console.log("Final user ID:", userId)

    escalationsEvents.initializeFilters()
  }

  escalationsEvents.initializeFilters = async () => {
    const data = await escalationsCore.initializeFilters()
    escalationsEvents.applyFilters()
  }

  // Apply filters
  escalationsEvents.applyFilters = (page = 1) => {
    console.log("Applying filters...")
    const brandFilter = document.getElementById("brand-filter").value
    const stageFilter = document.getElementById("stage-filter").value
    const portfolioFilter = document.getElementById("portfolio-filter").value
    const statusFilter = document.getElementById("status-filter").value
    const dateRangeFilter = document.getElementById("date-range-filter").value
    const date = escalationsCore.getDateRange(dateRangeFilter)

    // Use the getUserId function instead of direct access
    const user = getUserId()
    console.log("user id -->", user)

    if (!user) {
      console.warn("No user ID found, some features may not work properly")
      // You might want to show an alert or handle this case
      // alert("User session not found. Please refresh the page and try again.")
      // return
    }

    const params = {}
    params.stage = stageFilter ? stageFilter : null
    params.locked = statusFilter ? statusFilter : null
    params.endDate = date.endDate
    params.startDate = date.startDate
    params.pcid = brandFilter ? brandFilter : null
    params.privilegeValue = user || 0 // Use 0 as fallback
    params.page = escalationsCore.page
    if (brandFilter) {
      params.portfolioName = portfolioFilter ? portfolioFilter : null
    }
    escalationsEvents.fetchAndRender(params)
  }

  escalationsEvents.fetchAndRender = async (data = {}) => {
    try {
      const response = await escalationsCore.fetchAndRender(data)
      escalationsUI.renderTable(response)
      console.log("Fetched data:", response)
    } catch (error) {
      console.error("Error fetching paginated data:", error)
    }
  }

  // Clear all filters
  escalationsEvents.clearFilters = () => {
    document.getElementById("brand-filter").value = ""
    document.getElementById("stage-filter").value = ""
    document.getElementById("portfolio-filter").value = ""
    document.getElementById("status-filter").value = ""
    document.getElementById("date-range-filter").value = "last30days"
  }

  // Clear current topic context
  escalationsEvents.clearTopicContext = () => {
    currentTopicContext = {
      tid: null,
      pid: null,
      topic: null,
    }
    console.log("Topic context cleared")
  }

  // Set current topic context
  escalationsEvents.setTopicContext = (tid, pid, topic) => {
    currentTopicContext = {
      tid: tid,
      pid: pid,
      topic: topic,
    }
    console.log("Topic context set:", currentTopicContext)
  }

  // Setup event listeners
  escalationsEvents.setupEventListeners = () => {
    // Setup event listeners brand
    document.getElementById("brand-filter").addEventListener("change", async () => {
      escalationsCore.page = 1
      const pcid = document.getElementById("brand-filter").value
      const portofolios = await escalationsCore.getPortfolios(pcid)
      escalationsCore.populateSelect("portfolio-filter", portofolios)
      console.log("Portfolios for brand:", portofolios)
      escalationsEvents.applyFilters(1)
    })

    document.getElementById("status-filter").addEventListener("change", () => {
      escalationsCore.page = 1
      escalationsEvents.applyFilters(1)
    })

    document.getElementById("date-range-filter").addEventListener("change", () => {
      escalationsCore.page = 1
      escalationsEvents.applyFilters(1)
    })

    document.getElementById("portfolio-filter").addEventListener("change", () => {
      escalationsCore.page = 1
      escalationsEvents.applyFilters()
    })

    $("#stage-filter").on("change", () => {
      escalationsCore.page = 1
      escalationsEvents.applyFilters(1)
    })

    $("#clear-filters").on("click", escalationsEvents.clearFilters)

    // Status change
    $("#escalations-table-body").on("change", '[name="status"]', async function () {
      const $select = $(this)
      const isLocked = escalationsCore.getLockByStatus($select.val())
      const tid = $select.data("tid")
      $select.prop("disabled", true)
      try {
        await escalationsCore.changeTopicLockStatus(tid, isLocked)
        const topic = escalationsCore.category.result.find((t) => t.tid === tid)
        if (topic) {
          topic.locked = isLocked
        } else {
          console.warn("Topic not found in cache")
        }
        $(".addReplies")[isLocked ? "addClass" : "removeClass"]("d-none")
      } catch (error) {
        console.error("Failed to change lock status:", error)
        alert(error.message || "Something went wrong! Please try again.")
        $(this).val(escalationsCore.getStatusByLock(!isLocked))
      } finally {
        $select.prop("disabled", false)
      }
    })

    // pagination controls
    $("#paginationControls").on("click", "#prevPage", async () => {
      if (escalationsCore.page > 1) {
        escalationsCore.page--
        escalationsEvents.applyFilters(escalationsCore.page)
      }
    })

    $("#paginationControls").on("click", "#nextPage", async () => {
      escalationsCore.page++
      escalationsEvents.applyFilters(escalationsCore.page)
    })

    // view posts
    $("#escalations-table-body").on("click", ".view-posts", async function () {
      const $this = $(this)
      const pid = $this.data("pid")
      const tid = $this.data("tid")
      console.log("Viewing topic - tid:", tid, "pid:", pid)

      if (fetchingPosts) return alert("Please wait while we fetch remarks")

      const topic = escalationsCore.category.result.find((t) => t.tid === tid)
      if (!topic) return console.warn("No topic found with TID", tid)

      try {
        fetchingPosts = true
        const response = await escalationsCore.getPosts(pid)
        const replies = [response, ...(response.replies || []).reverse()]

        // Set the current topic context BEFORE showing the panel
        escalationsEvents.setTopicContext(tid, pid, topic)

        // show detail panel
        escalationsUI.showDetailPanel(topic, replies)

        // Clear any cached form data
        $("#remark-textarea").val("")
        $("#escalation-reason").val("")
        $("#custom-reason").hide().val("")
      } catch (error) {
        console.error("Error loading replies:", error)
      } finally {
        fetchingPosts = false
      }
    })

    // Post a reply to a topic - REMOVE data attributes dependency
    $(document).on("click", ".post-reply", async function () {
      const $btn = $(this)
      const $textarea = $("#remark-textarea")
      const text = String($textarea.val()).trim()

      // Use fallback minimum length if config is not available
      const minimumLength = config.minimumPostLength || 1
      if (text.length < minimumLength) {
        return alert(`Content must be at least ${minimumLength} characters long.`)
      }

      // Use context instead of data attributes
      const tid = currentTopicContext.tid
      const pid = currentTopicContext.pid
      const topic = currentTopicContext.topic

      if (!tid || !pid || !topic) {
        return alert("Please select a topic first before replying.")
      }

      console.log("Posting reply to - tid:", tid, "pid:", pid, "text:", text)

      if (topic.locked) {
        return alert("Cannot reply: topic is locked.")
      }

      try {
        $btn.prop("disabled", true)
        $textarea.prop("disabled", true)
        await escalationsCore.postReply(tid, text, pid)

        // Refresh reply view after posting
        $(`.view-posts[data-tid="${tid}"][data-pid="${pid}"]`).click()

        // clear the textarea
        $("#remark-textarea").val("")
      } catch (error) {
        console.error("Reply post failed:", error)
        alert(error.message || "Something went wrong! Please try again.")
      } finally {
        $btn.prop("disabled", false)
        $textarea.prop("disabled", false)
      }
    })

    // adding custome other reason
    $("#escalation-reason").on("change", function () {
      const selected = $(this).val()
      if (selected === "other") {
        $("#custom-reason").show()
      } else {
        $("#custom-reason").hide()
      }
    })

    // adding reason for escalation - REMOVE data attributes dependency
    $(document).on("click", ".post-reason", async function () {
      const $btn = $(this)
      let reasonVal = $("#escalation-reason").val()
      const $textarea = $("#custom-reason")

      if (!reasonVal) {
        return alert("Please select a valid reason")
      }

      if (reasonVal === "other") {
        const custom = $textarea.val().trim()
        if (!custom) {
          return alert("Please enter a reason")
        }
        reasonVal = custom
      }

      const text = `*Reason:* ` + reasonVal

      // Use context instead of data attributes
      const tid = currentTopicContext.tid
      const pid = currentTopicContext.pid
      const topic = currentTopicContext.topic

      if (!tid || !pid || !topic) {
        return alert("Please select a topic first before adding a reason.")
      }

      console.log("Posting reason to - tid:", tid, "pid:", pid, "reason:", reasonVal)

      if (topic.locked) {
        return alert("Cannot reply: topic is locked.")
      }

      try {
        $btn.prop("disabled", true)
        $textarea.prop("disabled", true)
        await escalationsCore.postReply(tid, text, pid)

        // Refresh reply view after posting
        $(`.view-posts[data-tid="${tid}"][data-pid="${pid}"]`).click()

        $("#custom-reason").val("")
        $("#escalation-reason").val("")
      } catch (error) {
        console.error("Reply post failed:", error)
        alert(error.message || "Something went wrong! Please try again.")
      } finally {
        $btn.prop("disabled", false)
        $textarea.prop("disabled", false)
      }
    })

    // Close detail panel
    $("#close-detail-panel").on("click", () => {
      escalationsUI.closeDetailPanel()
      escalationsEvents.clearTopicContext() // Clear context when closing
    })
  }

  // Initialize everything
  escalationsEvents.initialize = () => {
    escalationsEvents.init()
    escalationsEvents.setupEventListeners()
    console.log("Escalations events initialized")
  }

  return escalationsEvents
})
