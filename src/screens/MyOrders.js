"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "../styles/MyOrders.css"

export default function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    if (!token) {
      navigate("/login")
      return
    }

    // Fetch orders
    fetchOrders()
  }, [navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      const response = await fetch("{API_URL}/api/orders/myorders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        setOrders(data.orders || [])
      } else {
        setError(data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`{API_URL}/api/orders/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "Cancelled" } : order)))
      } else {
        setError(data.message || "Failed to cancel order")
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      setError("Failed to cancel order. Please try again.")
    }
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["Pending", "Processing", "Shipped"].includes(order.status)
    if (activeTab === "delivered") return order.status === "Delivered"
    if (activeTab === "cancelled") return order.status === "Cancelled"
    return true
  })

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning"
      case "Processing":
        return "badge bg-info"
      case "Shipped":
        return "badge bg-primary"
      case "Delivered":
        return "badge bg-success"
      case "Cancelled":
        return "badge bg-danger"
      default:
        return "badge bg-secondary"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container my-4">
        <h2 className="orders-title">
          <i className="bi bi-bag-check me-2"></i> My Orders
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              <i className="bi bi-bag-x"></i>
            </div>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="orders-tabs">
              <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                All Orders
              </button>
              <button
                className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </button>
              <button
                className={`tab-btn ${activeTab === "delivered" ? "active" : ""}`}
                onClick={() => setActiveTab("delivered")}
              >
                Delivered
              </button>
              <button
                className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
                onClick={() => setActiveTab("cancelled")}
              >
                Cancelled
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-4">
                <p>No orders found in this category.</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h5 className="order-id">Order #{order._id.substring(order._id.length - 8)}</h5>
                        <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                      </div>
                      <div>
                        <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.foodItem.img || "/placeholder.svg?height=60&width=60"}
                              alt={item.foodItem.name}
                              className="order-item-image"
                            />
                            <div className="order-item-details">
                              <h6 className="order-item-title">{item.foodItem.name}</h6>
                              <p className="order-item-meta">
                                Size: {item.size} | Qty: {item.quantity} | ₹{item.price} each
                              </p>
                            </div>
                          </div>
                          <div className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                      </div>

                      <div className="order-actions">
                        <Link to={`/order-details/${order._id}`} className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-eye me-1"></i> View Details
                        </Link>

                        {(order.status === "Pending" || order.status === "Processing") && (
                          <button
                            className="btn btn-outline-danger btn-sm ms-2"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

