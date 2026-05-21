<script>
    import { supabase } from "$lib/supabaseClient";

    let email = $state("");
    let otp = $state("");
    let step = $state("email"); // 'email' or 'otp'

    async function sendOTP(e) {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (!error) {
            step = "otp";
            ui("#email-confirmation", 3000); // Trigger BeerCSS snackbar
        }
    }

    async function verifyOTP(e) {
        e.preventDefault();
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: "email",
        });
        if (!error) window.location.href = "/";
    }
</script>

<div id="auth-page">
    <header><h5 class="center-align">authentication</h5></header>
    <div>
        {#if step === "email"}
            <article class="page active border round">
                <strong>provide your email</strong>
                <form onsubmit={sendOTP}>
                    <div class="padding">
                        <div class="field label border prefix">
                            <i>mail</i>
                            <input type="email" bind:value={email} required />
                            <label for="">email</label>
                        </div>
                        <button
                            type="submit"
                            class="responsive elevate top-margin"
                            disabled
                        >
                            <i>forward_to_inbox</i><span>send otp</span>
                        </button>
                    </div>
                </form>
            </article>
        {:else}
            <article class="page active border round">
                <strong>check your inbox</strong>
                <form onsubmit={verifyOTP}>
                    <div class="padding">
                        <div class="field label border prefix">
                            <i>password</i>
                            <input type="text" bind:value={otp} required />
                            <label for="">OTP</label>
                        </div>
                        <button
                            type="submit"
                            class="responsive elevate top-margin"
                            disabled
                        >
                            <i>search_check_2</i><span>check otp</span>
                        </button>
                    </div>
                </form>
            </article>
        {/if}
    </div>
</div>
