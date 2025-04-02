"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "../styles/Profile.css"
import API_URL from "../config/api"

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    profilePic: "",
  })

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    if (!token) {
      navigate("/login")
      return
    }

    // Fetch user data
    fetchUserData()
  }, [navigate])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/auth/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          location: data.user.location || "",
          phone: data.user.phone || "",
          profilePic: data.user.profilePic || "",
        })

        // Update localStorage with latest user data
        localStorage.setItem("userData", JSON.stringify(data.user))
      } else {
        setError(data.message || "Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to load user data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/auth/updateprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          phone: formData.phone,
          profilePic: formData.profilePic,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setSuccess("Profile updated successfully!")
        setIsEditing(false)

        // Update localStorage with latest user data
        localStorage.setItem("userData", JSON.stringify(data.user))

        // Trigger storage event to update navbar
        window.dispatchEvent(new Event("storage"))

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 3000)
      } else {
        setError(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container my-4">
        <h2 className="profile-title">
          <i className="bi bi-person-circle me-2"></i> My Profile
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close float-end"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
            <button
              type="button"
              className="btn-close float-end"
              onClick={() => setSuccess(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your profile...</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="profile-sidebar">
                <div className="profile-image-container">
                  <img
                    src={
                      user?.profilePic ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt={user?.name}
                    className="profile-image"
                  />
                  {isEditing && (
                    <div className="profile-image-edit">
                      <input
                        type="text"
                        className="form-control form-control-sm mt-2"
                        placeholder="Enter image URL"
                        name="profilePic"
                        value={formData.profilePic}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>

                <div className="profile-actions">
                  {!isEditing ? (
                    <button className="btn btn-primary w-100" onClick={() => setIsEditing(true)}>
                      <i className="bi bi-pencil me-2"></i> Edit Profile
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: user.name || "",
                            email: user.email || "",
                            location: user.location || "",
                            phone: user.phone || "",
                            profilePic: user.profilePic || "",
                          })
                        }}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-primary flex-grow-1" onClick={handleSubmit}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-menu">
                  <a href="/my-orders" className="profile-menu-item">
                    <i className="bi bi-bag"></i> My Orders
                  </a>
                  <a href="/cart" className="profile-menu-item">
                    <i className="bi bi-cart"></i> My Cart
                  </a>
                  <a href="#" className="profile-menu-item">
                    <i className="bi bi-heart"></i> Favorites
                  </a>
                  <a href="#" className="profile-menu-item">
                    <i className="bi bi-geo-alt"></i> Saved Addresses
                  </a>
                  <a href="#" className="profile-menu-item">
                    <i className="bi bi-credit-card"></i> Payment Methods
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="profile-content">
                <div className="profile-section">
                  <h4 className="section-title">Personal Information</h4>

                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
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
                          required
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
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
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="profile-section">
                  <h4 className="section-title">Recent Orders</h4>
                  <div className="recent-orders">
                    <div className="text-center py-3">
                      <a href="/my-orders" className="btn btn-outline-primary">
                        <i className="bi bi-bag me-2"></i> View All Orders
                      </a>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h4 className="section-title">Account Settings</h4>
                  <div className="account-settings">
                    <div className="setting-item">
                      <div>
                        <h5>Change Password</h5>
                        <p className="text-muted">Update your password regularly to keep your account secure</p>
                      </div>
                      <button className="btn btn-outline-primary">Change</button>
                    </div>

                    <div className="setting-item">
                      <div>
                        <h5>Notification Preferences</h5>
                        <p className="text-muted">Manage your email and push notification settings</p>
                      </div>
                      <button className="btn btn-outline-primary">Manage</button>
                    </div>

                    <div className="setting-item">
                      <div>
                        <h5>Delete Account</h5>
                        <p className="text-muted">Permanently delete your account and all data</p>
                      </div>
                      <button className="btn btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

