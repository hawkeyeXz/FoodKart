const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const auth = require("../middleware/auth")

// Route 1: Create a new order - POST /api/orders/create
router.post("/create", auth, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" })
    }

    if (!totalAmount || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    })

    const savedOrder = await newOrder.save()
    res.json({ success: true, order: savedOrder })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Route 2: Get all orders for a user - GET /api/orders/myorders
router.get("/myorders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 })
    res.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Route 3: Get order by ID - GET /api/orders/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    res.json({ success: true, order })
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Route 4: Cancel an order - PUT /api/orders/cancel/:id
router.put("/cancel/:id", auth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    // Check if order can be cancelled (only if it's pending or processing)
    if (order.status !== "Pending" && order.status !== "Processing") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      })
    }

    // Update order status
    order = await Order.findByIdAndUpdate(req.params.id, { $set: { status: "Cancelled" } }, { new: true })

    res.json({ success: true, order })
  } catch (error) {
    console.error("Error cancelling order:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

module.exports = router

