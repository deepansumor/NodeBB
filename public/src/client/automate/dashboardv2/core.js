
// "forum/automate/escalations-core", 

define(["api"], (api) => {
  const escalationsCore = {
    statuses: [
      { key: "UNRESOLVED", label: "UNRESOLVED" },
      { key: "RESOLVED", label: "RESOLVED" },
    ],
    category: {},
    categories: [],
    page: 1,
  }

  // Extract numeric profile ID from topic title
  escalationsCore.extractProfileId = (title = "") => {
    const match = title.match(/Profile (\d+)/)
    return match ? match[1] : "--"
  }

  // API Functions
  escalationsCore.fetchAndRender = async (data = {}) => {
    try {
      // console.log("params for the api -->", data)
      const params = new URLSearchParams(data)
      $(".loader-container").show()

      // making filter disable
      $("#brand-filter").prop('disabled', true);
      $("#stage-filter").prop('disabled', true);
      $("#portfolio-filter").prop('disabled', true);
      $("#status-filter").prop('disabled', true);
      $("#date-range-filter").prop('disabled', true);

      // const response = await api.get(`/automate/filterData?${params.toString()}`)
      const response= await api.get(`/automate/optimise-filter?${params.toString()}`)
      // console.log("response from the api in the core.js--->", response)
      escalationsCore.category = response
      $(".loader-container").hide()
      // making filter enable
       $("#brand-filter").prop('disabled', false);
      $("#stage-filter").prop('disabled', false);
      $("#portfolio-filter").prop('disabled', false);
      $("#status-filter").prop('disabled', false);
      $("#date-range-filter").prop('disabled', false);
      if (response?.result?.length < 20 && escalationsCore.page === 1) {
        $("#paginationControls").hide()
      }
      return response
    } catch (error) {
      console.error("Error fetching paginated data:", error)
      throw error
    }
  }

  // Initialize filter dropdowns
  escalationsCore.initializeFilters = async () => {
    const totalEscalations = await api.get("/automate/total-count")
    // console.log("Total escalations count:", totalEscalations)
    const data = totalEscalations[0]
    document.getElementById("unresolved-count").textContent = data.total - data.locked1 || 0
    document.getElementById("total-escalations").textContent = data.total
    document.getElementById("resolved-count").textContent = data.locked1
    return data
  }

  // Populate select dropdown
  escalationsCore.populateSelect = (selectId, pcid) => {
    const select = document.getElementById(selectId)
    select.innerHTML = "" // Clear existing options
    const optionElement = document.createElement("option")
    optionElement.value = null
    optionElement.textContent = "All Types"
    select.appendChild(optionElement)

    const categories = escalationsCore.categories;
    const category = categories.filter((cat) => cat.cid == pcid);
    // console.log("category for the portfolio --->", categories,category[0]?.meta?.portfolios,pcid)
    category[0]?.meta?.portfolios.forEach((option) => {
      const optionElement = document.createElement("option")
      optionElement.value = option.portfolioName
      optionElement.textContent = option.portfolioName
      select.appendChild(optionElement)
    })
  }

  // Get date range
  escalationsCore.getDateRange = (range) => {
    const today = new Date()
    let startDate = null
    let endDate = today
    switch (range) {
      case "today":
        startDate = new Date(today)
        break
      case "yesterday":
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 1)
        endDate = new Date(startDate)
        break
      case "last7days":
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        break
      case "last30days":
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 30)
        break
      case "last3months":
        startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 3)
        break
      default:
        return { startDate: null, endDate: null }
    }
    const format = (d) => d.toISOString().slice(0, 10) // "YYYY-MM-DD"
    return {
      startDate: format(startDate),
      endDate: format(endDate),
    }
  }

  // Parse alert summary and format it into HTML
  escalationsCore.parseSummary = (summary = "", fallback = "No alert details available.") => {
    try {
      if (typeof summary !== "string") return fallback
      // Decode \u003C → < and \u20b9 → ₹
      const decodeUnicode = (str) =>
        str.replace(/\\u([\dA-F]{4})/gi, (_, g1) => String.fromCharCode(Number.parseInt(g1, 16)))
      const decoded = decodeUnicode(summary)
      // Match JSON inside <!-- ESCALATION_DATA: {...} -->
      const jsonMatch = decoded.match(/<!--\s*ESCALATION_DATA:\s*(\{[\s\S]*?\})\s*-->/)
      if (!jsonMatch) return fallback
      const data = JSON.parse(jsonMatch[1])
      const alerts = data.alerts || {}
      const alertLines = Object.entries(alerts).map(([metric, msg]) => `- ${metric}: ${msg}`)
      return alertLines.length ? alertLines.join("<br>") : fallback
    } catch (err) {
      console.warn("Summary parsing failed:", err)
      return fallback
    }
  }

  // Mapping between lock state and status
  escalationsCore.getStatusByLock = (locked) => (locked ? "RESOLVED" : "UNRESOLVED")

  escalationsCore.getLockByStatus = (status) => status === "RESOLVED"

  // API call for portfolios
  escalationsCore.getPortfolios = async (pcid) => await api.get(`/automate/portfolios?pcid=${pcid}`)

  // API call for posts
  escalationsCore.getPosts = async (pid) => await api.get(`/posts/${pid}`, { replies: 1 })

  // API call for status change
  escalationsCore.changeTopicLockStatus = async (tid, isLocked) =>
    await api[isLocked ? "put" : "del"](`/topics/${tid}/lock`)

  // API call for posting reply
  escalationsCore.postReply = async (tid, content, toPid) =>
    
    await api.post(`/topics/${tid}`, { content: content, toPid: toPid })

  return escalationsCore
})
