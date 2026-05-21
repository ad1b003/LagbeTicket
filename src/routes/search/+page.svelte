<script>
    import VehicleType from "$lib/components/VehicleType.svelte";
    import { goto } from "$app/navigation";
    import { error } from "@sveltejs/kit";

    let { data } = $props();

    let rawTickets = $derived(data?.tickets || []);
    let rawError = $derived(data?.error || "");

    // Filter State
    let selectedTime = $state("");
    let selectedBoarding = $state([]);
    let selectedDropping = $state([]);
    let selectedOperators = $state([]);
    let selectedTypes = $state([]);

    // Derived unique arrays using the SAFE rawTickets array
    let availableBoarding = $derived([
        ...new Set(rawTickets.map((t) => t.boarding_point)),
    ]);
    let availableDropping = $derived([
        ...new Set(rawTickets.map((t) => t.dropping_point)),
    ]);
    let availableOperators = $derived([
        ...new Set(rawTickets.map((t) => t.operator)),
    ]);
    let availableTypes = $derived([
        ...new Set(rawTickets.map((t) => t.vehicle_type)),
    ]);

    // Derived state that applies all active filters to the safe array
    let filteredTickets = $derived(
        rawTickets.filter((ticket) => {
            // Time filter logic
            if (selectedTime) {
                const hour = parseInt(ticket.ticket_time.split(":")[0]);
                if (selectedTime === "6AM to 12PM" && (hour < 6 || hour > 12))
                    return false;
                if (selectedTime === "After 12PM" && hour <= 12) return false;
                if (selectedTime === "6PM to 9PM" && (hour < 18 || hour > 21))
                    return false;
                if (selectedTime === "9PM to 12AM" && (hour < 21 || hour > 23))
                    return false;
            }
            if (
                selectedBoarding.length > 0 &&
                !selectedBoarding.includes(ticket.boarding_point)
            )
                return false;
            if (
                selectedDropping.length > 0 &&
                !selectedDropping.includes(ticket.dropping_point)
            )
                return false;
            if (
                selectedOperators.length > 0 &&
                !selectedOperators.includes(ticket.operator)
            )
                return false;
            if (
                selectedTypes.length > 0 &&
                !selectedTypes.includes(ticket.vehicle_type)
            )
                return false;

            return true;
        }),
    );

    function toggleFilter(array, value) {
        if (array.includes(value)) {
            return array.filter((v) => v !== value);
        } else {
            return [...array, value];
        }
    }

    function resetFilters() {
        selectedTime = "";
        selectedBoarding = [];
        selectedDropping = [];
        selectedOperators = [];
        selectedTypes = [];
    }

    let errorMsg = $state("");
    // svelte-ignore state_referenced_locally
    if (rawError && rawError === '') {
        errorMsg = rawError;
        ui("#notification-toast", 2000);
    }
</script>

