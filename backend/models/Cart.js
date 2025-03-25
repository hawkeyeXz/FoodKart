const mongoose = require("mongoose")
const { Schema } = mongoose

const CartSchema = new Schema({
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
        default: 1,
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("cart", CartSchema)

