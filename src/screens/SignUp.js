"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import "../styles/Auth.css"

export default function SignUp() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("{API_URL}/api/auth/createuser", {
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
      })

      const json = await response.json()

      if (!json.success) {
        setError("Please enter valid details")
      } else {
        setSuccess(true)
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login")
        }, 2000)
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
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Enter your information to create your account</p>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="alert alert-danger"
              >
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="alert alert-success"
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                Account created successfully! Redirecting to login...
              </motion.div>
            )}

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={credentials.name}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={credentials.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
              </div>
              <small className="form-text text-muted">Password must be at least 8 characters long</small>
            </div>

            <div className="mb-4">
              <label htmlFor="geolocation" className="form-label">
                Location
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-geo-alt"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="geolocation"
                  name="geolocation"
                  placeholder="New York, USA"
                  value={credentials.geolocation}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Create account
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p className="text-muted mb-0 small">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-medium">
              <i className="bi bi-arrow-left me-1"></i> Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

