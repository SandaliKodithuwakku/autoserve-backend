const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/services', serviceRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AutoServe API is running!' });
});

// Test protected route
app.get('/api/test/me', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working!',
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});