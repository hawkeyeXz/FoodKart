"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { apiCall, API_ENDPOINTS } from "../config/api"
import { useAuth } from "../context/AuthContext"

const FoodCard = ({ foodItem }) => {
  const { isAuthenticated, setPendingCartItem } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedSize, setSelectedSize] = useState(Object.keys(foodItem.options[0])[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const currentPrice = foodItem.options[0][selectedSize]
  const totalPrice = currentPrice * quantity

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setPendingCartItem({ foodItem, quantity, size: selectedSize, price: currentPrice })
      navigate("/login", { state: { from: location } })
      return
    }

    setLoading(true)
    try {
      const response = await apiCall(API_ENDPOINTS.ADD_TO_CART, {
        method: "POST",
        body: JSON.stringify({
          foodItem,
          quantity,
          size: selectedSize,
          price: currentPrice,
        }),
      })

      if (response.success) {
        alert("Item added to cart successfully!")
      } else {
        alert("Failed to add item to cart: " + (response.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="food-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="position-relative overflow-hidden">
        <img
          src={foodItem.img || "/placeholder.svg?height=200&width=300"}
          alt={foodItem.name}
          className="food-card-image"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-warning text-dark">
            <i className="bi bi-star-fill me-1"></i>4.5
          </span>
        </div>
      </div>

      <div className="food-card-body">
        <h5 className="food-card-title">{foodItem.name}</h5>
        <p className="text-muted small mb-3">{foodItem.description || "Delicious food item"}</p>

        <div className="mb-3">
          <label className="form-label small">Size:</label>
          <select
            className="form-select form-select-sm"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {Object.entries(foodItem.options[0]).map(([size, price]) => (
              <option key={size} value={size}>
                {size.charAt(0).toUpperCase() + size.slice(1)} - ₹{price}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small">Quantity:</label>
          <div className="input-group input-group-sm">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              min="1"
            />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity(quantity + 1)}>
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div className="food-card-actions">
          <div className="d-flex justify-content-between align-items-center">
            <div className="food-card-price">₹{totalPrice}</div>
            <button className="btn btn-primary-custom btn-sm" onClick={handleAddToCart} disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-cart-plus me-1"></i>
              )}
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FoodCard
