"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import "../styles/Auth.css"

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
      const response = await fetch("{API_URL}/api/auth/login", {
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

        // Store user data in localStorage
        if (json.user) {
          localStorage.setItem("userData", JSON.stringify(json.user))
        }

        // Dispatch a storage event to notify other components about the login
        window.dispatchEvent(new Event("storage"))
        navigate("/")
      }
    } catch (error) {
      console.error("Login error:", error)
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
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Enter your credentials to sign in</p>
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

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <Link to="/forgot-password" className="text-decoration-none small">
                  Forgot password?
                </Link>
              </div>
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
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p className="text-muted mb-0 small">
            Don't have an account?{" "}
            <Link to="/createuser" className="text-decoration-none fw-medium">
              Sign up <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

