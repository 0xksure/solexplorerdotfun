<script lang="ts">
    import { onMount } from "svelte";
    import { loadProjects } from "$lib/stores/projectData";
    import Navbar from "$lib/components/Navbar.svelte";
    let wallets;
    import SearchFilters from "$lib/components/SearchFilters.svelte";
    import "$lib/global.css";
    import {
        WalletMultiButton,
        WalletProvider,
    } from "@svelte-on-solana/wallet-adapter-ui";
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import { page } from "$app/stores";
    const localStorageKey = "walletAdapter";
    onMount(async () => {
        const {
            PhantomWalletAdapter,
            SolflareWalletAdapter,
            TorusWalletAdapter,
        } = await import("@solana/wallet-adapter-wallets");

        const walletsMap = [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
        ];

        wallets = walletsMap;
        await loadProjects();
    });

    $: showFilters =
        $page.url.pathname === "/analysis" ||
        $page.url.pathname === "/projects";
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<Navbar />

<main>
    {#if showFilters}
        <SearchFilters />
    {/if}
    <slot />
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    @media (max-width: 768px) {
        main {
            padding: 1rem;
        }
    }
</style>
