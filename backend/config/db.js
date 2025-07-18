import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

        const db = mongoose.connection.db

    // Fetch food items
    const fetchData = db.collection("food_item")
    const data = await fetchData.find({}).toArray()
    global.foodItems = data
    // console.log(`Loaded ${data.length} food items`)

    // Fetch food categories
    const categoryData = db.collection("food_categories")
    const catData = await categoryData.find({}).toArray()
    global.foodCategory = catData
    // console.log(`Loaded ${catData.length} food categories`)

    console.log("Data loaded successfully")
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with failure

    }
}
