const { format, subDays, addMinutes, parseJSON, formatDistanceStrict, isFuture } = require('date-fns');

const Status = {
  STARTED: 'started', // chat started by Customer
  CONFIRMED: 'confirmed', // confirmed by Customer
  PREPARING: 'preparing', // after accept, preparing order
  READY: 'ready', // ready for pickup
  DELIVERING: 'on_delivery', // enroute for delivery
  DECLINED: 'declined' // declined by Merchant
};

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