import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import ContactForm from '../components/ContactForm';

export default function HomeLanding(props) {
  return(
    <div>
      <Container className="hero">
        <h1>Reach your customers through Chat, Get more sales!</h1>
        <div>
          <ContactForm />
        </div>
      </Container>
    </div>
  )
}
