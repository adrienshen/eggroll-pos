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
      if(this.state.receipt === null || this.state.lineItems === null){
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
              <Row>
                <Col>
                  <h3>Products bought:</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup variant="flush">
                    {this.state.lineItems.map((item,i) => 
                      <ListGroup.Item key={i}>
                        <Col>
                          <Row>
                            <Col>
                              Name:
                            </Col>
                            <Col>
                              {item.name}
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              Description:
                            </Col>
                            <Col>
                              {item.description}
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              Price:
                            </Col>
                            <Col>
                              ${this.formatCentsToDollars(item.price_cents)}
                            </Col>
                          </Row>
                        </Col>
                      </ListGroup.Item>)}
                  </ListGroup>
                </Col>
              </Row>
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
