
define(["api"], (api) => {
    const table = {}

    function getStatusVariant(escalations) {
        if (escalations < 40) return "success"
        if (escalations < 55) return "warning"
        return "danger"
    }
    table.renderTable = (currentData, tbody) => {

   console.log("current data from the  render table -->",currentData)

        if (currentData.length < 1) return tbody.innerHTML = `<tr><td class="text-center p-3">No Data found</td></tr>`

        tbody.innerHTML = currentData
            .map((brand) => {
                const variant = getStatusVariant(brand["totalEscalation"])

                return `
                        <tr>
                            <td class="fw-medium p-3">${brand.name}</td>
                            <td class="text-center p-3">
                            <span class="fw-semibold text-${variant}">${brand.totalEscalation}</span>
                            </td>
                            <td class="text-center text-muted small p-3">${brand.date}</td>
                            <td class="text-end p-3">
                            <button class="btn btn-sm btn-outline-primary open-detail-btn" data-date=${brand.date} data-brand="${brand["id"]}">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                            </td>
                        </tr>
                        `

            })
            .join("")
    }

    return table
})