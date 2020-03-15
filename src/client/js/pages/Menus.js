import React, {useState, useEffect} from "react";
import {Card, Row, Col, Modal, Container, Button} from "react-bootstrap";
import '../../css/pages/Menus.scss';
import appleImage from '../../assets/images/apple-placeholder.jpg';
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: null
    };
  }

  componentDidMount() {
    fetch(`/api/merchants/${this.props.match.params.merchantId}/menu`)
      .then(res => res.json())
      .then(menu => this.setState(menu));
  }

  render() {
    if (this.state.menu == null) {
      return <h1>Loading...</h1>;
    }
    return (
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <header className="Menu__header">
              <i>
                <span>yum</span>chat.io
              </i>
              <h2>$MERCHANT</h2>
              <p className="mb-0">10:00am - 10:00pm</p>
            </header>

            <section style={{padding: '1rem',}}
              className="Menu__menu-items">
              {/* <menu>
                <ul>
                  <li>Aa</li>
                  <li>Bb</li>
                  <li>Cc</li>
                </ul>
              </menu> */}
              {this.state.menu.map((item, i) => (
                <MenuItem key={i} item={item} />
              ))}
            </section>
          </Col>
        </Row>
      </Container>
    );
  }
}

function MenuItem({ item }) {
  const [showOptions, setShowOptions] = useState(false);

  const handleClose = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  return (
    <Row>
      <MenuItemOptions
        menuItem={item}
        handleClose={handleClose} show={showOptions} />
      <Card onClick={handleShow}
        style={{ width: "90%" }} className="mb-2">
        {item.image && <Card.Img width="90%" height="180" variant="top" src={appleImage} />}
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            ${item.price_cents/100}
          </Card.Subtitle>
          <Card.Text>{item.description.substr(10)}...</Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}

function MenuItemOptions({menuItem, handleClose, show}) {
  const [quantity, setQuantity] = useState(1);

  function handleSetQuantity(value) {
    if (!Number(value) || value > 10 || value < 1) {
      return;
    }

    setQuantity(value);
  }

  const priceHumanReadable = '$' + ((quantity * menuItem.price_cents) / 100).toFixed(2);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {menuItem.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {menuItem.description}
        </Modal.Body>
        <Modal.Footer>
          <SelectQuantity handleSetQuantity={handleSetQuantity} quantity={quantity} />
          <Button variant="primary" onClick={handleClose}>
            Add to cart - {priceHumanReadable}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SelectQuantity({handleSetQuantity, quantity}) {
  return <div className="QuantitySelector">
    <button
      onClick={() => handleSetQuantity(quantity - 1)}
      className="QuantitySelector__btn">-</button>
    <input
      value={quantity}
      onChange={e => handleSetQuantity(e.target.value)}
      type="number" className="QuantitySelector__input" />
    <button
      onClick={() => handleSetQuantity(quantity + 1)}
      className="QuantitySelector__btn">+</button>
  </div>
}
