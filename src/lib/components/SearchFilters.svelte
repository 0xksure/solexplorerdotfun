<script lang="ts">
    import {
        searchTerm,
        selectedSector,
        selectedStatus,
        selectedNetwork,
        projects,
    } from "$lib/stores/projectData";
    import { showFilters } from "$lib/stores/uiState";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let isOpen = false;
    let isMobile = false;

    $: sectors = [
        ...new Set($projects.map((p) => p.profileSector?.name).filter(Boolean)),
    ].sort();
    $: statuses = [
        ...new Set($projects.map((p) => p.profileStatus?.name).filter(Boolean)),
    ].sort();
    $: networks = [
        ...new Set(
            $projects
                .flatMap(
                    (p) =>
                        p.products?.map(
                            (prod) => prod.productDeployedOnProduct?.name,
                        ) || [],
                )
                .filter(Boolean),
        ),
    ].sort();

    function toggleFilters() {
        isOpen = !isOpen;
    }

    function handleResize() {
        isMobile = window.innerWidth < 768;
        if (!isMobile) isOpen = true;
    }

    onMount(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });
</script>

{#if $showFilters}
    <div class="search-filters">
        <button class="toggle-filters" on:click={toggleFilters}>
            {isOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {#if !isMobile || (isMobile && isOpen)}
            <div class="filters" transition:fade={{ duration: 200 }}>
                <input
                    type="text"
                    bind:value={$searchTerm}
                    placeholder="Search projects..."
                />

                <select bind:value={$selectedSector}>
                    <option value="">All Sectors</option>
                    {#each sectors as sector}
                        <option value={sector}>{sector}</option>
                    {/each}
                </select>

                <select bind:value={$selectedStatus}>
                    <option value="">All Statuses</option>
                    {#each statuses as status}
                        <option value={status}>{status}</option>
                    {/each}
                </select>

                <select bind:value={$selectedNetwork}>
                    <option value="">All Networks</option>
                    {#each networks as network}
                        <option value={network}>{network}</option>
                    {/each}
                </select>
            </div>
        {/if}
    </div>
{/if}

<style>
    .search-filters {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
    }

    input,
    select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: var(--card-background);
        color: var(--text-color);
    }
</style>
