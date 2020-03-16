import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Container, Button, OverlayTrigger, Popover } from "react-bootstrap";

import {
  getCustomerOrderMenu,
  createLineItem,
  completeAddingLineItems,
} from "../api/index";

import "../../css/pages/Menus.scss";
import appleImage from "../../assets/images/apple-placeholder.jpg";
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderUuid: null,
      menuItems: null,
      cart: null,
      order: null
    };
  }

  async componentDidMount() {
    // console.log('IS M EXT RUNNING? ', MessengerExtensions);
    const { orderUuid } = this.props.match.params;
    console.log("order uuid >> ", orderUuid);

    const results = await getCustomerOrderMenu(orderUuid);
    console.log("results from api ", results);

    if (!orderUuid || !results.menuItems || !results.cart || !results.order) {
      throw Error('No order for this UUID');
    }

    this.setState({
      orderUuid,
      menuItems: results.menuItems,
      cart: results.cart,
      order: results.order
    });
  }

  async showCartItems() {

  }

  render() {
    const { orderUuid, menuItems, order, cart } = this.state;
    if (menuItems === null) {
      return <h1>Loading...</h1>;
    }
    return (
      <>
        <header className="Menu__header">
          <div className="Menu__branding">
            <i>
              <span>yum</span>chat.io
            </i>
            <CartPopover
              menuItems={menuItems}
              cart={cart} />
          </div>
          <div className="Menu__merchant-meta">
            <h2>$MERCHANT</h2>
            <p className="mb-0">10:00am - 10:00pm</p>
          </div>
        </header>

        <Container>
          <section style={{ padding: "1rem" }} className="Menu__menu-items">
            {/* <menu>
            <ul>
              <li>Aa</li>
              <li>Bb</li>
              <li>Cc</li>
            </ul>
          </menu> */}
            {menuItems.map((item, i) => (
              <MenuItem
                key={i}
                orderUuid={orderUuid}
                item={item}
              />
            ))}
          </section>
        </Container>

        <PageActions orderUuid={orderUuid} />
      </>
    );
  }
}

function MenuItem({ orderUuid, item }) {
  const [showOptions, setShowOptions] = useState(false);

  const handleClose = () => setShowOptions(false);
  const handleShow = () => setShowOptions(true);

  return (
    <Row>
      <MenuItemOptions
        orderUuid={orderUuid}
        menuItem={item}
        handleClose={handleClose}
        show={showOptions}
      />
      <Card onClick={handleShow} style={{ width: "90%" }} className="mb-2">
        {item.image && (
          <Card.Img width="90%" height="180" variant="top" src={appleImage} />
        )}
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            ${item.price_cents / 100}
          </Card.Subtitle>
          <Card.Text>{item.description.substr(10)}...</Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}

function PageActions({orderUuid}) {
  const closeWebView = () => {

    // Trigger 'confirmOrder' on backend
    completeAddingLineItems(orderUuid);

    const text = 'You may now close this window if it does not close automatically';
    location.href = `https://www.messenger.com/closeWindow/?image_url=https://placekitten.com/g/300/200&display_text=${text}`;
  }

  return <footer className="MenuPageActions">
    <div>
      <span className="MenuPageActions__price">Order Total: $99.99</span>
    </div>
    <div>
      <Button
        onClick={closeWebView}
        className="MenuPageActions__confim">Confirm Order</Button>
    </div>
  </footer>
}

function MenuItemOptions({ orderUuid, menuItem, handleClose, show }) {
  const [quantity, setQuantity] = useState(1);
  const [addItemProgress, setAddItemProgress] = useState(false);

  async function handleAddItem() {
    setAddItemProgress(true);

    // Call API endpoint
    const res = await createLineItem({
      orderUuid,
      menuItemId: menuItem.id,
      comments: '',
      quantity,
    });

    console.log('createLineItem response >> ', res);
    
    // After adding item
    setTimeout(() => {
      if (!res) {
        setAddItemProgress(false);
        return;
      }
  
      setQuantity(1);
      setAddItemProgress(false);
      handleClose();
      location.reload();
    }, 1000);
  }

  function handleSetQuantity(value) {
    if (!Number(value) || value > 10 || value < 1) {
      return;
    }

    setQuantity(value);
  }

  const priceHumanReadable =
    "$" + ((quantity * menuItem.price_cents) / 100).toFixed(2);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{menuItem.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{menuItem.description}</Modal.Body>
        <Modal.Footer>
          <SelectQuantity
            handleSetQuantity={handleSetQuantity}
            quantity={quantity}
          />
          <Button disabled={addItemProgress} variant="primary" onClick={handleAddItem}>
            Add to cart - {priceHumanReadable}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SelectQuantity({ handleSetQuantity, quantity }) {
  return (
    <div className="QuantitySelector">
      <button
        onClick={() => handleSetQuantity(quantity - 1)}
        className="QuantitySelector__btn"
      >
        -
      </button>
      <input
        value={quantity}
        onChange={e => handleSetQuantity(e.target.value)}
        type="number"
        className="QuantitySelector__input"
      />
      <button
        onClick={() => handleSetQuantity(quantity + 1)}
        className="QuantitySelector__btn"
      >
        +
      </button>
    </div>
  );
}

function CartPopover({menuItems, cart}) {
  console.log('menuItems >> ', menuItems)
  if (!menuItems || !menuItems.length || !cart) {
    return null;
  }
  const findMenuItem = id => menuItems.find(i => i.id === id);
  const getTotalItems = cart && cart.lineItems.length
    ? cart.lineItems.reduce((sum, cur) => ({quantity: sum.quantity + cur.quantity}))
    : 0;
  const place = 'bottom';
    return <>
      <OverlayTrigger
        trigger="click"
        key={place}
        placement={place}
        overlay={
          <Popover className="CartItems__list"
            id={`popover-positioned-${place}`}>
            <Popover.Title as="h3">{`Current Order`}</Popover.Title>
            <Popover.Content>
              <ul>
                {cart.lineItems.map(i => {
                  return <li>
                    <span>Item: {findMenuItem(i.menu_item_id).name}</span><br/>
                    <span>Qty: {i.quantity}</span>
                  </li>
                })}
              </ul>
            </Popover.Content>
          </Popover>
        }
      >
        <Button
          variant="secondary"
          className="Menu__cart-icon">
          Cart <span>({getTotalItems.quantity})</span>
        </Button>
      </OverlayTrigger>{' '}
    </>
}
