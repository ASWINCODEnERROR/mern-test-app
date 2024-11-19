const express = require('express');
const User = require('../models/User'); // Adjust path if needed
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication
const router = express.Router();

// Register API
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  console.log('Register request received', req.body);
  
  // Check if username, password, and confirmPassword are provided
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: "Username, password, and confirm password are required" });
  }

  // Validate password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save(); // Password will be hashed automatically due to the pre-save hook

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login API
// Login API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send the token as a response
    res.status(200).json({
      message: "Login successful",
      token: token, // Send the token to the client
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.post('/logout', (req, res) => {
  // JWT is client-side, so we just send a success response as there is no server-side session to destroy
  res.status(200).json({ message: "Logout successful" });
});


module.exports = router;
