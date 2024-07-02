<script>
    import { onMount, afterUpdate } from "svelte";
    import Chart from "chart.js/auto";

    export let projects = [];

    let chartCanvas;
    let chart;

    function createChart() {
        if (chart) {
            chart.destroy();
        }

        const sectorCounts = projects.reduce((acc, project) => {
            const sectorName = project.profileSector?.name;
            acc[sectorName] = (acc[sectorName] || 0) + 1;
            return acc;
        }, {});

        const sectors = Object.keys(sectorCounts);
        const counts = Object.values(sectorCounts);

        chart = new Chart(chartCanvas, {
            type: "pie",
            data: {
                labels: sectors,

                datasets: [
                    {
                        data: counts,
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            // Add more colors if needed
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            color: "#ffffff",
                        },
                    },
                    title: {
                        display: true,
                        text: "Project Distribution by Sector",
                        color: "#ffffff",
                    },
                },
            },
        });
    }

    onMount(() => {
        createChart();
    });

    afterUpdate(() => {
        createChart();
    });
</script>

<div class="sector-chart">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
    .sector-chart {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        color: white;
    }
</style>
