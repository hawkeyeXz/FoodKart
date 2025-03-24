const mongoose = require("mongoose");
const { data } = require("react-router-dom");

const mongodbURI =
  "mongodb+srv://foodkart:CpI3FG0nr8YxydvU@cluster0.93hz9.mongodb.net/foodkartmern?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
  try {
    await mongoose.connect(mongodbURI, {});

    console.log("MongoDB connected successfully");

    const db = mongoose.connection.db;
    const fetchData = db.collection("food_item");
    const data = await fetchData.find({}).toArray();
    global.foodItems = data;
    const categoryData =  db.collection("food_Category")
    const catData = await categoryData.find({}).toArray();
    global.foodCategory = catData  ;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = mongoDB;
