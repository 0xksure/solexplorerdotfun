<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    export let socials: any[];

    let socialScore = 0;
    let chartCanvas: HTMLCanvasElement;
    let topPlatform = { name: "", followers: 0 };

    onMount(() => {
        calculateSocialScore();
        findTopPlatform();
        createSocialChart();
    });

    function calculateSocialScore() {
        socialScore = socials.reduce((score, social) => {
            // This is a placeholder calculation. Adjust weights as needed.
            const followerScore = social?.followers
                ? Math.log(social.followers) * 10
                : 0;
            return score + followerScore;
        }, 0);
    }

    function findTopPlatform() {
        topPlatform = socials.reduce(
            (top, current) => {
                return current?.followers > top?.followers ? current : top;
            },
            { name: "", followers: 0 },
        );
    }

    function createSocialChart() {
        const ctx = chartCanvas.getContext("2d");
        if (!ctx) return;

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: socials.map((s) => s?.socialType?.name),
                datasets: [
                    {
                        label: "Followers",
                        data: socials.map((s) => s.followers || 0),
                        backgroundColor: "#9945FF",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Social Media Presence",
                        color: "#ffffff",
                    },
                    legend: {
                        labels: {
                            color: "#ffffff",
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Followers",
                            color: "#ffffff",
                        },
                        ticks: {
                            color: "#ffffff",
                        },
                    },
                    x: {
                        ticks: {
                            color: "#ffffff",
                        },
                    },
                },
            },
        });
    }
</script>

<div class="social-metrics card">
    <h2>Social Media Analytics</h2>
    <div class="metrics-summary">
        <div class="metric">
            <span class="label">Social Score:</span>
            <span class="value">{socialScore.toFixed(2)}</span>
        </div>
        <div class="metric">
            <span class="label">Top Platform:</span>
            <span class="value"
                >{topPlatform.name} ({topPlatform.followers.toLocaleString()} followers)</span
            >
        </div>
    </div>
    <div class="chart-container">
        <canvas bind:this={chartCanvas}></canvas>
    </div>
    <div class="social-links">
        <h3>Social Media Links</h3>
        <ul>
            {#each socials as social}
                {#if social?.socialType && social.url && social.name}
                    <li>
                        <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {social.socialType.name}: {social.name}
                        </a>
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
</div>

<style>
    .social-metrics {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: var(--card-background);
        border-radius: 8px;
    }

    h2,
    h3 {
        color: var(--text-color);
        margin-bottom: 1rem;
    }

    .metrics-summary {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }

    .metric {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-size: 0.9rem;
        color: var(--accent-color-teal);
    }

    .value {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--text-color);
    }

    .chart-container {
        height: 300px;
        margin-bottom: 1.5rem;
    }

    .social-links ul {
        list-style-type: none;
        padding: 0;
    }

    .social-links li {
        margin-bottom: 0.5rem;
    }

    .social-links a {
        color: var(--accent-color-blue);
        text-decoration: none;
    }

    .social-links a:hover {
        text-decoration: underline;
    }
</style>
