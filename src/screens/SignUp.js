import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { ArrowLeft, User, Mail, Lock, MapPin } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:4000/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
        }),
      });

      const json = await response.json();

      if (!json.success) {
        setError("Please enter valid details");
      } else {
        setSuccess(true);
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-100"
        style={{ maxWidth: "450px", padding: "0 15px" }}
      >
        <Card className="border-0 shadow">
          <Card.Header className="bg-white border-0 pt-4 pb-0">
            <Card.Title className="fs-2 fw-bold mb-1">Create an account</Card.Title>
            <Card.Subtitle className="text-muted mb-3">
              Enter your information to create your account
            </Card.Subtitle>
          </Card.Header>
          <Card.Body className="px-4 py-4">
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">Account created successfully! Redirecting to login...</Alert>}

              <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><User size={18} /></InputGroup.Text>
                  <Form.Control id="name" name="name" placeholder="John Doe" value={credentials.name} onChange={onChange} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><Mail size={18} /></InputGroup.Text>
                  <Form.Control id="email" name="email" type="email" placeholder="name@example.com" value={credentials.email} onChange={onChange} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><Lock size={18} /></InputGroup.Text>
                  <Form.Control id="password" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={onChange} required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="geolocation">Location</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light"><MapPin size={18} /></InputGroup.Text>
                  <Form.Control id="geolocation" name="geolocation" placeholder="New York, USA" value={credentials.geolocation} onChange={onChange} required />
                </InputGroup>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-2 mt-2" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="bg-white border-0 text-center py-3">
            <p className="text-muted mb-0 small">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none fw-medium">
                <ArrowLeft className="me-1" size={14} /> Sign in
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </motion.div>
    </div>
  );
}
