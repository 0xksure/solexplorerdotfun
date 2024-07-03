<script lang="ts">
    import { projects } from "$lib/stores/projectData";
    import type { WalletStore } from "@svelte-on-solana/wallet-adapter-core";
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import { fade } from "svelte/transition";
    import * as web3 from "@solana/web3.js";
    import {
        DeserializeTransaction,
        SignAndSendTransaction,
    } from "$lib/transaction";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let investmentThesis = "";
    let isLoading = false;
    let error = null;
    let success = false;
    let matchingProjects = [];
    let copySuccess = false;

    onMount(() => {
        const urlParams = new URLSearchParams($page.url.search);
        const prompt = urlParams.get("prompt");
        const projectsIds = urlParams.get("projects");

        if (prompt && projectsIds) {
            investmentThesis = decodeURIComponent(prompt);
            const ids = projectsIds.split(",");
            matchingProjects = $projects.filter((project) =>
                ids.includes(project.id.toString()),
            );
            success = true;
        }
    });
    async function handleSubmit() {
        if (!$walletStore) {
            error = "Please connect your wallet first.";
            return;
        }

        isLoading = true;
        error = null;
        success = false;
        matchingProjects = [];

        try {
            const txResponse = await fetch("/query/transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromAddress: $walletStore.publicKey.toString(),
                }),
            });

            if (!txResponse.ok) {
                throw new Error("Failed to create transaction");
            }

            const { transaction: serializedTx, latestBlockhash } =
                await txResponse.json();

            // Deserialize and sign the transaction
            const vtx = DeserializeTransaction(serializedTx);
            const transactionResult = await SignAndSendTransaction(
                $walletStore,
                vtx,
            );

            if (transactionResult.error) {
                throw new Error(
                    `Transaction failed. Cause: ${transactionResult.error}`,
                );
            }

            // If transaction is successful, call the query endpoint
            const queryResponse = await fetch("/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: investmentThesis,
                    projects: $projects,
                }),
            });

            const result = await queryResponse.json();

            if (queryResponse.ok) {
                if (result.projects && result.projects.length > 0) {
                    success = true;
                    matchingProjects = result.projects;

                    // Update URL with query parameters
                    const searchParams = new URLSearchParams({
                        prompt: encodeURIComponent(investmentThesis),
                        projects: result.projects.map((p) => p.id).join(","),
                    });
                    goto(`?${searchParams.toString()}`, { replaceState: true });
                } else {
                    error =
                        "No matching projects found for your investment thesis.";
                }
            } else {
                throw new Error(result.error || "Failed to query projects");
            }
        } catch (e) {
            console.error("Error:", e);
            error =
                e.message || "An unexpected error occurred. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    function copyLinkToClipboard() {
        navigator.clipboard.writeText(window.location.href).then(
            () => {
                copySuccess = true;
                setTimeout(() => (copySuccess = false), 3000);
            },
            (err) => {
                console.error("Could not copy text: ", err);
            },
        );
    }
</script>

<svelte:head>
    <title>Find the Next Gem</title>
</svelte:head>

<div class="container">
    <div>
        <h1 class="text-2xl">Find the next gem with AI</h1>
        <p class="text-md text-zinc-400">
            Enter your investment thesis below to find blockchain projects that
            match your thesis. Each query cost 0.5 USDC.
        </p>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
        <textarea
            bind:value={investmentThesis}
            placeholder="Your investment thesis"
            rows="4"
            disabled={isLoading}
        ></textarea>
        <button type="submit" disabled={isLoading || !investmentThesis.trim()}>
            {#if isLoading}
                Analyzing...
            {:else}
                Find Matching Projects
            {/if}
        </button>
    </form>

    {#if isLoading}
        <div class="loader" transition:fade></div>
    {/if}

    {#if error}
        <div class="error-message" transition:fade>
            <p>{error}</p>
        </div>
    {/if}

    {#if success}
        <div class="success-message" transition:fade>
            <p>
                Matching projects found! You can share this URL to show your
                results.
            </p>
            <button on:click={copyLinkToClipboard} class="copy-button">
                {copySuccess ? "Copied!" : "Copy Link"}
            </button>
        </div>
    {/if}

    {#if matchingProjects.length > 0}
        <div class="matching-projects" transition:fade>
            <h2>Matching Projects</h2>
            <div class="project-grid">
                {#each matchingProjects as project (project.id)}
                    <ProjectCard {project} />
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1,
    h2 {
        color: var(--text-color);
        text-align: center;
        margin-bottom: 2rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    textarea {
        width: 100%;
        padding: 0.5rem;
        border-radius: 4px;
        background-color: var(--card-background);
        color: var(--text-color);
        border: 1px solid var(--accent-color-purple);
        resize: vertical;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: var(--accent-color-purple);
        color: var(--text-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover:not(:disabled) {
        background-color: var(--accent-color-blue);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid var(--accent-color-teal);
        border-top: 5px solid var(--accent-color-purple);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .error-message,
    .success-message {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
    }

    .error-message {
        background-color: rgba(255, 0, 0, 0.1);
        border: 1px solid red;
        color: red;
    }

    .success-message {
        background-color: rgba(0, 255, 0, 0.1);
        border: 1px solid green;
        color: green;
    }

    .matching-projects {
        margin-top: 2rem;
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    .success-message {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 4px;
        background-color: rgba(0, 255, 0, 0.1);
        border: 1px solid green;
        color: green;
    }

    .copy-button {
        padding: 0.5rem 1rem;
        background-color: var(--accent-color-purple);
        color: var(--text-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .copy-button:hover {
        background-color: var(--accent-color-blue);
    }
</style>
