import React from 'react';
import {Grid, Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import { getTimeUntilPickup } from '../../../shared/orders';

export default function MerchantRoutes(props) {
  return(
    <section>
      Put your /merchant webview routes here
      see: ReactRouter V4/5

      <MerchantContent />
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

function MerchantContent() {
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
  </>
}

function OrderCard() {
  return <section>

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
