const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ ERROR: MongoDB URI is not defined in environment variables!");
    process.exit(1); // Stop execution
}

mongoose.connect(mongoURI) // Removed deprecated options
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const LoginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

const collection = mongoose.model("users", LoginSchema);
module.exports = collection;
