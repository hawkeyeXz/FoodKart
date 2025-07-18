"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { apiCall, API_ENDPOINTS } from "../config/api"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"

const Profile = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    profilePic: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
      })
    }
  }, [isAuthenticated, navigate, user])

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
    setSuccess("")

    try {
      const data = await apiCall(API_ENDPOINTS.UPDATE_PROFILE, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          phone: formData.phone,
          profilePic: formData.profilePic,
        }),
      })

      if (data.success) {
        updateUser(data.user)
        setSuccess("Profile updated successfully!")
        setIsEditing(false)
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (error) {
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
      phone: user.phone || "",
      profilePic: user.profilePic || "",
    })
    setIsEditing(false)
    setError("")
  }

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />
  }

  return (
    <div className="container my-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="fw-bold mb-4">
          <i className="bi bi-person-circle me-2"></i>
          My Profile
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </div>
        )}

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  <img
                    src={
                      user.profilePic ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                      "/placeholder.svg"
                    }
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                </div>
                <h4 className="fw-bold">{user.name}</h4>
                <p className="text-muted">{user.email}</p>
                <p className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {user.location}
                </p>

                {!isEditing ? (
                  <button className="btn btn-primary-custom w-100" onClick={() => setIsEditing(true)}>
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary-custom" onClick={handleSubmit} disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button className="btn btn-outline-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-header">
                <h6 className="mb-0">Quick Links</h6>
              </div>
              <div className="list-group list-group-flush">
                <a href="/my-orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-bag me-2"></i>
                  My Orders
                </a>
                <a href="/cart" className="list-group-item list-group-item-action">
                  <i className="bi bi-cart me-2"></i>
                  My Cart
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  <i className="bi bi-heart me-2"></i>
                  Favorites
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  <i className="bi bi-geo-alt me-2"></i>
                  Addresses
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mb-3">
                      <label htmlFor="profilePic" className="form-label">
                        Profile Picture URL
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="profilePic"
                        name="profilePic"
                        value={formData.profilePic}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-header">
                <h5 className="mb-0">Account Settings</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-1">Change Password</h6>
                    <small className="text-muted">Update your password regularly</small>
                  </div>
                  <button className="btn btn-outline-primary btn-sm">Change</button>
                </div>

                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-1">Notifications</h6>
                    <small className="text-muted">Manage your notification preferences</small>
                  </div>
                  <button className="btn btn-outline-primary btn-sm">Manage</button>
                </div>

                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <h6 className="mb-1">Delete Account</h6>
                    <small className="text-muted">Permanently delete your account</small>
                  </div>
                  <button className="btn btn-outline-danger btn-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
