import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [inputs, setInputs] = useState({
    ds_display_size: "",
    gs_rts: "",
    ds_display_type: "",
    gs_current_mA: "",
    gs_phase_deg: "",
    ds_vendor_model: "",
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

    if (parseFloat(inputs.gs_phase_deg) < 0) {
      setError("Gs_phase_deg cannot be negative");
      return;
    }

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
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>ds_display_size</Form.Label>
                  <Form.Select name="ds_display_size" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="55">55</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>gs_rts</Form.Label>
                  <Form.Control type="number" name="gs_rts" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>ds_display_type</Form.Label>
                  <Form.Select name="ds_display_type" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>gs_current_mA</Form.Label>
                  <Form.Control type="number" name="gs_current_mA" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>gs_phase_deg</Form.Label>
                  <Form.Control type="number" step="any" name="gs_phase_deg" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Ds_vendor_model</Form.Label>
                  <Form.Select name="ds_vendor_model" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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
