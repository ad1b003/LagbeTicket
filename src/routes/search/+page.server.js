import { supabase } from '$lib/supabaseClient';

export async function load({ url }) {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const date = url.searchParams.get('date');
    const type = url.searchParams.get('type');

    let query = supabase
        .from('tickets')
        .select('*')
        .eq('status', 'available')
        .ilike('route_from', from)
        .ilike('route_to', to)
        .eq('ticket_date', date)
        .eq('ticket_for', type)
        .order('created_at', { ascending: false });

    const { data: tickets, error } = await query;
    // console.table(tickets);
    // console.log(from, to, date, type);
    return { tickets: tickets || [], from, to, date, type, error };
}