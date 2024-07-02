<script lang="ts">
    export let data: any;

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString();
    }

    function getUniqueNetworks(products: any[]) {
        if (!products) return "N/A";
        const networks = products
            .map((product) => product.productDeployedOnProduct?.name)
            .filter(Boolean);
        return [...new Set(networks)].join(", ") || "N/A";
    }
</script>

<div class="project-metrics card">
    <div class="metric">
        <span class="label">Type:</span>
        <span class="value highlight">{data.profileType?.name || "N/A"}</span>
    </div>
    <div class="metric">
        <span class="label">Sector:</span>
        <span class="value accent-purple"
            >{data.profileSector?.name || "N/A"}</span
        >
    </div>
    <div class="metric">
        <span class="label">Status:</span>
        <span class="value accent-blue"
            >{data.profileStatus?.name || "N/A"}</span
        >
    </div>
    <div class="metric">
        <span class="label">Founding Date:</span>
        <span class="value"
            >{data.foundingDate ? formatDate(data.foundingDate) : "N/A"}</span
        >
    </div>
    <div class="metric">
        <span class="label">Network(s):</span>
        <span class="value accent-teal">{getUniqueNetworks(data.products)}</span
        >
    </div>
    <div class="metric description">
        <span class="label">Description:</span>
        <span class="value">{data.descriptionShort || "N/A"}</span>
    </div>
</div>

<style>
    .project-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .metric {
        display: flex;
        flex-direction: column;
    }

    .description {
        grid-column: 1 / -1;
    }

    .label {
        font-size: 0.9rem;
        color: var(--accent-color-teal);
        margin-bottom: 0.25rem;
    }

    .value {
        font-size: 1.1rem;
        font-weight: bold;
    }
</style>
