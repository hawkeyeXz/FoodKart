"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/Card.css"

export default function Card({ image, title, options }) {
  const [selectedOption, setSelectedOption] = useState(Object.keys(options)[0])
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(options[selectedOption])
  const [isHovered, setIsHovered] = useState(false)

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

  const addToCart = () => {
    // Implement cart functionality here
    console.log(`Added to cart: ${title}, ${selectedOption}, Qty: ${quantity}`)
    // Show a toast or notification
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
            <button className="btn btn-sm btn-outline-primary me-2" onClick={addToCart}>
              <i className="bi bi-cart-plus"></i> Add
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

