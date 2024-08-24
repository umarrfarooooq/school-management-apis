const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/sendEmail")
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, roles } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firstName,
      lastName,
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

exports.inviteUser = async (req, res) => {
  const { email, firstName, lastName, roles, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      email,
      firstName,
      lastName,
      roles,
      phoneNumber,
      isInvited: true,
    });

    user.generateInviteToken();

    const savedUser = await user.save();

    const inviteLink = `${process.env.FRONTEND_URL}signup/${savedUser.inviteToken}`;
    const message = `You have been invited to join our platform. Please use this link to complete your registration: ${inviteLink}`;
    
    await sendEmail({
      email: savedUser.email,
      subject: 'Invitation to Join',
      message
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        roles: savedUser.roles,
        phoneNumber: savedUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.initiateSignup = async (req, res) => {
  const { inviteToken } = req.params;

  try {
    const user = await User.findOne({
      inviteToken,
      inviteTokenExpire: { $gt: Date.now() },
      isInvited: true
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite token" });
    }

    res.status(200).json({
      message: "Valid invite token",
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeSignup = async (req, res) => {
  const { inviteToken, password, googleToken } = req.body;

  try {
    const user = await User.findOne({
      inviteToken,
      inviteTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired invite token" });
    }

    if (googleToken) {
      const googleUser = await verifyGoogleToken(googleToken);
      if (googleUser.email !== user.email) {
        return res.status(400).json({ message: "Google account email does not match invite email" });
      }
      user.googleId = googleUser.id;
    } else if (password) {
      user.password = password;
    } else {
      return res.status(400).json({ message: "Please provide either a Google token or a password" });
    }

    user.isInvited = false;
    user.inviteToken = undefined;
    user.inviteTokenExpire = undefined;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Signup completed successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
}

exports.loginWithGoogle = async (req, res) => {
  const { googleToken } = req.body;

  try {
    const googleUser = await verifyGoogleToken(googleToken);

    const user = await User.findOne({ email: googleUser.email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this Google account." });
    }

    if (!user.googleId) {
      user.googleId = googleUser.sub;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, roles } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.roles = roles || user.roles;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        roles: updatedUser.roles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roles: user.roles,
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid user ID" });
    }
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