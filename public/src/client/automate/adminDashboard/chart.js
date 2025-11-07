
// Move chartInstances OUTSIDE the function so it persists between calls
const chartInstances = {}

export function renderCharts(barCtx, pieCtx, brandData) {
    // Global state

    // Check if elements exist
    if (!barCtx || !pieCtx) {
        console.error("Chart elements not found");
        return;
    }
    if (brandData.length < 1) {
        barCtx.innerContent = "No Data found"
        pieCtx.innerContent = "No Data found"
        return
    }

    // Destroy existing charts if they exist
    if (chartInstances.barChart) {
        // console.log("Destroying existing bar chart");
        chartInstances.barChart.destroy();
    }
    if (chartInstances.pieChart) {
        // console.log("Destroying existing pie chart");
        chartInstances.pieChart.destroy();
    }

    // Prepare data for Bar Chart
    const barCategories = brandData.map((brand) => brand["name"].split(" ")[0] === "M&#x2F;s." ?
        brand["name"].split(" ")[1] : brand["name"].split(" ")[0]);
    const barSeries = brandData.map((brand) => brand["totalEscalation"]);

    // Bar Chart Configuration
    const barOptions = {
        series: [{
            name: 'Escalations',
            data: barSeries
        }],
        chart: {
            type: 'bar',
            height: 315,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                distributed: false,
                columnWidth: '60%'
            }
        },
        colors: ['#0d6efd'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: barCategories,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Escalations'
            }
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val) {
                    return val + " escalations"
                }
            }
        }
    };

    // Create Bar Chart
    chartInstances.barChart = new ApexCharts(barCtx, barOptions);
    chartInstances.barChart.render();

    // Prepare data for Pie Chart
    const pieLabels = brandData.map((brand) => brand["name"].split(" ")[0] === "M&#x2F;s." ?
        brand["name"].split(" ")[1] : brand["name"].split(" ")[0]);;
    const pieSeries = brandData.map((brand) => brand["totalEscalation"]);
    const piecolors = getDistinctColors(brandData.length)
    // Pie Chart Configuration
    const pieOptions = {
        series: pieSeries,
        chart: {
            type: 'pie',
            height: 315
        },
        labels: pieLabels,
        colors: piecolors,
        legend: {
            position: 'bottom',
            fontSize: '12px'
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toFixed(0) + "%"
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " escalations"
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    // Create Pie Chart
    chartInstances.pieChart = new ApexCharts(pieCtx, pieOptions);
    chartInstances.pieChart.render();


}

// SEPARATE COLOR GENERATION FUNCTION
export function getDistinctColors(count) {
    // Base color palette with 25 carefully selected distinct colors
    const baseColors = [
        '#0d6efd', // Blue
        '#dc3545', // Red
        '#20c997', // Teal
        '#ffc107', // Yellow
        '#6f42c1', // Purple
        '#fd7e14', // Orange
        '#198754', // Green
        '#e83e8c', // Pink
        '#0dcaf0', // Cyan
        '#6610f2', // Indigo
        '#f8b739', // Amber
        '#17a2b8', // Info Blue
        '#9c27b0', // Deep Purple
        '#00bcd4', // Light Blue
        '#4caf50', // Light Green
        '#ff9800', // Deep Orange
        '#795548', // Brown
        '#607d8b', // Blue Grey
        '#ff5722', // Red Orange
        '#8bc34a', // Lime Green
        '#3f51b5', // Indigo Blue
        '#cddc39', // Lime
        '#ff6f00', // Orange Accent
        '#d32f2f', // Dark Red
        '#00796b', // Dark Teal
    ];

    // If we need fewer or equal colors than our base palette
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    }

    // If we need more colors, generate additional using HSL
    const allColors = [...baseColors];
    const additionalCount = count - baseColors.length;

    for (let i = 0; i < additionalCount; i++) {
        // Generate evenly spaced hues
        const hue = ((i * 360) / additionalCount + 137.5) % 360; // Golden angle distribution
        const saturation = 60 + (i % 3) * 10; // Vary saturation: 60%, 70%, 80%
        const lightness = 50 + (i % 2) * 10; // Vary lightness: 50%, 60%
        allColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return allColors;
}
