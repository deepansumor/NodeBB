
"use strict";



define("forum/automate/escalationsv2", ["./dashboardv2/events"], (escalationsEvents) => {
  const escalationsv2 = {}

  escalationsv2.init = () => {
    console.log("Escalation Dashboard initialized")
    escalationsEvents.initialize()
  }

  return escalationsv2
})




