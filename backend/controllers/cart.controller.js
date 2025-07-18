import mongoose from "mongoose"
import Cart from "../models/Cart.model.js"
import auth from "../middleware/auth.js"
import router from "../routes/cart.route.js"

// Get cart items
export const getCart = [auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      // If no cart exists, create an empty one
      cart = new Cart({
        user: req.user.id,
        items: [],
      })
      await cart.save()
    }

    res.json({ success: true, cart })
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]

// Add item to cart
export const addToCart = [auth, async (req, res) => {
  try {
    const { foodItem, quantity, size, price } = req.body

    // Validate request
    if (!foodItem || !quantity || !size || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        user: req.user.id,
        items: [{ foodItem, quantity, size, price }],
      })
    } else {
      // Check if item already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.foodItem._id.toString() === foodItem._id && item.size === size,
      )

      if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity
      } else {
        // Add new item
        cart.items.push({ foodItem, quantity, size, price })
      }
    }

    cart.updatedAt = Date.now()
    await cart.save()

    res.json({ success: true, cart })
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]

// Update item in cart
export const updateCartItem = [auth, async (req, res) => {
  try {
    const { itemId, quantity } = req.body

    // Validate request
    if (!itemId || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" })
    }

    // Update quantity or remove if quantity is 0
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    cart.updatedAt = Date.now()
    await cart.save()

    res.json({ success: true, cart })
  } catch (error) {
    console.error("Error updating cart:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]


// Remove item from cart
export const removeFromCart = [auth, async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    // Remove the item from cart
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    cart.updatedAt = Date.now()
    await cart.save()

    res.json({ success: true, cart })
  } catch (error) {
    console.error("Error removing from cart:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]

// Clear cart
export const clearCart = [auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    // Clear all items
    cart.items = []
    cart.updatedAt = Date.now()
    await cart.save()

    res.json({ success: true, message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]
