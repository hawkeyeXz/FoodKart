const express = require("express")
const router = express.Router()

// Route: Get all food data - POST /api/food/fooddata
router.post("/fooddata", (req, res) => {
  try {
    console.log("Food data requested")
    console.log("Global foodItems:", global.foodItems ? global.foodItems.length : 0)
    console.log("Global foodCategory:", global.foodCategory ? global.foodCategory.length : 0)

    if (!global.foodItems || !global.foodCategory) {
      return res.status(500).json({
        success: false,
        message: "Food data not loaded. Please try again later.",
      })
    }

    res.json({
      success: true,
      foodItems: global.foodItems,
      foodCategory: global.foodCategory,
    })
  } catch (error) {
    console.error("Error in /fooddata route:", error.message)
    res.status(500).json({ success: false, message: "Server Error" })
  }
})

module.exports = router

