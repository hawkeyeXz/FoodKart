"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

export default function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuth()

    // Add event listener for storage changes (in case of login/logout in another tab)
    window.addEventListener("storage", checkAuth)

    // Add click event listener to close profile menu when clicking outside
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("storage", checkAuth)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      setIsLoggedIn(true)
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  const handleClickOutside = (event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    setIsLoggedIn(false)
    setUser(null)
    setShowProfileMenu(false)
    navigate("/")
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-2" to="/">
          <i className="bi bi-basket-fill me-2"></i>
          FoodKart
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fs-5" aria-current="page" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/my-orders">
                    <i className="bi bi-bag-check me-1"></i> My Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/cart">
                    <i className="bi bi-cart3 me-1"></i> My Cart
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-light me-2" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link className="btn btn-success" to="/createuser">
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </Link>
              </>
            ) : (
              <div className="profile-container" ref={profileMenuRef}>
                <div className="profile-icon" onClick={toggleProfileMenu}>
                  {user?.profilePic ? (
                    <img src={user.profilePic || "/placeholder.svg"} alt={user.name} className="profile-image" />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                </div>

                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-header">
                      <div className="profile-pic">
                        {user?.profilePic ? (
                          <img src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                        ) : (
                          <i className="bi bi-person-circle"></i>
                        )}
                      </div>
                      <div className="profile-info">
                        <h6>{user?.name || "User"}</h6>
                        <p>{user?.email || ""}</p>
                      </div>
                    </div>
                    <div className="profile-menu-items">
                      <Link to="/profile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                        <i className="bi bi-person"></i> My Profile
                      </Link>
                      <Link to="/my-orders" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                        <i className="bi bi-bag"></i> My Orders
                      </Link>
                      <Link to="/cart" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                        <i className="bi bi-cart"></i> My Cart
                      </Link>
                      <div className="divider"></div>
                      <button className="profile-menu-item logout-btn" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

