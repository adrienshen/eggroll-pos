import React from "react";
import {Container, Form, Row, Col, Button} from "react-bootstrap";

export default function DisplayOrder(props) {
    {}
  return (
    <Container className="Order bg-light clearfix">
    <div className="left-panel">
        <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div className="main-panel">
        <h4 id="order-id">lgh-tpy-123875</h4>
        <dl className="list-unstyled">
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
    <div className="right-panel">
        <button type="button" className="btn btn-primary">$12.99</button>
    </div>
    </Container>
  );
}
