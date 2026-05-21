import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    // params.id comes from the folder name [id]
    const { data: ticket, error: dbError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', params.id)
        .single();

    if (dbError || !ticket) {
        // SvelteKit's built-in way to trigger a 404 error page
        error(404, 'Ticket not found');
    }

    return { ticket };
}