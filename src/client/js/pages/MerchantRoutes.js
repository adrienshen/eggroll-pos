import React, { useEffect, useState } from 'react';
import {Grid, Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import { getTimeUntilPickup } from '../../../shared/orders';
import {getOrders} from '../api/index';

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
        <div class='nav nav-pills navbar-expand-sm navbar-dark bg-primary'>
            <div class='user-profile'>
                <img class="profile-pic" src="default-profile-picture-clipart.jpg" />
                <a class="user-account">LiGongHo</a>
            </div>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Sales</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Settings</a>
                </li>
            </ul>
        </div>

        {orders && Object.keys(orders).map(k => {
          return <OrderCard order={orders[k]} />;
        })}
  </>
}

function OrderCard({order}) {
  return <section>
    <section class="lt-15"></section>
    <h3>{order.pickupEta}</h3>
    <div class="order bg-light clearfix">
        <div class="left-panel">
            <button type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="main-panel">
          <h4 id="order-id">{order.uuid}</h4>
            <dl class="list-unstyled">
                <dt id="item-1">avocado BBT</dt>
                    <dd>50%</dd>
                    <dd>pearls</dd>
            </dl>
            <h5 id="item-2">brown sugar BBT</h5>
                <ul>
                    <li>0%</li>
                    <li>coffee pearls</li>
                </ul>
        </div>
        <div class="right-panel">
            <button type="button" class="btn btn-primary">$12.99</button>
        </div>
    </div>
  </section>
}

function CountdownTimer() {
  return <section>

  </section>
}

function StatusUpdates() {

}

function AcceptOrDeclineOrder({status}) {
  if (status !== 'confirmed') return null;
  <ButtonToolbar>
    
  </ButtonToolbar>
}
