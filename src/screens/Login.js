import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Form, Button, Card, Alert, InputGroup, Container, Row, Col } from "react-bootstrap"
import { ArrowRight, Mail, Lock } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:4000/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const json = await response.json()

      if (!json.success) {
        setError("Invalid credentials. Please try again.")
      } else {
        localStorage.setItem("authToken", json.authToken)
        console.log(localStorage.getItem("authToken"))
        navigate("/home") // Redirect on success
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-white border-0 text-center pt-4 pb-0">
                <Card.Title className="fs-2 fw-bold">Welcome back</Card.Title>
                <Card.Subtitle className="text-muted mb-3">Enter your credentials to sign in</Card.Subtitle>
              </Card.Header>
              <Card.Body className="px-4 py-4">
                <Form onSubmit={handleSubmit}>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                      <Alert variant="danger" className="mb-4">
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <Mail size={18} />
                      </InputGroup.Text>
                      <Form.Control id="email" name="email" type="email" placeholder="name@example.com" value={credentials.email} onChange={onChange} required />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <Form.Label htmlFor="password" className="mb-0">Password</Form.Label>
                      <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link>
                    </div>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <Lock size={18} />
                      </InputGroup.Text>
                      <Form.Control id="password" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={onChange} required />
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100 py-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-center py-3">
                <p className="text-muted mb-0 small">
                  Don't have an account?{" "}
                  <Link to="/createuser" className="text-decoration-none fw-medium">
                    Sign up <ArrowRight className="ms-1" size={14} />
                  </Link>
                </p>
              </Card.Footer>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}
