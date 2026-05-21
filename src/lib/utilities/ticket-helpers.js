export function validateTicketForm(state, seats) {
    const today = new Date().toISOString().split('T')[0];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^01[0-9]{9}$/;

    if (state.routeFrom.toLowerCase() === state.routeTo.toLowerCase()) return "Route from and to cannot be the same.";
    if (state.boardingPoint.toLowerCase() === state.droppingPoint.toLowerCase()) return "Boarding point and dropping point cannot be same.";
    if (state.ticketDate < today) return "Ticket date cannot be in the past.";
    if (seats.length === 0) return "Add at least one seat.";
    if (state.ticketPrice <= 0) return "Ticket price cannot be negative or zero.";
    if (!emailRegex.test(state.email)) return "Invalid email format.";
    if (!phoneRegex.test(state.phone)) return "Invalid mobile number. Must be 11 digits starting with 01.";

    return null; // Null means no errors
}

// Maps strict camelCase frontend state to Postgres snake_case
export function buildTicketPayload(state, seats, charge) {
    return {
        ticket_for: state.ticketFor,
        route_from: state.routeFrom.trim().charAt(0).toUpperCase() + state.routeFrom.trim().slice(1).toLowerCase(),
        route_to: state.routeTo.trim().charAt(0).toUpperCase() + state.routeTo.trim().slice(1).toLowerCase(),
        ticket_date: state.ticketDate,
        ticket_time: state.ticketTime,
        seats: seats,
        boarding_point: state.boardingPoint.trim(),
        dropping_point: state.droppingPoint.trim(),
        operator: state.operator.trim(),
        vehicle_type: state.vehicleType,
        ticket_price: state.ticketPrice,
        ticket_charge: charge,
        seller_name: state.name.trim(),
        seller_phone: state.phone.trim(),
        seller_email: state.email.trim()
    };
}