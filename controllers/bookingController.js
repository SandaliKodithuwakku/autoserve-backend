const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create booking (Authenticated customers only)
const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      vehicleNumber,
      vehicleModel,
      serviceType,
      date,
      time,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !vehicleNumber || !serviceType || !date || !time) {
      return res.status(400).json({
        message: 'Please provide customerName, phone, vehicleNumber, serviceType, date, and time'
      });
    }

    // Create booking with authenticated user's ID
    const booking = await Booking.create({
      customerUserId: req.user._id,
      customerName,
      phone,
      email,
      vehicleNumber,
      vehicleModel,
      serviceType,
      date,
      time,
      additionalNotes,
      status: 'Pending'
    });

    // Populate serviceType before returning
    await booking.populate('serviceType');

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    // Fetch all bookings with customer user details and service details
    const bookings = await Booking.find()
      .populate('customerUserId', 'username email')
      .populate('serviceType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID (Customer sees own, Admin sees all)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerUserId', 'username email')
      .populate('serviceType');

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If user is customer, verify they own this booking
    if (req.user.role === 'customer' && booking.customerUserId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only view your own bookings.' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my bookings (Authenticated customers only)
const getMyBookings = async (req, res) => {
  try {
    // Get all bookings for logged-in customer with service details
    const bookings = await Booking.find({ customerUserId: req.user._id })
      .populate('serviceType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['Pending', 'Approved', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Please provide a valid status: Pending, Approved, Completed, or Cancelled'
      });
    }

    // Find and update booking
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('customerUserId', 'username email')
      .populate('serviceType');

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
  deleteBooking
};