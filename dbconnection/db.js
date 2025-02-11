const mongoose=require("mongoose")
require("dotenv").config(); 
const details=require('../common')

const connectDB = async () => {
    try {
      console.log(details.data.MONGO_URI)
      await mongoose.connect(details.data.MONGO_URI);
      console.log("MongoDB Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;

