const { addMinutes, parseJSON } = require('date-fns');

const Status = {
  // chat started by Customer
  STARTED: 'started',
  // confirmed by Customer
  CONFIRMED: 'confirmed',
  // accepted by Merchant, before starting to prepare
  ACCEPTED: 'accepted',
  // declined by Merchant
  DECLINED: 'declined',
  // after accept, preparing order
  PREPARING: 'preparing',
  // ready for pickup
  READY: 'ready',
  // enroute for delivery; currently not implemented
  DELIVERING: 'on_delivery',
};

// These order statuses should be fetched for the main view
// Only show countdown timer on these when less than 10 minutes to ETA
const ACTIVE_ORDER_STATUSES = [
  Status.CONFIRMED,
  Status.ACCEPTED,
  Status.PREPARING,
];

function getTimeUntilPickup(confirmedAt, pickupIn) {
  if (!pickupIn || !confirmedAt) {
    return;
  }

  console.log(confirmedAt);
  const t0 = parseJSON(confirmedAt);
  const t1 = addMinutes(t0, pickupIn);

  console.log(t1);
  // console.log('t1 + pickupdIn>> ', d);
  // console.log('t2 + pickupIn>> ', n2);

  return t1;
}

module.exports = {
  Status,
  getTimeUntilPickup,
}
