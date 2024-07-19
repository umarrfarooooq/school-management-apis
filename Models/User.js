const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String },
  googleId: { type: String },
  resetPasswordCode: String,
  resetPasswordExpire: Date,
  roles: { 
    type: [String], 
    required: true, 
    enum: ['super admin', 'admin', 'teacher', 'driver', 'student', 'accountant', 'receptionist', 'librarian'], 
    default: ['student'] 
  },
  isInvited: { type: Boolean, default: false },
  inviteToken: String,
  inviteTokenExpire: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordCode = function() {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.resetPasswordCode = resetCode;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetCode;
};

userSchema.methods.generateInviteToken = function() {
  const inviteToken = crypto.randomBytes(20).toString('hex');
  
  this.inviteToken = inviteToken;
  this.inviteTokenExpire = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return inviteToken;
};

module.exports = mongoose.model('User', userSchema);