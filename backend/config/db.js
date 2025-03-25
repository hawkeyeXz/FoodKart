const mongoose = require("mongoose")

const mongodbURI =" mongodb uri string from database"
  

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbURI, {
    })

    console.log("MongoDB connected successfully")

    const db = mongoose.connection.db

    // Fetch food items
    const fetchData = await db.collection("food_item")
    const data = await fetchData.find({}).toArray()
    global.foodItems = data
    // console.log(`Loaded ${data.length} food items`)

    // Fetch food categories
    const categoryData = await db.collection("food_Category")
    const catData = await categoryData.find({}).toArray()
    global.foodCategory = catData
    // console.log(`Loaded ${catData.length} food categories`)

    console.log("Data loaded successfully")
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  }
}

module.exports = connectDB

