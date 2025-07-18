"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    navigate("/")
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{ background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-2" to="/">
          <i className="bi bi-basket-fill me-2"></i>
          FoodKart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-orders" onClick={closeMenu}>
                    <i className="bi bi-bag-check me-1"></i> My Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart" onClick={closeMenu}>
                    <i className="bi bi-cart3 me-1"></i> Cart
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link className="btn btn-light" to="/createuser">
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </Link>
              </>
            ) : (
              <div className="position-relative" ref={profileMenuRef}>
                <button
                  className="btn btn-outline-light d-flex align-items-center"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic || "/placeholder.svg"}
                      alt={user.name}
                      className="rounded-circle me-2"
                      style={{ width: "30px", height: "30px", objectFit: "cover" }}
                    />
                  ) : (
                    <i className="bi bi-person-circle me-2"></i>
                  )}
                  {user?.name || "User"}
                  <i className="bi bi-chevron-down ms-2"></i>
                </button>

                {showProfileMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
                    style={{ minWidth: "200px", zIndex: 1000 }}
                  >
                    <div className="p-3 border-bottom">
                      <div className="fw-bold text-dark">{user?.name}</div>
                      <div className="text-muted small">{user?.email}</div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="dropdown-item d-flex align-items-center px-3 py-2 text-decoration-none text-dark"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <i className="bi bi-person me-2"></i> Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        className="dropdown-item d-flex align-items-center px-3 py-2 text-decoration-none text-dark"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <i className="bi bi-bag me-2"></i> My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="dropdown-item d-flex align-items-center px-3 py-2 text-decoration-none text-dark"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <i className="bi bi-cart me-2"></i> Cart
                      </Link>
                      <hr className="my-1" />
                      <button
                        className="dropdown-item d-flex align-items-center px-3 py-2 text-danger border-0 bg-transparent w-100"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
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

export default Navbar
