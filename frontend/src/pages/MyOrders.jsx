"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { apiCall, API_ENDPOINTS } from "../config/api"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"

const MyOrders = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await apiCall(API_ENDPOINTS.GET_MY_ORDERS)
      if (data.success) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      setError("Failed to load orders: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return

    try {
      const data = await apiCall(`${API_ENDPOINTS.CANCEL_ORDER}/${orderId}`, {
        method: "PUT",
      })

      if (data.success) {
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "Cancelled" } : order)))
        alert("Order cancelled successfully")
      }
    } catch (error) {
      alert("Failed to cancel order: " + error.message)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { class: "bg-warning text-dark", icon: "bi-clock" },
      Processing: { class: "bg-info", icon: "bi-gear" },
      Shipped: { class: "bg-primary", icon: "bi-truck" },
      Delivered: { class: "bg-success", icon: "bi-check-circle" },
      Cancelled: { class: "bg-danger", icon: "bi-x-circle" },
    }

    const config = statusConfig[status] || { class: "bg-secondary", icon: "bi-question" }

    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {status}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["Pending", "Processing", "Shipped"].includes(order.status)
    if (activeTab === "delivered") return order.status === "Delivered"
    if (activeTab === "cancelled") return order.status === "Cancelled"
    return true
  })

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container my-5">
        <EmptyState
          icon="bi-bag-x"
          title="No orders found"
          message="You haven't placed any orders yet."
          actionButton={
            <a href="/" className="btn btn-primary-custom">
              <i className="bi bi-shop me-2"></i>
              Start Shopping
            </a>
          }
        />
      </div>
    )
  }

  return (
    <div className="container my-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="fw-bold mb-4">
          <i className="bi bi-bag-check me-2"></i>
          My Orders
        </h2>

        {/* Order Tabs */}
        <div className="category-tabs mb-4">
          <button className={`category-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All Orders ({orders.length})
          </button>
          <button
            className={`category-tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active ({orders.filter((o) => ["Pending", "Processing", "Shipped"].includes(o.status)).length})
          </button>
          <button
            className={`category-tab ${activeTab === "delivered" ? "active" : ""}`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered ({orders.filter((o) => o.status === "Delivered").length})
          </button>
          <button
            className={`category-tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({orders.filter((o) => o.status === "Cancelled").length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No orders found in this category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredOrders.map((order, index) => (
              <div key={order._id} className="col-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="card shadow-sm"
                >
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Order #{order._id.slice(-8)}</h5>
                      <small className="text-muted">Placed on {formatDate(order.orderDate)}</small>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="mb-3">Items Ordered:</h6>
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="d-flex align-items-center mb-2">
                            <img
                              src={item.foodItem.img || "/placeholder.svg?height=50&width=50"}
                              alt={item.foodItem.name}
                              className="rounded me-3"
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">{item.foodItem.name}</div>
                              <small className="text-muted">
                                Size: {item.size} | Qty: {item.quantity} | ₹{item.price} each
                              </small>
                            </div>
                            <div className="text-end">
                              <span className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="col-md-4">
                        <div className="bg-light p-3 rounded">
                          <h6 className="mb-3">Order Summary</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total Amount:</span>
                            <span className="fw-bold text-primary-custom">₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted">Payment: {order.paymentMethod}</small>
                          </div>
                          <div className="mb-3">
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              {order.deliveryAddress}
                            </small>
                          </div>

                          {(order.status === "Pending" || order.status === "Processing") && (
                            <button
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={() => cancelOrder(order._id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MyOrders
