const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()
const port = process.env.PORT || 4000

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Define routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/food", require("./routes/food"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/cart", require("./routes/cart"))

// Basic route for testing
app.get("/", (req, res) => {
  res.send("FoodKart API is running")
})

// Start server
app.listen(port, () => {
  console.log(`FoodKart server running on port ${port}`)
})

