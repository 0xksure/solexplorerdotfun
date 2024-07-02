<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import Chart from "chart.js/auto";
    import { TimeScale } from "chart.js";
    import "chartjs-adapter-date-fns";
    import { enUS } from "date-fns/locale";

    Chart.register(TimeScale);

    export let projects: any[] = [];

    let chartCanvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    function createOrUpdateChart() {
        const ctx = chartCanvas.getContext("2d");
        if (!ctx) return;

        const projectCounts = processProjectData(projects);

        if (chart) {
            chart.data.labels = projectCounts.map((d) => d.date);
            chart.data.datasets[0].data = projectCounts.map((d) => ({
                x: d.date,
                y: d.count,
            }));
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: projectCounts.map((d) => d.date),
                    datasets: [
                        {
                            label: "Number of Projects",
                            data: projectCounts.map((d) => ({
                                x: d.date,
                                y: d.count,
                            })),
                            fill: false,
                            borderColor: "#9945FF",
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: "time",
                            time: {
                                unit: "month",
                                displayFormats: {
                                    month: "MMM yyyy",
                                },
                            },
                            title: {
                                display: true,
                                text: "Date",
                                color: "#ffffff",
                            },
                            ticks: {
                                color: "#ffffff",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Number of Projects",
                                color: "#ffffff",
                            },
                            ticks: {
                                color: "#ffffff",
                            },
                        },
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: "Projects Over Time",
                            color: "#ffffff",
                            font: {
                                size: 18,
                            },
                        },
                        legend: {
                            labels: {
                                color: "#ffffff",
                            },
                        },
                    },
                    adapters: {
                        date: {
                            locale: enUS,
                        },
                    },
                },
            });
        }
    }

    function processProjectData(projects: any[]) {
        const dateCountMap = new Map();

        projects.forEach((project) => {
            if (project.foundingDate) {
                const date = new Date(project.foundingDate);
                const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
                dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
            }
        });

        const sortedDates = Array.from(dateCountMap.keys()).sort();
        let cumulativeCount = 0;

        return sortedDates.map((date) => {
            cumulativeCount += dateCountMap.get(date);
            return { date, count: cumulativeCount };
        });
    }

    onMount(() => {
        createOrUpdateChart();
    });

    afterUpdate(() => {
        createOrUpdateChart();
    });
</script>

<div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
    .chart-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        background-color: var(--card-background);
        border-radius: 8px;
        padding: 1rem;
    }
</style>
