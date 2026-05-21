<script>
    import { goto } from "$app/navigation";
    import DistrictInput from "$lib/components/DistrictInput.svelte";

    let routeFrom = $state("");
    let routeTo = $state("");
    let ticketDate = $state("");
    let ticketFor = $state("bus");
    let errorMsg = $state("");

    function handleSearch(e) {
        e.preventDefault();
        if (!routeFrom || !routeTo || !ticketDate) {
            errorMsg = "All fields are required.";
            return;
        }

        const params = new URLSearchParams({
            from: routeFrom.trim(),
            to: routeTo.trim(),
            date: ticketDate.trim(),
            type: ticketFor.trim(),
        });
        goto(`/search?${params.toString()}`);
    }
</script>

<main class="responsive">
    {#if errorMsg}
        <div class="row red1 round border tiny-margin small-padding">
            <i class="red-text">error</i><span class="wrap">{errorMsg}</span>
        </div>
    {/if}

    <article class="responsive margin small-padding">
        <header><h5>find tickets</h5></header>
        <form onsubmit={handleSearch}>
            <div class="grid">
                <div class="s12 m6 l6">
                    <DistrictInput
                        id="route-from"
                        label="from"
                        icon="home"
                        helper="Enter a district name eg. Dhaka."
                        bind:value={routeFrom}
                    />
                </div>
                <div class="s12 m6 l6">
                    <DistrictInput
                        id="route-to"
                        label="to"
                        icon="location_away"
                        helper="Enter a district name eg. Rangpur."
                        bind:value={routeTo}
                    />
                </div>
            </div>
            <div class="grid">
                <div class="s12 m6 l6 field label border prefix">
                    <i>today</i>
                    <input
                        type="date"
                        id="ticket-date"
                        bind:value={ticketDate}
                        required
                    />
                    <label for="ticket-date">date</label>
                    <output class="helper">Enter a valid date.</output>
                </div>
                <div class="s12 m6 l6 field label border suffix">
                    <select bind:value={ticketFor}>
                        <option value="bus">bus</option>
                        <option value="train">train</option>
                    </select>
                    <label for="">for</label><i>arrow_drop_down</i>
                </div>
            </div>
            <button class="responsive fill primary border small-margin btn">
                <i>search</i><span>search</span>
            </button>
        </form>
    </article>
</main>
