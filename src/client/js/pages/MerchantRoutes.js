import React, { useEffect, useState, useCallback } from 'react';
import {Grid, Button, ButtonGroup, ButtonToolbar, Card, Table, Container} from 'react-bootstrap';
import { getTimeUntilPickup } from '../../../shared/orders';
import {getOrders, updateOrderStatus} from '../api/index';
import {CountdownTimer} from '../components';

import {Status} from '../../../shared/orders';
import '../../css/pages/MerchantRoutes.scss'

export default function MerchantRoutes(props) {
  return(
    <section>
      <MerchantOrders />
    </section>
  )
}

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
  }, []);

  console.log('READY ORDERS >> ', orders);
  return <>
        {/* <div>
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
        </div> */}

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

  const onUpdateStatus = useCallback(async status => {
    if (isSendingRequest) return;
    setIsSendingRequest(true);
    await updateOrderStatus({
      orderId: order.orderId,
      status,
    });
    setIsSendingRequest(false);
    location.reload();
  }, [isSendingRequest]);

  console.log('orders >> ', order);
  return <Card style={{marginBottom: '1rem'}}>
    <Card.Header><CountdownTimer text={order.pickupEta}></CountdownTimer></Card.Header>
    <Card.Body>
        <div class="main-panel">
          <h4 id="order-id">ORDER #{order.orderId}</h4>
          <ul className="Order__meta-list">
            <li>CUSTOMER: <span>{order.customerName}</span></li>
            <li>MOBILE PHONE: <span>{order.mobilePhone || 'N/A'}</span></li>
            <li>ORDER TYPE: <span>PICKUP</span></li>
            <li>PAYMENT: <span>IN STORE</span></li>
          </ul>

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
                    <span style={{color: '#999', marginLeft:'.5rem'}}>Comments: {line.comments}</span>
                  </td>
              <td>{(line.priceCents/100).toFixed(2)} {`$`}</td>
                </tr>
              })}
            </tbody>
          </Table>
        </div>
    </Card.Body>
    <Card.Footer>
    {Status.DECLINED === order.status &&
      <div style={{color: "darkred"}}>
        <strong>ORDER HAS BEEN DECLINED</strong>
      </div>
    }
    {Status.READY === order.status &&
      <div style={{color: "darkgreen"}}>
        <strong>ORDER READY FOR PICKUP / DELIVERY</strong>
      </div>
    }
    <ButtonToolbar style={{display: 'flex', justifyContent: 'flex-end'}}>
      {Status.CONFIRMED === order.status &&
      <>
        <Button onClick={() => onUpdateStatus(Status.ACCEPTED)}
          style={{marginRight: '.5rem'}} variant="primary">Accept Order</Button>
        <Button onClick={() => onUpdateStatus(Status.DECLINED)}
          style={{marginRight: '.5rem'}} variant="outline-danger">Decline Order</Button>
      </>}
      {(Status.ACCEPTED === order.status) &&
        <Button onClick={() => onUpdateStatus(Status.PREPARING)}
        style={{marginRight: '.5rem'}} variant="success">Start Preparing</Button>
      }
      {Status.PREPARING === order.status &&
        <Button onClick={() => onUpdateStatus(Status.READY)}
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
