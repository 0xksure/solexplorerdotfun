<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { fetchProfileDetails } from "$lib/utils/api";
    import { projects, loadProjects } from "$lib/stores/projectData";
    import ProjectMetrics from "$lib/components/ProjectMetrics.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import SocialMediaMetrics from "$lib/components/SocialMediaMetrics.svelte";
    // ... (rest of the script remains the same)
    const projectId = $page.params.id;
    let projectData: any = null;
    let similarProjects: any[] = [];
    let error: string | null = null;
    let loading: boolean = true;

    onMount(async () => {
        try {
            projectData = await fetchProfileDetails(projectId);
            await loadProjects(); // Ensure all projects are loaded
            findSimilarProjects();
            loading = false;
        } catch (e) {
            error = e.message;
            loading = false;
        }
    });
    function findSimilarProjects() {
        const currentSector = projectData.profileSector?.name.toLowerCase();
        const currentDescription = projectData.descriptionShort.toLowerCase();
        const descriptionKeywords = currentDescription
            .split(/\s+/)
            .filter((word) => word.length > 3);

        similarProjects = $projects
            .filter(
                (p) =>
                    p.id !== projectData.id &&
                    p.profileSector?.name.toLowerCase() === currentSector &&
                    descriptionKeywords.some((keyword) =>
                        p.descriptionShort.toLowerCase().includes(keyword),
                    ),
            )
            .sort((a, b) => {
                const aMatchCount = descriptionKeywords.filter((keyword) =>
                    a.descriptionShort.toLowerCase().includes(keyword),
                ).length;
                const bMatchCount = descriptionKeywords.filter((keyword) =>
                    b.descriptionShort.toLowerCase().includes(keyword),
                ).length;
                return bMatchCount - aMatchCount;
            })
            .slice(0, 3); // Get up to 3 most similar projects
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString();
    }
</script>

<svelte:head>
    <title
        >{projectData ? projectData.name : "Project Details"} - Solana Project Compass</title
    >
</svelte:head>

<div class="project-details gradient-bg">
    {#if loading}
        <p>Loading project details...</p>
    {:else if error}
        <p class="error">Error: {error}</p>
    {:else if projectData}
        <h1>{projectData.name}</h1>
        <ProjectMetrics data={projectData} />
        <SocialMediaMetrics socials={projectData.socials} />
        <section class="card">
            <h2>Products</h2>
            {#if projectData.products && projectData.products.length > 0}
                <ul class="product-list">
                    {#each projectData.products as product}
                        <li class="product-item card">
                            <h3>{product.name}</h3>
                            <p>
                                Type: <span class="highlight"
                                    >{product.productType?.name || "N/A"}</span
                                >
                            </p>
                            <p>Description: {product.descriptionShort}</p>
                            <p>
                                Status: <span class="accent-purple"
                                    >{product.productStatus?.name ||
                                        "N/A"}</span
                                >
                            </p>
                            <p>
                                Launch Date: {product.launchDate
                                    ? formatDate(product.launchDate)
                                    : "N/A"}
                            </p>
                            <p>
                                Network: <span class="accent-teal"
                                    >{product.productDeployedOnProduct?.name ||
                                        "N/A"}</span
                                >
                            </p>
                            {#if product.urlToProduct}
                                <a
                                    href={product.urlToProduct}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="button-secondary">Product Link</a
                                >
                            {/if}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No products found for this project.</p>
            {/if}
        </section>

        <section class="card">
            <h2>Assets</h2>
            {#if projectData.assets && projectData.assets.length > 0}
                <ul class="asset-list">
                    {#each projectData.assets as asset}
                        <li class="asset-item">
                            <h3>{asset.name} ({asset.ticker})</h3>
                            <p>
                                Type: <span class="highlight"
                                    >{asset.assetType?.name || "N/A"}</span
                                >
                            </p>
                            <p>Description: {asset.shortDescription}</p>
                            {#if asset.address}
                                <p>
                                    Address: <span class="accent-blue"
                                        >{asset.address}</span
                                    >
                                </p>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No assets found for this project.</p>
            {/if}
        </section>

        <section class="card">
            <h2>Social Media</h2>
            {#if projectData.socials && projectData.socials.length > 0}
                <ul class="social-list">
                    {#each projectData.socials as social}
                        <li>
                            <strong>{social.socialType?.name || "N/A"}:</strong>
                            <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="accent-teal">{social.name}</a
                            >
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No social media profiles found for this project.</p>
            {/if}
        </section>

        <section class="card">
            <h2>Similar Projects</h2>
            {#if similarProjects.length > 0}
                <div class="similar-projects">
                    {#each similarProjects as project}
                        <ProjectCard {project} />
                    {/each}
                </div>
            {:else}
                <p>No similar projects found.</p>
            {/if}
        </section>
    {:else}
        <p>No project data found.</p>
    {/if}
</div>

<style>
    h1,
    h2,
    h3 {
        color: var(--text-color);
    }

    .error {
        color: #ff4136;
    }

    .project-details {
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .product-list,
    .asset-list,
    .social-list {
        list-style-type: none;
        padding: 0;
    }

    .product-item,
    .asset-item {
        margin-bottom: 1rem;
    }

    .similar-projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    @media (max-width: 768px) {
        .project-details {
            padding: 1rem;
        }
    }
</style>
