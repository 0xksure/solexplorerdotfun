<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { projects } from "$lib/stores/projectData";

    export let searchTerm = "";
    export let selectedSector = "";
    export let selectedStatus = "";
    export let selectedNetwork = "";
    export let sortBy = "name";

    const dispatch = createEventDispatcher();

    // Derive sectors from loaded projects
    $: sectors = [
        ...new Set($projects.map((p) => p.profileSector?.name).filter(Boolean)),
    ].sort();

    // Derive statuses from loaded projects
    $: statuses = [
        ...new Set($projects.map((p) => p.profileStatus?.name).filter(Boolean)),
    ].sort();

    // Derive networks from loaded projects
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

    function applyFilters() {
        dispatch("filter", {
            searchTerm,
            selectedSector,
            selectedStatus,
            selectedNetwork,
            sortBy,
        });
    }
</script>

<div class="search-filters">
    <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search projects..."
        on:input={applyFilters}
    />

    <select bind:value={selectedSector} on:change={applyFilters}>
        <option value="">All Sectors</option>
        {#each sectors as sector}
            <option value={sector}>{sector}</option>
        {/each}
    </select>

    <select bind:value={selectedStatus} on:change={applyFilters}>
        <option value="">All Statuses</option>
        {#each statuses as status}
            <option value={status}>{status}</option>
        {/each}
    </select>

    <select bind:value={selectedNetwork} on:change={applyFilters}>
        <option value="">All Networks</option>
        {#each networks as network}
            <option value={network}>{network}</option>
        {/each}
    </select>

    <select bind:value={sortBy} on:change={applyFilters}>
        <option value="name">Sort by Name</option>
        <option value="foundingDate">Sort by Founding Date</option>
    </select>
</div>

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
