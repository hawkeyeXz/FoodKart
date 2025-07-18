import mongoose from "mongoose"
const { Schema } = mongoose

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      foodItem: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Card", "UPI"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("order", OrderSchema)
