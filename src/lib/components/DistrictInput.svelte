<script>
    let { id, label, helper, icon, value = $bindable() } = $props();

    const districts = [
        "Bagerhat",
        "Bandarban",
        "Barguna",
        "Barishal",
        "Bhola",
        "Bogura",
        "Brahmanbaria",
        "Chandpur",
        "Chapainawabganj",
        "Chattogram",
        "Chuadanga",
        "Cox's bazar",
        "Cumilla",
        "Dhaka",
        "Dinajpur",
        "Faridpur",
        "Feni",
        "Gaibandha",
        "Gazipur",
        "Gopalganj",
        "Habiganj",
        "Jamalpur",
        "Jashore",
        "Jhalokati",
        "Jhenaidah",
        "Joypurhat",
        "Khagrachhari",
        "Khulna",
        "Kishoreganj",
        "Kurigram",
        "Kushtia",
        "Lakshmipur",
        "Lalmonirhat",
        "Madaripur",
        "Magura",
        "Manikganj",
        "Meherpur",
        "Moulvibazar",
        "Munshiganj",
        "Mymensingh",
        "Naogaon",
        "Narail",
        "Narayanganj",
        "Narsingdi",
        "Natore",
        "Netrokona",
        "Nilphamari",
        "Noakhali",
        "Pabna",
        "Panchagarh",
        "Patuakhali",
        "Pirojpur",
        "Rajbari",
        "Rajshahi",
        "Rangamati",
        "Rangpur",
        "Satkhira",
        "Shariatpur",
        "Sherpur",
        "Sirajganj",
        "Sunamganj",
        "Sylhet",
        "Tangail",
        "Thakurgaon",
    ];

    let showSuggestions = $state(false);

    let filteredDistricts = $derived(
        districts
            .filter((d) => d.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, 5),
    );

    function select(district) {
        value = district;
        showSuggestions = false;
    }
</script>

<div class="field label border prefix">
    <i>{icon}</i>
    <input
        type="text"
        {id}
        bind:value
        oninput={() => (showSuggestions = true)}
        onblur={() => setTimeout(() => (showSuggestions = false), 200)}
    />
    <label for={id}>{label}</label>
    {#if helper}<output class="helper">{helper}</output>{/if}

    {#if showSuggestions && value && filteredDistricts.length > 0}
        <div class="suggestion-box">
            {#each filteredDistricts as dist}
                <button
                    type="button"
                    class="chip round"
                    onclick={() => select(dist)}>{dist}</button
                >
            {/each}
        </div>
    {/if}
</div>
