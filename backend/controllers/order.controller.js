import Order from '../models/Order.model.js';
import auth from '../middleware/auth.js';

//Create a new order
export const createOrder =[auth, async (req, res) => {
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
}]


// Get all orders for a user
export const getUserOrders = [auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 })
    res.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}]


// Get order by ID
export const getOrderById = [auth, async (req, res) => {
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
}]


//Cancel an order
export const cancelOrder = [auth, async (req, res) => {
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
}]
