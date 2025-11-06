
define(["api"], (api) => {
  const modal = {}

  modal.rendarModal=(brand,data)=>{
            
            if (!brand) return

            const resolvedEscalations = data?.escalation

            const modalTitle = document.getElementById("modalTitle")
            const modalBody = document.getElementById("modalBody")

            modalTitle.textContent = brand["name"]

            modalBody.innerHTML = `
    <!-- Performance Summary -->
    <div class="alert alert-warning mb-4">
      <h6 class="alert-heading">
        <i class="fas fa-triangle-exclamation"></i> Performance Analysis
      </h6>
      <p class="mb-0">${resolvedEscalations?.overview}</p>
    </div>

    <!-- Recommended Actions -->
    <div class="alert alert-info mb-4">
      <h6 class="alert-heading">
        <i class="fas fa-lightbulb"></i> Recommended Actions
      </h6>
      <ul class="mb-0">
        ${ resolvedEscalations?.recommendations?.map((data)=>(`
          <li>${data}</li>`
          )).join("")

      }
      </ul>
    </div>

    <!-- Resolved Escalations -->
    <div class="alert alert-success mb-0">
      <h6 class="alert-heading">
        <i class="fas fa-check-circle"></i> Resolved Escalations (Last 3 Days)
      </h6>
      <div class="mt-3">
        
          <div class="mb-3 pb-3 border-bottom">
            <div class="d-flex gap-3">
             
              <div>
                <p class="small mb-0">${data?.remark?.overview || "No Data Found"}</p>
              </div>
            </div>
          </div>
      
      </div>
    </div>
  `

            const bootstrap = window.bootstrap // Declare the bootstrap variable
            const modal = new bootstrap.Modal(document.getElementById("detailModal"))
            modal.show()
        }



  return modal
})
