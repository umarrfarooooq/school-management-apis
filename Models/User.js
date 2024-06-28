const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordCode: String,
  resetPasswordExpire: Date,
  roles: { type: [String], required: true, enum: ['super admin', 'admin', 'teacher', 'driver', 'student', 'accountant', 'receptionist', 'librarian'], default: ['student'] }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getResetPasswordCode = function() {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.resetPasswordCode = resetCode;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetCode;
};
module.exports = mongoose.model('User', userSchema);
