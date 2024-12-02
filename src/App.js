import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [inputs, setInputs] = useState({
    id: '',
    startDate: '',
    endDate: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Submitted:', inputs);

    try {
      //you should replace with the API url
      const response = await axios.post('https://api.example.com/predict', inputs);
      setResult(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Energy Consumption Predictor</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                placeholder="Enter ID"
                value={inputs.id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={inputs.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={inputs.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Confirm
            </Button>
          </Form>

          {result && (
            <Alert variant="success" className="mt-3">
              <strong>Result:</strong> {JSON.stringify(result)}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
