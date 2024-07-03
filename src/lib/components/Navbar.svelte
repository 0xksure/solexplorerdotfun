<script lang="ts">
    import "./../../app.css";
    import { page } from "$app/stores";
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger,
        Search,
        Button,
    } from "flowbite-svelte";
    $: activeUrl = $page.url.pathname;
    let activeClass =
        " text-white bg-sky-700 md:bg-sky-700 md:bg-transparent md:text-sky-700 md:dark:text-white dark:bg-sky-600 md:dark:bg-transparent";
    let nonActiveClass =
        "flex items-center text-slate-800 md:text-slate-300 hover:bg-sky-200 md:hover:bg-transparent md:border-0 md:hover:text-sky-700 dark:text-slate-400 md:dark:hover:text-white dark:hover:bg-green-700 dark:hover:text-white md:dark:hover:bg-transparent";

    let hideNavMenu = true;
    const onNavHamburgerClick = (toggleFn: () => void) => {
        toggleFn();
        hideNavMenu = !hideNavMenu;
    };

    const onNavLinkClick = (toggleFn: () => void) => {
        hideNavMenu = true;
    };
</script>

<nav>
    <div class="site flex flex-row">
        <Navbar
            let:toggle
            let:NavContainer
            class="bg-black flex flex-row align-items items-center justify-center "
        >
            <NavContainer
                class="flex flex-row md:flex-nowrap gap-2 md:justify-center items-center align-items px-5 py-2 "
            >
                <div class="md:hidden">
                    <WalletMultiButton />
                </div>
                <NavHamburger
                    class="flex flex-row justify-start justify-center"
                    onClick={() => onNavHamburgerClick(toggle)}
                />
                <NavUl
                    {activeUrl}
                    {activeClass}
                    {nonActiveClass}
                    hidden={hideNavMenu}
                    ulClass="flex flex-col items-center p-4 gap-2 md:gap-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium"
                    on:click={() => onNavLinkClick(toggle)}
                >
                    <NavLi href="/">Home</NavLi>

                    <NavLi href="projects">Projects</NavLi>
                </NavUl>
                <div
                    class="flex flex-row gap-3 justify-center items-center hidden md:flex"
                >
                    <WalletMultiButton />
                </div>
            </NavContainer>
        </Navbar>
    </div>
</nav>

<style>
    .site {
        background-color: #1a202c;
    }
    /* nav {
        background-color: var(--card-background);
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 1000;
    } */

    /* .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    } */

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

    /* a {
        color: var(--text-color);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    } */

    /* a:hover,
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
    } */
</style>