<div id="search-result-page">
    <header class="row">
        <button class="transparent round" onclick={() => history.back()}>
            <i>keyboard_return</i>
        </button>
        <div class="max vertical">
            <h6 class="center-align">search results for</h6>
            <h5 class="center-align">{data.from} to {data.to}</h5>
        </div>
        <button class="transparent square" data-ui="#filter-menu">
            <i>filter_alt</i>
        </button>
    </header>

    <div class="grid">
        {#if filteredTickets.length > 0}
            {#each filteredTickets as ticket}
                <article class="s12 m6 l3 fill elevate">
                    <header>
                        <div class="row">
                            <div>
                                <i>today</i>
                                <span>{ticket.ticket_date}</span>
                            </div>
                            <div>
                                <i>schedule</i>
                                <span>{ticket.ticket_time}</span>
                            </div>
                        </div>
                        <h4 class="bold">
                            {ticket.route_from} to {ticket.route_to}
                        </h4>
                        <div class="row">
                            <button class="chip round">
                                <i>tatami_seat</i>
                                <span>{ticket.seats.length} seats</span>
                            </button>
                            <VehicleType type={ticket.vehicle_type} />
                        </div>
                    </header>
                    <div class="row">
                        <h5 class="bold large-text">৳{ticket.ticket_price}</h5>
                        <button
                            class="max bold large-text small-padding"
                            onclick={() => goto(`/ticket/${ticket.id}`)}
                        >
                            View
                        </button>
                    </div>
                </article>
            {/each}
        {:else}
            <article class="s12 m6 l3 fill elevate">
                <h2>No tickets found</h2>
            </article>
        {/if}
    </div>

    <dialog popover id="filter-menu">
        <header class="row">
            <h5 class="max">filter</h5>
            <button class="transparent square" data-ui="#filter-menu">
                <i>cancel</i>
            </button>
        </header>

        <div class="row" style="margin-bottom:0.5rem;">
            <button><i>arrow_left_alt</i><span>previous</span></button>
            <div class="max horizontal">
                <i>today</i><span>{data.date}</span>
            </div>
            <button><i>arrow_right_alt</i><span>next</span></button>
        </div>

        <div>
            <h6 class="small">time</h6>
            <div class="small-padding">
                {#each ["6AM to 12PM", "After 12PM", "6PM to 9PM", "9PM to 12AM"] as time}
                    <button
                        type="button"
                        class="time-filter chip round tiny-margin {selectedTime ===
                        time
                            ? 'selected'
                            : ''}"
                        onclick={() =>
                            (selectedTime = selectedTime === time ? "" : time)}
                    >
                        {time}
                    </button>
                {/each}
            </div>
        </div>

        {#if availableBoarding.length > 0}
            <div>
                <h6 class="small">boarding points</h6>
                <div class="boarding-points small-padding">
                    {#each availableBoarding as point}
                        <button
                            type="button"
                            class="chip round tiny-margin {selectedBoarding.includes(
                                point,
                            )
                                ? 'selected'
                                : ''}"
                            onclick={() =>
                                (selectedBoarding = toggleFilter(
                                    selectedBoarding,
                                    point,
                                ))}
                        >
                            {point}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        {#if availableDropping.length > 0}
            <div>
                <h6 class="small">dropping points</h6>
                <div class="dropping-points small-padding">
                    {#each availableDropping as point}
                        <button
                            type="button"
                            class="chip round tiny-margin {selectedDropping.includes(
                                point,
                            )
                                ? 'selected'
                                : ''}"
                            onclick={() =>
                                (selectedDropping = toggleFilter(
                                    selectedDropping,
                                    point,
                                ))}
                        >
                            {point}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        {#if availableOperators.length > 0}
            <div>
                <h6 class="small">operators</h6>
                <div class="operators small-padding">
                    {#each availableOperators as operator}
                        <button
                            type="button"
                            class="chip round tiny-margin {selectedOperators.includes(
                                operator,
                            )
                                ? 'selected'
                                : ''}"
                            onclick={() =>
                                (selectedOperators = toggleFilter(
                                    selectedOperators,
                                    operator,
                                ))}
                        >
                            {operator}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        {#if availableTypes.length > 0}
            <div>
                <h6 class="small">types</h6>
                <div class="vehicle-types small-padding">
                    {#each availableTypes as vType}
                        <button
                            type="button"
                            class="chip round tiny-margin {selectedTypes.includes(
                                vType,
                            )
                                ? 'selected'
                                : ''}"
                            onclick={() =>
                                (selectedTypes = toggleFilter(
                                    selectedTypes,
                                    vType,
                                ))}
                        >
                            {#if vType === "ac"}<i>ac_unit</i><span>ac</span>
                            {:else if vType === "local-ac"}<i>hvac</i><span
                                    >local-ac</span
                                >
                            {:else if vType === "non-ac"}<i>toys_fan</i><span
                                    >non-ac</span
                                >
                            {:else if vType === "sleeper"}<i
                                    >airline_seat_flat</i
                                ><span>sleeper</span>
                            {/if}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="row">
            <button
                type="button"
                class="max responsive error-container"
                onclick={resetFilters}
            >
                <i>filter_alt_off</i>
                <span>reset</span>
            </button>
            <button type="button" class="max responsive" data-ui="#filter-menu">
                <i>filter_alt</i>
                <span>apply</span>
            </button>
        </div>
    </dialog>

    <div id="notification-toast" class="snackbar bottom error-container" popover>
        <i class="round primary">info</i>
        <span>{errorMsg}</span>
    </div>
</div>

<style>
    article.fill {
        background: var(--surface-container-high);
    }
    .selected {
        background-color: var(--primary);
        color: var(--on-primary);
        border: 1px solid var(--primary);
        box-shadow: var(--elevate1);
        transform: translateY(-1px);
        transition:
            background-color var(--speed2),
            color var(--speed2),
            box-shadow var(--speed2),
            transform var(--speed1);
    }
    .selected:hover {
        box-shadow: var(--elevate2);
    }
    .selected:active {
        transform: translateY(0);
        box-shadow: var(--elevate1);
    }
</style>
