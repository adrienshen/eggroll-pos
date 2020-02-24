import React from "react";
import {Container, Form, Row, Col, Button} from "react-bootstrap";

export default function ContactForm(props) {
  return (
    <Container className="contact-form">
      <Row>
        <Col sm={12} md={8}>
          <Form method="POST" action="/api/contact">
            <h3>Get your spot for our Beta release. Positions limited!</h3>
            <Form.Group controlId="ContactForm.Name">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" type="text" placeholder="John Smith" />
            </Form.Group>
            <Form.Group controlId="ContactForm.Email">
              <Form.Label>Business Email</Form.Label>
              <Form.Control name="email" type="email" placeholder="example@email.com" />
            </Form.Group>
            <Form.Group controlId="ContactForm.Website">
              <Form.Label>Business Website (if applicable)</Form.Label>
              <Form.Control name="website" type="text" placeholder="www.youbusiness.com" />
            </Form.Group>
            <Form.Group controlId="ContactForm.Description">
              <Form.Label>Describe your restaurant or cafe</Form.Label>
              <Form.Control name="description" as="textarea" rows="5" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
