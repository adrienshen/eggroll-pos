import React from 'react';
import {Grid, Card, Row, Col, ListGroup, Container} from 'react-bootstrap';

class Receipt extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      receipt: null
    };
  }
  
  componentDidMount () {
    const id = this.props.id;
    fetch(`/r/${id}`)
      .then(res => res.json())
      .then(receipt => this.setState(receipt));
  }
  
  formatCentsToDollars(value) {
    value = (value + '').replace(/[^\d.-]/g, '');
    value = parseFloat(value);
    return value ? value / 100 : 0;
  }
  
  render(){
      if(this.state.receipt === null){
        return (
          <h1>Loading</h1>
          )
      } else {
        return (
          <Card style={{width:'100%'}}>
          <Card.Header><Card.Title className="my-2">Receipt #{this.state.receipt.id}</Card.Title></Card.Header>
          <Card.Body>
              <Row className="mb-3">
                <Col>
                <Card.Text>
                  <span className="font-weight-bolder">Order ID: </span>{this.state.receipt.order_id}
                  </Card.Text>
                </Col>
                </Row>
                <Row className="mb-3">
                <Col>
                <Card.Text>
                  <span className="font-weight-bolder">Amount: </span>${this.formatCentsToDollars(this.state.receipt.total_cents)}
                  </Card.Text>
                </Col>
              </Row>
            <ListGroup variant="flush">
            </ListGroup>
          </Card.Body>
          <Card.Footer>{this.state.receipt.created_at}</Card.Footer>
          </Card>
        );
      }
  }
}

export default function MerchantRoutes(props) {
  return(
    <section>
      Webview for generated receipts
      <Container>
        <Row>
          <Col>
            <Receipt id={props.match.params.id} />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
