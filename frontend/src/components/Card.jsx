"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/Card.css"
import API_URL from "../config/api"

export default function Card({ image, title, options, foodItem }) {
  const [selectedOption, setSelectedOption] = useState(Object.keys(options)[0])
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(options[selectedOption])
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOptionChange = (event) => {
    const selected = event.target.value
    setSelectedOption(selected)
    setTotalPrice(options[selected] * quantity)
  }

  const handleQuantityChange = (event) => {
    let qty = Number.parseInt(event.target.value, 10)
    if (isNaN(qty) || qty < 1) qty = 1
    setQuantity(qty)
    setTotalPrice(options[selectedOption] * qty)
  }

  const addToCart = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      alert("Please login to add items to cart")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          foodItem: foodItem || { _id: Date.now(), name: title, img: image },
          quantity,
          size: selectedOption,
          price: options[selectedOption],
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Item added to cart successfully!")
      } else {
        alert("Failed to add item to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Error adding item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className={`food-card ${isHovered ? "hovered" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="food-card-image-container">
        <img src={image || "/placeholder.svg"} className="food-card-image" alt={title} />
        <div className="food-card-badge">
          <i className="bi bi-star-fill me-1"></i> 4.5
        </div>
      </div>
      <div className="food-card-body">
        <h5 className="food-card-title">{title}</h5>

        <div className="food-card-options">
          <div className="form-floating mb-2">
            <select
              className="form-select"
              id={`option-${title.replace(/\s+/g, "-").toLowerCase()}`}
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {Object.entries(options).map(([key, value]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} - ₹{value}
                </option>
              ))}
            </select>
            <label htmlFor={`option-${title.replace(/\s+/g, "-").toLowerCase()}`}>Size</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id={`quantity-${title.replace(/\s+/g, "-").toLowerCase()}`}
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
            <label htmlFor={`quantity-${title.replace(/\s+/g, "-").toLowerCase()}`}>Quantity</label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h6 className="food-card-price">₹{totalPrice}</h6>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={addToCart} disabled={isLoading}>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>
                  <i className="bi bi-cart-plus"></i> Add
                </>
              )}
            </button>
            <button className="btn btn-sm btn-primary">
              <i className="bi bi-bag-check"></i> Order
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
