const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");

dotenv.config(); 

const collection = require("./models/config"); 

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected Successfully");
}).catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
});

// Routes
app.get("/", (req, res) => res.render("containers/login", { title: "Login" }));
app.get("/login", (req, res) => res.redirect('/'));
app.get("/signup", (req, res) => res.render("containers/signup", { title: "Signup" }));
app.get("/ejshome", (req, res) => res.render("containers/ejshome", { title: "Home" }));
app.get("/contact", (req, res) => res.render("containers/contact", { title: "Contact" }));
app.get("/about", (req, res) => res.render("containers/about", { title: "About" }));
app.get("/hscGuidance", (req, res) => res.render("containers/hscGuidance", { title: "Career Guidance" }));
app.get("/sslcGuidance", (req, res) => res.render("containers/sslcGuidance", { title: "Career Guidance" }));
app.get("/resource", (req, res) => res.render("containers/resource", { title: "Resources" }));

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send("<script>alert('Username already exists'); window.location.href='/signup'</script>");
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new collection({ name: username, password: hashedPassword });

        await userData.save();

        console.log("✅ User Created:", userData);
        res.send("<script>alert('Signed up successfully'); window.location.href='/login'</script>");
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).send("<script>alert('Signup failed: " + error.message + "'); window.location.href='/signup'</script>");
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.send("<script>alert('Username not found'); window.location.href='/'</script>");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            return res.redirect("/ejshome");
        } else {
            return res.send("<script>alert('Wrong Password'); window.location.href='/'</script>");
        }
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        return res.send("<script>alert('Something went wrong: " + error.message + "'); window.location.href='/'</script>");
    }
});

// Static Files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "views/assets")));

// Server Setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// 404 Page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
