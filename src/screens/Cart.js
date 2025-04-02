"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "../styles/Cart.css"
import API_URL from "../config/api"

export default function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subtotal, setSubtotal] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(40)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("COD")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    if (!token) {
      navigate("/login")
      return
    }

    // Fetch cart data
    fetchCartData()
  }, [navigate])

  useEffect(() => {
    // Calculate totals whenever cart items change
    calculateTotals()
  }, [cartItems, discount])

  const fetchCartData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        setCartItems(data.cart.items || [])
      } else {
        setError(data.message || "Failed to fetch cart")
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setError("Failed to load cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculateTotals = () => {
    // Calculate subtotal
    const itemsSubtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    setSubtotal(itemsSubtotal)

    // Calculate tax (5% of subtotal)
    const taxAmount = itemsSubtotal * 0.05
    setTax(taxAmount)

    // Calculate total
    const totalAmount = itemsSubtotal + taxAmount + deliveryFee - discount
    setTotal(totalAmount)
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) newQuantity = 1

      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update local cart state
        setCartItems(data.cart.items || [])
      } else {
        setError(data.message || "Failed to update cart")
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      setError("Failed to update cart. Please try again.")
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        // Update local cart state
        setCartItems(data.cart.items || [])
      } else {
        setError(data.message || "Failed to remove item")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      setError("Failed to remove item. Please try again.")
    }
  }

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })

      const data = await response.json()

      if (data.success) {
        setCartItems([])
      } else {
        setError(data.message || "Failed to clear cart")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      setError("Failed to clear cart. Please try again.")
    }
  }

  const handleApplyCoupon = () => {
    // Mock coupon logic - in a real app, this would validate with the backend
    if (couponCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1 // 10% discount
      setDiscount(discountAmount)
    } else if (couponCode.toLowerCase() === "food50") {
      setDiscount(50) // Flat ₹50 off
    } else {
      setDiscount(0)
      setError("Invalid coupon code")
    }
  }

  const handleCheckout = async () => {
    try {
      if (!address) {
        setError("Please enter a delivery address")
        return
      }

      if (cartItems.length === 0) {
        setError("Your cart is empty")
        return
      }

      const token = localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: total,
          deliveryAddress: address,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Clear cart after successful order
        await handleClearCart()

        // Redirect to order confirmation page
        navigate(`/order-confirmation/${data.order._id}`)
      } else {
        setError(data.message || "Failed to place order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setError("Failed to place order. Please try again.")
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container my-4">
        <h2 className="cart-title">
          <i className="bi bi-cart3 me-2"></i> My Cart
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
            <p className="mt-3">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="bi bi-cart-x"></i>
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-items-container">
                <div className="cart-header">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Product</h5>
                    </div>
                    <div className="col-md-2 text-center">
                      <h5>Price</h5>
                    </div>
                    <div className="col-md-2 text-center">
                      <h5>Quantity</h5>
                    </div>
                    <div className="col-md-2 text-end">
                      <h5>Total</h5>
                    </div>
                  </div>
                </div>

                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.foodItem.img || "/placeholder.svg?height=80&width=80"}
                            alt={item.foodItem.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-details">
                            <h5 className="cart-item-title">{item.foodItem.name}</h5>
                            <p className="cart-item-size">Size: {item.size}</p>
                            <button
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              <i className="bi bi-trash me-1"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 text-center">
                        <p className="cart-item-price">₹{item.price}</p>
                      </div>
                      <div className="col-md-2 text-center">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 text-end">
                        <p className="cart-item-total">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="cart-actions">
                  <Link to="/" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i> Continue Shopping
                  </Link>
                  <button className="btn btn-outline-danger" onClick={handleClearCart}>
                    <i className="bi bi-trash me-2"></i> Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-summary">
                <h4 className="summary-title">Order Summary</h4>

                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-item">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="summary-item">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="summary-item discount">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-item total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <div className="coupon-section">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" type="button" onClick={handleApplyCoupon}>
                      Apply
                    </button>
                  </div>
                  <small className="text-muted">Try: WELCOME10 or FOOD50</small>
                </div>

                <div className="checkout-section">
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Delivery Address
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      rows="2"
                      placeholder="Enter your full delivery address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <div className="payment-options">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
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
                          checked={paymentMethod === "Card"}
                          onChange={() => setPaymentMethod("Card")}
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
                          checked={paymentMethod === "UPI"}
                          onChange={() => setPaymentMethod("UPI")}
                        />
                        <label className="form-check-label" htmlFor="upi">
                          UPI
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <i className="bi bi-bag-check me-2"></i> Place Order
                  </button>
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

