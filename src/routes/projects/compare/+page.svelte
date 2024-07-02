<script lang="ts">
    import { selectedProjects } from "$lib/stores/projectData";
    import ComparisonTable from "$lib/components/ComparisonTable.svelte";
</script>

<h1>Project Comparison</h1>
<ComparisonTable projects={$selectedProjects} />
