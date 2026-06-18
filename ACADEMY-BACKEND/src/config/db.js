const mongoose = require("mongoose");
const dns = require("dns"); // 1. Import the built-in DNS module
const { initGridFS } = require("./gridfs");

// 2. Override the default DNS servers for this Node process
// Using 8.8.4.4 as the correct secondary Google DNS instead of 8.8.8.0
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB Connected");
    
    initGridFS();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;