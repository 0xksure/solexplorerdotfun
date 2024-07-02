<script lang="ts">
    import { page } from "$app/stores";
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    $: path = $page.url.pathname;
</script>

<nav>
    <div class="nav-container">
        <a href="/" class="logo">solexplore.fun</a>
        <button
            class="menu-toggle"
            on:click={toggleMenu}
            aria-label="Toggle menu"
        >
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <ul class:active={isMenuOpen}>
            <li>
                <a href="/" class:active={path === "/"} on:click={closeMenu}
                    >Home</a
                >
                <a
                    href="/analysis"
                    class:active={path === "/analysis"}
                    on:click={closeMenu}>Analysis</a
                >
                <a
                    href="/projects"
                    class:active={path === "/projects"}
                    on:click={closeMenu}>Projects</a
                >

                <WalletMultiButton />
            </li>
        </ul>
    </div>
</nav>

<style>
    nav {
        background-color: var(--card-background);
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }

    .logo {
        color: var(--text-color);
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
    }

    ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        margin-left: 1rem;
    }

    a {
        color: var(--text-color);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }

    a:hover,
    a.active {
        background-color: var(--accent-color-purple);
    }

    .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
    }

    .bar {
        display: block;
        width: 25px;
        height: 3px;
        margin: 5px auto;
        background-color: var(--text-color);
        transition: all 0.3s ease-in-out;
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }

        ul {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background-color: var(--card-background);
            align-items: center;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }

        ul.active {
            max-height: 300px;
        }

        li {
            margin: 1rem 0;
        }
    }
</style>
