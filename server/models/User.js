import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  loginStreak: {
    type: Number,
    default: 1
  },
  coins: {
    type: Number,
    default: 10
  },
  addresses: [{
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  orders: [{
    orderId: String,
    date: Date,
    items: Array,
    total: Number,
    status: String
  }],
  events: [{
    date: String,
    occasion: String,
    name: String,
    notes: String,
    recurrence: {
      type: String,
      enum: ['once', 'weekly', 'monthly', 'yearly']
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);