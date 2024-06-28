const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/sendEmail")

exports.registerUser = async (req, res) => {
  const { username, email, password, roles } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      roles,
    });

    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        roles: savedUser.roles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetCode = user.getResetPasswordCode();
    await user.save({ validateBeforeSave: false });
    const message = `Your password reset code is ${resetCode}. This code will expire in 10 minutes.`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset code',
        message
      });
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordCode = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      resetPasswordCode: req.body.code,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.status(200).json({ success: true, message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      resetPasswordCode: req.body.code,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = req.body.password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetCode = user.getResetPasswordCode();
    await user.save({ validateBeforeSave: false });
    const message = `Your new password reset code is ${resetCode}. This code will expire in 10 minutes.`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'New Password Reset Code',
        message
      });
      res.status(200).json({ success: true, data: 'New code sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordCode = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};