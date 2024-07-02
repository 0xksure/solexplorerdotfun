<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let project: any;
    const dispatch = createEventDispatcher();

    function truncate(str: string, n: number) {
        if (!str) return "";
        return str.length > n ? str.slice(0, n - 1) + "..." : str;
    }

    function handleAddToComparison() {
        dispatch("addToComparison", project.id);
    }
</script>

<div class="project-card card">
    <h3>{project.name}</h3>
    <p class="project-type highlight">{project.profileType?.name || "N/A"}</p>
    <p class="project-sector accent-purple">
        {project.profileSector?.name || "N/A"}
    </p>
    <p class="project-description">
        {truncate(project.descriptionShort || "", 100)}
    </p>
    <p class="project-status">
        Status: <span class="accent-blue"
            >{project.profileStatus?.name || "N/A"}</span
        >
    </p>
    <div class="card-actions">
        <a href="/projects/{project.id}" class="button-secondary"
            >View Details</a
        >
        <!-- <button on:click={handleAddToComparison} class="button-primary"
            >Add to Comparison</button
        > -->
    </div>
</div>

<style>
    .project-card {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 0 0 calc(33.333% - 20px); /* Adjust as needed */
        margin-bottom: 20px;
    }

    h3 {
        margin-top: 0;
        color: var(--text-color);
    }

    .project-type,
    .project-sector {
        font-size: 0.9rem;
    }

    .project-description {
        flex-grow: 1;
    }

    .project-status {
        margin-bottom: 1rem;
    }

    .card-actions {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .card-actions a,
    .card-actions button {
        flex: 1;
        text-align: center;
        text-decoration: none;
        font-size: 0.9rem;
    }
</style>
