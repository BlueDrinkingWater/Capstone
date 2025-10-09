import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['mission', 'vision', 'about', 'terms', 'privacy', 'contact', 'bookingTerms', 'paymentQR']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
});

export default mongoose.model('Content', contentSchema);
