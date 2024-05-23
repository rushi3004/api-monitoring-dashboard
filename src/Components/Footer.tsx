import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

interface Message {
  user: string;
  text: string;
}

const Footer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      user: 'User',
      text: input,
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate a bot response
    setTimeout(() => {
      const botMessage: Message = {
        user: 'Bot',
        text: `You said: ${newMessage.text}`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className=" text-white p-3 mt-5" style={{
        background: "linear-gradient(90deg, gray 20%, white 100%, rgba(0,212,255,1) 100%)", 
      }} >
      <Container>
        <Row>
          <Col>
            <h5>Chat with us</h5>
            <ListGroup variant="flush">
              {messages.map((message, index) => (
                <ListGroup.Item key={index} className="bg-dark text-white border-0">
                  <strong>{message.user}:</strong> {message.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form.Group className="mt-3">
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="bg-dark text-white"
              />
              <Button variant="light" className="mt-2" onClick={handleSendMessage}>
                Send
              </Button>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p>© 2024 Your Company. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
