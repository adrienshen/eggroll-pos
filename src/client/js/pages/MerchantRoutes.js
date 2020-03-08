import React, { useEffect, useState } from 'react';
import {Grid, Button, ButtonGroup, ButtonToolbar, Card, Table, Container} from 'react-bootstrap';
import { getTimeUntilPickup } from '../../../shared/orders';
import {getOrders, acceptOrder} from '../api/index';

import {Status} from '../../../shared/orders';

export default function MerchantRoutes(props) {
  return(
    <section>
      Put your /merchant webview routes here
      see: ReactRouter V4/5

      <MerchantOrders />
    </section>
  )
}

const orders = [
  {
    id: 1,
    merchant_id: 3,
    customer_id: 1,
    pickup_time: '2020-03-08 04:02:23.758982+08', // Should be calculated in backend app from `pickup_in` and `confirmed_at`
    status: 'confirmed',
  }
]

console.log(getTimeUntilPickup('2020-03-08 07:00:23.758982+08', 15));

function MerchantOrders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {

    async function fetchOrders() {
      const MERCHANT_ID = 3;
      const results = await getOrders(MERCHANT_ID, {});
      // console.log('GOT ORDERS >> ', results);
      setOrders(results);
    }

    fetchOrders();

    // return () => {
    //   effect
    // };
  }, [])

  console.log('READY ORDERS >> ', orders);
  return <>
        <div>
            <div class='user-profile'>
              <a class="user-account">Merchant Dashboard</a>
            </div>
            <ul class="navbar-nav">
              <li class="nav-item">
                  <a class="nav-link" href="#">Orders</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#">Settings</a>
              </li>
            </ul>
        </div>

        <Container>
          {orders && Object.keys(orders).map(k => {
            return <OrderCard order={orders[k]} />;
          })}
        </Container>
  </>
}

function OrderCard({
  order
}) {

  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const accept = useCallback(async () => {
    if (isSendingRequest) return;

    setIsSending(true);

    await acceptOrder(order.orderId);

    setIsSending(false);
  }, [setIsSendingRequest]);

  console.log('orders >> ', order);
  return <Card>
    <Card.Header>Pickup ETA (needs formating): {order.pickupEta}</Card.Header>
    <Card.Body>
        <div class="main-panel">
          <h4 id="order-id">ORDER #{order.orderId}</h4>
          <span>Customer: {order.customerName}</span>
          <span>Type: Pickup</span>
          <span>Payment: Onsite</span>


          <Table size="sm">
            <thead>
              {/* <tr>
                <th>Qty #</th>
                <th>Item name</th>
                <th>Price</th>
              </tr> */}
            </thead>
            <tbody>
              {order.lineItems.map(line => {
                return <tr>
                  <td>{line.quantity}</td>
                  <td>
                    <strong>{line.name}</strong><br/>
                    <span style={{color: '#999', marginLeft:'.5rem'}}>{line.comments}</span>
                  </td>
                  <td>{line.priceCents}</td>
                </tr>
              })}
            </tbody>
          </Table>
        </div>
    </Card.Body>
    <Card.Footer>
    <ButtonToolbar style={{display: 'flex', justifyContent: 'flex-end'}}>
      {Status.CONFIRMED === order.status &&
      <>
        <Button onClick={acceptOrder}
          style={{marginRight: '.5rem'}} variant="primary">Accept Order</Button>
        <Button onClick={declineOrder}
          style={{marginRight: '.5rem'}} variant="outline-danger">Decline Order</Button>
      </>}
      {Status.PREPARING === order.status &&
        <Button onClick={finishOrdering}
          variant="success">Finished Preparing</Button>}
    </ButtonToolbar>
    </Card.Footer>
  </Card>
}

// @todo: @geno
function CountdownTimer() {
  return <section>

  </section>
}

function StatusUpdates() {

}

function AcceptOrDeclineOrder({status}) {
  if (status !== Status.CONFIRMED) return null;
  <ButtonToolbar>
    
  </ButtonToolbar>
}
