<script>
    let { type } = $props();
</script>

{#if type === "ac"}
    <button type="button" class="chip round tiny-margin">
        <i>ac_unit</i><span>ac</span>
    </button>
{:else if type === "local-ac"}
    <button type="button" class="chip round tiny-margin">
        <i>hvac</i><span>local-ac</span>
    </button>
{:else if type === "non-ac"}
    <button type="button" class="chip round tiny-margin">
        <i>toys_fan</i><span>non-ac</span>
    </button>
{:else if type === "sleeper"}
    <button type="button" class="chip round tiny-margin">
        <i>airline_seat_flat</i><span>sleeper</span>
    </button>
{/if}
