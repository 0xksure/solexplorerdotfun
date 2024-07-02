<script lang="ts">
    import { onMount } from "svelte";
    import {
        projects,
        filteredProjects,
        loadProjects,
    } from "$lib/stores/projectData";
    import { showFilters } from "$lib/stores/uiState";

    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import SearchFilters from "$lib/components/SearchFilters.svelte";

    onMount(async () => {
        if ($projects.length === 0) {
            await loadProjects();
        }
        showFilters.set(true);
        return () => showFilters.set(false);
    });

    $: projectCount = $filteredProjects.length;
</script>

<svelte:head>
    <title>Projects - Solana Project Compass</title>
</svelte:head>

<h1>Solana Projects</h1>
<SearchFilters />

<p>Showing {projectCount} projects</p>

<div class="project-grid">
    {#each $filteredProjects as project (project.id)}
        <ProjectCard {project} />
    {/each}
</div>

{#if $filteredProjects.length === 0}
    <p>No projects found matching your criteria.</p>
{/if}

<style>
    h1 {
        color: var(--text-color);
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        padding: 1rem;
    }

    @media (max-width: 768px) {
        .project-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
