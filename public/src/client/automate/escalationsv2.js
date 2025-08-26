
"use strict";



define("forum/automate/escalationsv2", ["./dashboardv2/events","./dashboardv2/core"], (escalationsEvents,escalationsCore) => {
  const escalationsv2 = {}

  escalationsv2.init = () => {
    console.log("Escalation Dashboard initialized")
    const categories   = ajaxify.data.categories ||[];
    escalationsCore.categories = categories
    escalationsCore.categoryData = ajaxify.data.categoryData || [];
    // console.log("categorydata from the escalationv2--->", ajaxify.data.categoryData)
    escalationsEvents.initialize()
  }

  return escalationsv2
})




