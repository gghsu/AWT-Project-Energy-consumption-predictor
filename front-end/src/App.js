import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [inputs, setInputs] = useState({
    ds_display_size: "",
    gs_rts: "",
    ds_display_type: "",
    gs_current_mA: "",
    gs_phase_deg: "300", // Default phase_deg set to 300
    ds_vendor_model: "",
    ds_setting_ecomode: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdjust = (field, step, direction) => {
    const currentValue = parseFloat(inputs[field]) || 0;
    let newValue = currentValue;

    if (direction === "increment") {
      newValue = currentValue + step;
    } else {
      newValue = currentValue - step;
    }

    // Validation for negative values
    if (newValue < 0) {
      setError(`${field} cannot be negative`);
      return;
    }

    setInputs((prev) => ({
      ...prev,
      [field]: newValue.toString(),
    }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    for (const [key, value] of Object.entries(inputs)) {
      if (value.trim() === "") {
        setError(`Please fill out the ${key} field.`);
        return;
      }
    }

    // Check for negative values
    if (parseFloat(inputs.gs_rts) < 0) {
      setError("gs_rts cannot be negative");
      return;
    }
    if (parseFloat(inputs.gs_current_mA) < 0) {
      setError("gs_current_mA cannot be negative");
      return;
    }
    if (parseFloat(inputs.gs_phase_deg) < 0) {
      setError("gs_phase_deg cannot be negative");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/predict",
        inputs
      );
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
  };

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
                  <Form.Select
                    name="ds_display_size"
                    value={inputs.ds_display_size}
                    onChange={handleChange}
                  >
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
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleAdjust("gs_rts", 1000, "decrement")}
                    >
                      -1000
                    </Button>
                    <Form.Control
                      type="number"
                      name="gs_rts"
                      value={inputs.gs_rts}
                      onChange={handleChange}
                      className="mx-2"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleAdjust("gs_rts", 1000, "increment")}
                    >
                      +1000
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>ds_display_type</Form.Label>
                  <Form.Select
                    name="ds_display_type"
                    value={inputs.ds_display_type}
                    onChange={handleChange}
                  >
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
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleAdjust("gs_current_mA", 50, "decrement")
                      }
                    >
                      -50
                    </Button>
                    <Form.Control
                      type="number"
                      name="gs_current_mA"
                      value={inputs.gs_current_mA}
                      onChange={handleChange}
                      className="mx-2"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleAdjust("gs_current_mA", 50, "increment")
                      }
                    >
                      +50
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>gs_phase_deg</Form.Label>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleAdjust("gs_phase_deg", 10, "decrement")
                      }
                    >
                      -10
                    </Button>
                    <Form.Control
                      type="number"
                      step="any"
                      name="gs_phase_deg"
                      value={inputs.gs_phase_deg}
                      onChange={handleChange}
                      className="mx-2"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        handleAdjust("gs_phase_deg", 10, "increment")
                      }
                    >
                      +10
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Ds_vendor_model</Form.Label>
                  <Form.Select
                    name="ds_vendor_model"
                    value={inputs.ds_vendor_model}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>ds_setting_ecomode</Form.Label>
                  <Form.Select
                    name="ds_setting_ecomode"
                    value={inputs.ds_setting_ecomode}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">True</option>
                    <option value="0">False</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-3">
              Confirm
            </Button>
          </Form>

          {result && (
            <Alert variant="success" className="mt-3">
              <strong>Prediction Result:</strong>
              <div className="mt-2 p-2 bg-light rounded">
                {Object.entries(result).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mt-3">
              <strong>Error:</strong> {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
