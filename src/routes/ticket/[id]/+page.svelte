<script>
    import VehicleType from "$lib/components/VehicleType.svelte";

    // The data returned from +page.server.js is passed here as a prop
    let { data } = $props();
    let ticket = $derived(data.ticket);
</script>

<div id="ticket-details-page">
    <style>
        main article {
            position: relative;
            overflow: hidden;
        }

        main article::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.04) 0%,
                rgba(0, 0, 0, 0.02) 40%,
                rgba(0, 0, 0, 0) 70%
            );
            pointer-events: none;
        }

        body.dark main article::before {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.03) 40%,
                rgba(255, 255, 255, 0) 70%
            );
        }

        main article::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
                to bottom right,
                rgba(255, 255, 255, 0.25),
                rgba(255, 255, 255, 0.05) 30%,
                transparent 60%
            );
            opacity: 0.4;
            pointer-events: none;
        }

        body.dark main article::after {
            background: linear-gradient(
                to bottom right,
                rgba(255, 255, 255, 0.12),
                rgba(0, 0, 0, 0.08) 30%,
                transparent 60%
            );
        }

        a button {
            background: var(--primary);
            color: var(--on-primary);
            border-radius: 1rem;
            box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.1);
        }

        body.dark a button {
            box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.4);
        }

        article article {
            background: var(--surface-container-high);
            border: 1px solid var(--outline-variant);
            box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.05);
        }

        body.dark article article {
            box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.35);
        }

        .list.border {
            border: 1px solid var(--outline-variant);
            border-radius: 1.5rem;
            overflow: hidden;
            backdrop-filter: blur(0.5rem);
        }

        .list.border li {
            background: var(--surface-container-low);
        }

        .chip.fill {
            background: var(--surface-container);
            border: 0.125rem solid var(--outline-variant);
            backdrop-filter: blur(1rem);
            transition: all 140ms ease;
        }

        .chip.fill:hover {
            background: var(--surface-container-high);
            transform: translateY(-1px);
        }

        #ticket-details-page .row > div:first-child {
            color: var(--on-surface-variant);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        #ticket-details-page .row > div:last-child {
            font-weight: 500;
        }

        article > header {
            margin-bottom: 1rem;
        }
        article > header h5 {
            font-weight: 600;
            letter-spacing: -0.02em;
        }
        i {
            opacity: 0.8;
        }
        h5,
        h6 {
            letter-spacing: -0.01em;
        }
        button {
            transition: all 120ms ease;
        }
    </style>

    <div class="small-margin">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <small
            style="cursor: pointer;"
            type="button"
            onclick={() =>
                history.length > 1
                    ? history.back()
                    : (window.location.href = "/")}
        >
            <i>keyboard_return</i>
            <span>return to previous page</span>
        </small>
    </div>

    <article class="responsive margin small-padding">
        <header class="center-align">
            <h5 class="max center-align">
                {ticket.route_from} to {ticket.route_to}
            </h5>
            <div class="row center-align">
                <div class="max">
                    <i>today</i>
                    <span>{ticket.ticket_date}</span>
                </div>
                <div class="max">
                    <i>schedule</i>
                    <span>{ticket.ticket_time}</span>
                </div>
            </div>
        </header>
        <div>
            <div class="row">
                <div>seats</div>
                <div id="seats" class="max row scroll">
                    {#each ticket.seats as seat}
                        <button class="chip fill tiny-margin">
                            <i>tatami_seat</i>
                            <span>{seat}</span>
                        </button>
                    {/each}
                </div>
            </div>
            <div class="row">
                <div class="max">Boarding Point</div>
                <div class="max">{ticket.boarding_point}</div>
            </div>
            <div class="row">
                <div class="max">Dropping Point</div>
                <div class="max">{ticket.dropping_point}</div>
            </div>
            <div class="row">
                <button class="max chip fill round tiny-margin">
                    <i>identity_platform</i>
                    <span>{ticket.operator}</span>
                </button>

                <VehicleType type={ticket.vehicle_type} />
            </div>
            <div class="row">
                <div class="max">Asking Price</div>
                <div class="max large">৳{ticket.ticket_price}</div>
            </div>

            <article class="fill">
                <header class="round border">
                    <h6 class="center-align">seller's info</h6>
                </header>
                <div>
                    <ul class="list round border">
                        <li>
                            <button class="circle"
                                >{ticket.seller_name
                                    .charAt(0)
                                    .toUpperCase()}</button
                            >
                            <div class="max">
                                <h6 class="small">{ticket.seller_name}</h6>
                                <div>10 tickets sold</div>
                            </div>
                            <label for="">
                                <span>4.7</span>
                                <i class="fill">star</i>
                            </label>
                        </li>
                        <li>
                            <div class="max">
                                <h6 class="small">{ticket.seller_phone}</h6>
                                <div>WhatsApp also</div>
                            </div>
                            <a href="tel:+88{ticket.seller_phone}">
                                <button>
                                    <i>call</i>
                                    <span>call</span>
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </article>
        </div>
    </article>
</div>
