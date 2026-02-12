const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer user ID is required']
  },
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Please add vehicle number']
  },
  vehicleModel: {
    type: String
  },
  serviceType: {
    type: String,
    ref: 'Service',
    required: [true, 'Please add service type']
  },
  date: {
    type: String,
    required: [true, 'Please add booking date']
  },
  time: {
    type: String,
    required: [true, 'Please add booking time']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed', 'Rejected'],
    default: 'Pending'
  },
  additionalNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

