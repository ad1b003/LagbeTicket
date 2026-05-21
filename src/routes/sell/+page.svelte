<script>
    import { goto } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient";
    import DistrictInput from "$lib/components/DistrictInput.svelte";
    import {
        validateTicketForm,
        buildTicketPayload,
    } from "$lib/utilities/ticket-helpers";

    // Strict camelCase for frontend state
    let formState = $state({
        ticketFor: "bus",
        routeFrom: "",
        routeTo: "",
        ticketDate: "",
        ticketTime: "",
        boardingPoint: "",
        droppingPoint: "",
        operator: "",
        vehicleType: "ac",
        ticketPrice: "",
        name: "",
        phone: "",
        email: "",
    });

    let seats = $state([]);
    let newSeat = $state("");

    // UI Feedback State
    let errorMsg = $state("");
    let toastMsg = $state("");
    let otpCode = $state("");
    let isSubmitting = $state(false);
    let isVerifying = $state(false);

    // Dynamic charge calculation (5%)
    let charge = $derived(
        formState.ticketPrice ? Math.round(formState.ticketPrice * 0.05) : 0,
    );

    function addSeat() {
        if (newSeat.trim()) {
            seats = [...seats, newSeat.trim().toUpperCase()];
            newSeat = "";
        }
    }

    function removeSeat(index) {
        seats = seats.filter((_, i) => i !== index);
    }

    function showToast(message) {
        toastMsg = message;
        ui("#notification-toast", 3000); // BeerCSS Toast Trigger
    }

    // Step 1: Validate and Trigger OTP
    async function handleInitialSubmit(e) {
        e.preventDefault();
        isSubmitting = true;

        const validationError = validateTicketForm(formState, seats);
        if (validationError) {
            errorMsg = validationError;
            isSubmitting = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        errorMsg = "";

        // Send OTP via Supabase
        const { error } = await supabase.auth.signInWithOtp({
            email: formState.email,
        });

        if (error) {
            errorMsg = "Failed to send OTP: " + error.message;
            window.scrollTo({ top: 0, behavior: "smooth" });
            isSubmitting = false;
        } else {
            showToast("OTP sent to your email!");
            ui("#otp-dialog");
            isSubmitting = false;
        }
    }

    // Step 2: Verify OTP and Post Ticket
    async function verifyAndPostTicket(e) {
        e.preventDefault();
        isVerifying = true;

        // Verify the OTP
        const { error: authError } = await supabase.auth.verifyOtp({
            email: formState.email,
            token: otpCode,
            type: "email",
        });

        if (authError) {
            showToast("Invalid OTP. Please try again.");
            isVerifying = false;
            return;
        }

        // OTP Valid -> Insert Ticket
        const payload = buildTicketPayload(formState, seats, charge);
        const { data, error: dbError } = await supabase
            .from("tickets")
            .insert([payload])
            .select()
            .single();

        // 4. Handle response
        if (dbError) {
            showToast("Failed to post ticket: " + dbError.message);
            isVerifying = false;
        } else {
            showToast("Ticket posted successfully!");
            setTimeout(() => {
                goto(`/ticket/${data.id}`);
            }, 300);
        }
    }
</script>

<div id="ticket-sell-form-page">
    <div class="small-margin">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <small style="cursor: pointer;" onclick={() => history.back()}>
            <i>keyboard_return</i>
            <span>return to previous page</span>
        </small>
    </div>

    {#if errorMsg}
        <div class="row red1 round tiny-margin small-padding">
            <i class="red-text">error</i><span class="wrap">{errorMsg}</span>
        </div>
    {/if}

    <article class="responsive margin small-padding">
        <form onsubmit={handleInitialSubmit}>
            <header class="row">
                <h5 class="max center-align">sell tickets</h5>
                <div class="max field label border suffix">
                    <select bind:value={formState.ticketFor}>
                        <option value="bus">bus</option>
                        <option value="train">train</option>
                    </select>
                    <label for="">for</label><i>arrow_drop_down</i>
                </div>
            </header>

            <div>
                <div class="grid">
                    <div class="s12 m6 l6">
                        <DistrictInput
                            id="route-from"
                            label="from"
                            icon="home"
                            bind:value={formState.routeFrom}
                        />
                    </div>
                    <div class="s12 m6 l6">
                        <DistrictInput
                            id="route-to"
                            label="to"
                            icon="location_away"
                            bind:value={formState.routeTo}
                        />
                    </div>
                </div>

                <div class="grid">
                    <div class="s12 m6 l6 field label border prefix">
                        <i>today</i>
                        <input
                            type="date"
                            bind:value={formState.ticketDate}
                            required
                        />
                        <label for="">date</label>
                    </div>
                    <div class="s12 m6 l6 field label border prefix">
                        <i>schedule</i>
                        <input
                            type="time"
                            bind:value={formState.ticketTime}
                            required
                        />
                        <label for="">time</label>
                    </div>
                </div>

                <div class="grid">
                    <div class="s12 m6 l6">
                        <div id="seats" class="row scroll">
                            {#each seats as seat, index}
                                <button
                                    type="button"
                                    class="chip fill tiny-margin"
                                    onclick={() => removeSeat(index)}
                                >
                                    <i>tatami_seat</i>
                                    <span>{seat}</span>
                                    <i>close</i>
                                </button>
                            {/each}
                        </div>
                    </div>
                    <div class="s12 m6 l6 row">
                        <div class="max field label border prefix">
                            <i>tatami_seat</i>
                            <input
                                type="text"
                                bind:value={newSeat}
                                autocapitalize="words"
                            />
                            <label for="">seat</label>
                        </div>
                        <button type="button" class="square" onclick={addSeat}>
                            <i class="fill">add_circle</i>
                        </button>
                    </div>
                </div>

                <div class="grid">
                    <div class="s12 m6 l6 field label border prefix">
                        <i>home</i>
                        <input
                            type="text"
                            bind:value={formState.boardingPoint}
                            autocapitalize="words"
                            required
                        />
                        <label for="">boarding-point</label>
                    </div>
                    <div class="s12 m6 l6 field label border prefix">
                        <i>location_away</i>
                        <input
                            type="text"
                            bind:value={formState.droppingPoint}
                            autocapitalize="words"
                            required
                        />
                        <label for="">dropping-point</label>
                    </div>
                </div>

                <div class="grid">
                    <div class="s12 m6 l6 field label border prefix">
                        <i>identity_platform</i>
                        <input
                            type="text"
                            bind:value={formState.operator}
                            autocapitalize="words"
                            required
                        />
                        <label for="">operator</label>
                    </div>
                    <div class="s12 m6 l6 field label border suffix">
                        <select bind:value={formState.vehicleType}>
                            <option value="ac">ac</option>
                            <option value="local-ac">local-ac</option>
                            <option value="non-ac">non-ac</option>
                            <option value="sleeper">sleeper</option>
                        </select>
                        <label for="">vehicle type</label>
                        <i>arrow_drop_down</i>
                    </div>
                </div>

                <div class="grid">
                    <div class="s12 m6 l6 field label border prefix">
                        <i>sell</i>
                        <input
                            type="number"
                            bind:value={formState.ticketPrice}
                            required
                        />
                        <label for="">asking-price</label>
                    </div>
                    <div class="s12 m6 l6 field label border prefix">
                        <i>payments</i>
                        <input type="text" value={charge} readonly="readonly" />
                        <label for="">charge</label>
                    </div>
                </div>

                <h6 class="center-align">seller's info</h6>
                <div class="row">
                    <div class="max field label border prefix">
                        <i>person</i>
                        <input
                            type="text"
                            bind:value={formState.name}
                            autocapitalize="words"
                            required
                        />
                        <label for="">name</label>
                    </div>
                </div>
                <div class="grid">
                    <div class="s12 m6 l6 field label border prefix">
                        <i>call</i>
                        <input
                            type="tel"
                            bind:value={formState.phone}
                            required
                        />
                        <label for="">mobile</label>
                    </div>
                    <div class="s12 m6 l6 field label border prefix">
                        <i>mail</i>
                        <input
                            type="email"
                            bind:value={formState.email}
                            required
                        />
                        <label for="">email</label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                class="btn responsive fill primary border small-margin"
                disabled={isSubmitting}
            >
                {#if isSubmitting}
                    <i>hourglass_empty</i>
                    <span>sending...</span>
                {:else}
                    <i>forward_to_inbox</i>
                    <span>verify & post</span>
                {/if}
            </button>
        </form>
    </article>

    <dialog popover id="otp-dialog">
        <header class="row">
            <h5 class="max">Verify Your Email</h5>
            <button class="transparent square" data-ui="#otp-dialog">
                <i>cancel</i>
            </button>
        </header>
        <div class="padding">
            <p>
                We sent a code to <strong>{formState.email}</strong>. Enter it
                below to authorize this listing.
            </p>
            <form onsubmit={verifyAndPostTicket}>
                <div class="field label border prefix">
                    <i>password</i>
                    <input type="text" bind:value={otpCode} required />
                    <label for="">OTP Code</label>
                </div>
                <button
                    type="submit"
                    class="responsive elevate top-margin btn primary"
                    disabled={isVerifying}
                >
                    {#if isVerifying}
                        <i>hourglass_empty</i>
                        <span>posting...</span>
                    {:else}
                        <i>check_circle</i>
                        <span>post ticket</span>
                    {/if}
                </button>
            </form>
        </div>
    </dialog>

    <div id="notification-toast" class="snackbar bottom" popover>
        <i class="round primary">info</i>
        <span>{toastMsg}</span>
    </div>
</div>
