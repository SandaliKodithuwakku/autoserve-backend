const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register admin
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new admin user
    const user = await User.create({
      username,
      password,
      role: 'admin'
    });

    // Generate JWT token with user ID (expires in 30 days)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return success response with token and user info (excluding password)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user (works for both admin and customer)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate that both fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password using comparePassword method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with user ID (expires in 30 days)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return success response with token and user info (excluding password)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register customer
const registerCustomer = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validate required fields
    if (!username || !password || !phone) {
      return res.status(400).json({ message: 'Please provide username, password, and phone' });
    }

    // Check if username already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new customer user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role: 'customer'
    });

    // Generate JWT token with user ID (expires in 30 days)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return success response with token and user info (excluding password)
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, registerCustomer };

