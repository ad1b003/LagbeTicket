<script>
    // import "beercss/dist/cdn/beer.min.css";
    import "beercss";
    import "material-dynamic-colors";
    import "$lib/assets/theme.css";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let { children } = $props();
    let mode = $state("light");
    let currentYear = new Date().getFullYear();

    onMount(() => {
        // Apply default BeerCSS light theme on mount
        ui("mode", mode);
    });

    function toggleMode() {
        mode = mode === "light" ? "dark" : "light";
        ui("mode", mode);
    }
</script>

<header class="fixed elevate">
    <nav>
        <button class="transparent circle" onclick={() => goto("/")}>
            <i>confirmation_number</i>
        </button>
        <div class="max vertical">
            <h6 class="center-align">LagbeTicket</h6>
            <small class="center-align italic">• in-person • buy • sell</small>
        </div>
        <button class="transparent vertical" onclick={() => goto("/auth")}>
            <i>person</i>
            <label for="">auth</label>
        </button>
        <button
            class="transparent circle vertical"
            onclick={() => goto("/sell")}
        >
            <i>campaign</i>
            <label for="">sell</label>
        </button>
        <button class="circle transparent vertical" onclick={toggleMode}>
            <i>{mode === "light" ? "dark_mode" : "light_mode"}</i>
            <label for="">{mode}</label>
        </button>
    </nav>
</header>

{@render children()}

<footer class="row">
    <div class="max vertical small-margin tiny-padding">
        <strong>TicketLagbe </strong>
        <em>• no listing fee on post • trusted physical handover</em>
    </div>
    <div class="small-margin right-align bold italic">
        ©<span>{currentYear}</span>
    </div>
</footer>
