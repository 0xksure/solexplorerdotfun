<script>
    import { createEventDispatcher } from "svelte";

    export let projects = [];

    const dispatch = createEventDispatcher();

    const comparisonFields = [
        { key: "name", label: "Project Name" },
        { key: "profileType", label: "Type" },
        { key: "profileSector", label: "Sector" },
        { key: "profileStatus", label: "Status" },
        { key: "foundingDate", label: "Founding Date" },
        { key: "descriptionShort", label: "Description" },
        // Add more fields as needed
    ];

    function removeProject(projectId) {
        dispatch("removeProject", projectId);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
</script>

<div class="comparison-table-container">
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Attribute</th>
                {#each projects as project}
                    <th>
                        {project.name}
                        <button
                            on:click={() => removeProject(project.id)}
                            class="remove-btn">X</button
                        >
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each comparisonFields as field}
                <tr>
                    <td class="field-label">{field.label}</td>
                    {#each projects as project}
                        <td>
                            {#if field.key === "foundingDate"}
                                {formatDate(project[field.key])}
                            {:else if field.key === "descriptionShort"}
                                <div class="description-cell">
                                    {project[field.key]}
                                </div>
                            {:else}
                                {project[field.key]}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .comparison-table-container {
        overflow-x: auto;
        margin-top: 20px;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .comparison-table th,
    .comparison-table td {
        border: 1px solid #ddd;
        padding: 12px;
    }

    .comparison-table th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    .field-label {
        font-weight: bold;
        background-color: #f9f9f9;
    }

    .remove-btn {
        background-color: #ff4136;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        cursor: pointer;
        margin-left: 8px;
    }

    .description-cell {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media (max-width: 768px) {
        .comparison-table {
            font-size: 14px;
        }

        .comparison-table th,
        .comparison-table td {
            padding: 8px;
        }
    }
</style>
