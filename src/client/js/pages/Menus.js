import React from 'react';
import {Grid, Card, Row, Col, ListGroup, Container} from 'react-bootstrap';

class Menu extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      menu: null
    };
  }

  componentDidMount () {
    const id = this.props.id;
    console.log(id)
    fetch(`/api/merchants/${id}/menu`)
      .then(res => res.json())
      .then(menu => this.setState(menu));
  }

  formatCentsToDollars(value) {
    value = (value + '').replace(/[^\d.-]/g, '');
    value = parseFloat(value);
    return value ? value / 100 : 0;
  }

  render(){
    if(this.state.menu == null){
      return(
        <h1>Loading</h1>
      )
    } else{
    return (
    <Container>
      <Row>
        <Col md={{span:6,offset:3}}>
          <Row>
            <Col className="text-center">
              <p>LOGO HERE</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col className="text-center">
                  <h1>MERCHANT NAME</h1>
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  <p className="mb-0">MERCHANT HOURS</p>
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                  <p>Ratings?</p>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              {this.state.menu.map((item,i) =>
                <Row>
                <Card style={{ width: '100%' }} className="mb-2">
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">${this.formatCentsToDollars(item.price_cents)}</Card.Subtitle>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Row>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )}
}
}

export default function Menus(props) {
  return(
    <section>
      <Container>
        <Row>
          <Col>
            <Menu id={props.match.params.merchantId} />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
