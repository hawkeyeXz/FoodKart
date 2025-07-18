"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { apiCall, API_ENDPOINTS } from "../config/api"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"

const Cart = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderLoading, setOrderLoading] = useState(false)

  // Order form data
  const [orderForm, setOrderForm] = useState({
    address: "",
    paymentMethod: "COD",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchCart()
  }, [isAuthenticated, navigate])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await apiCall(API_ENDPOINTS.GET_CART)
      if (data.success) {
        setCartItems(data.cart.items || [])
      }
    } catch (error) {
      setError("Failed to load cart: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const data = await apiCall(API_ENDPOINTS.UPDATE_CART, {
        method: "PUT",
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (data.success) {
        setCartItems(data.cart.items || [])
      }
    } catch (error) {
      alert("Failed to update quantity: " + error.message)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const data = await apiCall(`${API_ENDPOINTS.REMOVE_FROM_CART}/${itemId}`, {
        method: "DELETE",
      })

      if (data.success) {
        setCartItems(data.cart.items || [])
      }
    } catch (error) {
      alert("Failed to remove item: " + error.message)
    }
  }

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return

    try {
      const data = await apiCall(API_ENDPOINTS.CLEAR_CART, {
        method: "DELETE",
      })

      if (data.success) {
        setCartItems([])
      }
    } catch (error) {
      alert("Failed to clear cart: " + error.message)
    }
  }

  const placeOrder = async () => {
    if (!orderForm.address.trim()) {
      alert("Please enter delivery address")
      return
    }

    setOrderLoading(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          foodItem: item.foodItem._id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
        })),
        totalAmount: calculateTotal(),
        deliveryAddress: orderForm.address,
        paymentMethod: orderForm.paymentMethod,
      }

      const data = await apiCall(API_ENDPOINTS.CREATE_ORDER, {
        method: "POST",
        body: JSON.stringify(orderData),
      })

      if (data.success) {
        alert("Order placed successfully!")
        setCartItems([])
        navigate("/my-orders")
      }
    } catch (error) {
      alert("Failed to place order: " + error.message)
    } finally {
      setOrderLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.05 // 5% tax
  }

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 500 ? 0 : 40
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee()
  }

  if (loading) {
    return <LoadingSpinner message="Loading your cart..." />
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

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <EmptyState
          icon="bi-cart-x"
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          actionButton={
            <Link to="/" className="btn btn-primary-custom">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container my-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <i className="bi bi-cart3 me-2"></i>
            My Cart ({cartItems.length} items)
          </h2>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            <i className="bi bi-trash me-2"></i>
            Clear Cart
          </button>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`d-flex align-items-center py-3 ${index < cartItems.length - 1 ? "border-bottom" : ""}`}
                  >
                    <img
                      src={item.foodItem.img || "/placeholder.svg?height=80&width=80"}
                      alt={item.foodItem.name}
                      className="rounded"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />

                    <div className="flex-grow-1 ms-3">
                      <h5 className="mb-1">{item.foodItem.name}</h5>
                      <p className="text-muted mb-1">Size: {item.size}</p>
                      <p className="text-primary-custom fw-bold mb-0">₹{item.price} each</p>
                    </div>

                    <div className="d-flex align-items-center me-3">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <div className="text-end me-3">
                      <div className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>

                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(item._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%):</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery Fee:</span>
                  <span>
                    {calculateDeliveryFee() === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `₹${calculateDeliveryFee()}`
                    )}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong className="text-primary-custom">₹{calculateTotal().toFixed(2)}</strong>
                </div>

                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter your complete address"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Payment Method</label>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="COD"
                        checked={orderForm.paymentMethod === "COD"}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="Card"
                        checked={orderForm.paymentMethod === "Card"}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="card">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="upi"
                        value="UPI"
                        checked={orderForm.paymentMethod === "UPI"}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI Payment
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary-custom w-100 py-2"
                  onClick={placeOrder}
                  disabled={orderLoading || !orderForm.address.trim()}
                >
                  {orderLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bag-check me-2"></i>
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Cart
