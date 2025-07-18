"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { apiCall, API_ENDPOINTS } from "../config/api"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, pendingCartItem, clearPendingCartItem } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (data.success) {
        login(data.authToken, data.user)
        if (pendingCartItem) {
          try {
            await apiCall(API_ENDPOINTS.ADD_TO_CART, {
              method: "POST",
              body: JSON.stringify(pendingCartItem),
            })
            clearPendingCartItem()
          } catch (cartError) {
            console.error("Failed to add pending item to cart:", cartError)
            // Optionally, inform the user that the item could not be added
          }
        }
        const from = location.state?.from?.pathname || "/"
        navigate(from, { replace: true })
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      setError(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card shadow-lg border-0"
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary-custom">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
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
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
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
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary-custom w-100 py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Don't have an account?{" "}
                    <Link to="/createuser" className="text-primary-custom text-decoration-none fw-bold">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
