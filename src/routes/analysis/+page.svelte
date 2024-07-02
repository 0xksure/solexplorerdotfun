<script lang="ts">
    import { onMount } from "svelte";
    import {
        projects,
        filteredProjects,
        loadProjects,
    } from "$lib/stores/projectData";
    import { showFilters } from "$lib/stores/uiState";

    import ProjectsOverTimeChart from "$lib/components/ProjectsOverTimeChart.svelte";
    import SocialMediaMetrics from "$lib/components/SocialMediaMetrics.svelte";
    import SearchFilters from "$lib/components/SearchFilters.svelte";

    onMount(async () => {
        // Load projects if not already loaded
        if ($projects.length === 0) {
            await loadProjects();
        }
        showFilters.set(true);
        return () => showFilters.set(false);
    });
</script>

<svelte:head>
    <title>Analysis - Solana Project Compass</title>
</svelte:head>

<h1>Project Analysis</h1>
<SearchFilters />

<section class="card">
    <h2>Projects Over Time</h2>
    <ProjectsOverTimeChart projects={$filteredProjects} />
</section>

<section class="card">
    <h2>Social Media Overview</h2>
    <SocialMediaMetrics socials={$filteredProjects.flatMap((p) => p.socials)} />
</section>

<style>
    h1,
    h2 {
        color: var(--text-color);
    }

    .card {
        background-color: var(--card-background);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
</style>
