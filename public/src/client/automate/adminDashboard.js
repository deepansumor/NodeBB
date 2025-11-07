"use strict";


define("forum/automate/adminDashboard", ["./adminDashboard/detailModal", "api", "./adminDashboard/chart", "./adminDashboard/renderTable"], (modal, api, chart, table) => {
    const dashboard = {}

    dashboard.init = () => {

        // Global state
        let currentData = []
        let currentSort = "escalations-desc"

        // Get canvas contexts // Render charts
        const barCtx = document.getElementById("pieChart");
        const pieCtx = document.getElementById("barChart");

        // table 
        const tbody = document.getElementById("tableBody")
        // Initialize app

        renderKPICards()
        attachEventListeners()
        renderChartsandTable()

        // Render charts and table

        async function renderChartsandTable() {
            currentData = await api.get("/automate/brand-escalations")
            currentData = sortData(currentSort)
            chart.renderCharts(barCtx, pieCtx, currentData);
            table.renderTable(currentData, tbody)

            const data = currentData.sort((a, b) => b["totalEscalation"] - a["totalEscalation"])
            const highestEscalationBrand = document.getElementById("highestEscalationBrand")
            const highestEscalation = document.getElementById("highestEscalation")

            highestEscalationBrand.innerText = data[0].name
            highestEscalation.innerText = data[0].totalEscalation


        }

        // Render KPI Cards
        async function renderKPICards() {


            const allCategories = ajaxify.data.categories
            const brands = document.getElementById("totalBrand");
            const totalEsc = document.getElementById("totalEscalation")
            const totalResolved = document.getElementById("totalResolvedEscalation")

            brands.innerHTML = allCategories.length

            const totalEscalations = await api.get("/automate/total-count")
            totalEsc.innerHTML = totalEscalations[0].total;
            totalResolved.innerHTML = totalEscalations[0].locked1;

        }

        // Sort data
        function sortData(sortBy) {
            const sorted = [...currentData]

            switch (sortBy) {
                case "escalations-asc":
                    sorted.sort((a, b) => a["totalEscalation"] - b["totalEscalation"])
                    break
                case "escalations-desc":
                    sorted.sort((a, b) => b["totalEscalation"] - a["totalEscalation"])
                    break
            }

            return sorted
        }


        // Use jQuery delegation so it works for dynamic content
        $(document).on('click', '.open-detail-btn', async function (e) {
            const brandName = $(this).data('brand');
            const date = $(this).data('date');
            // api call
            const data = await api.get(`/automate/dashboard/summary/${brandName}/${date}`)
           
            modal.rendarModal(brandName, data)
            

        });


        // Attach Event Listeners
        function attachEventListeners() {

            document.getElementById("sortSelect").addEventListener("change", (e) => {
                currentSort = e.target.value
                if (currentSort === "") return;
                currentData = sortData(currentSort)
                chart.renderCharts(barCtx, pieCtx, currentData);
                table.renderTable(currentData, tbody)
            })
        }

        $(document).on('change', '#escDateFilter', async function (e) {
            const date = $(this).val();
            currentData = await api.get(`/automate/brand-escalations?date=${date}`)
            currentData = sortData(currentSort)
            // console.log("data of the api -->", currentData)
            chart.renderCharts(barCtx, pieCtx, currentData);
            table.renderTable(currentData, tbody)

        });



    }

    return dashboard
})