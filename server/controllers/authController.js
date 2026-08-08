const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

// ======================
// Register User
// ======================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, city, zipCode, avatar } = req.body;

  // Validate Input
  if (!name || !email || !password) {
    const error = new Error("Please fill all required fields.");
    error.statusCode = 400;
    throw error;
  }

  // Check if email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists.");
    error.statusCode = 400;
    throw error;
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    city,
    zipCode,
    avatar,
  });

  return sendResponse(
    res,
    201,
    true,
    "User registered successfully.",
    {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode,
        avatar: user.avatar,
        role: user.role,
      },
    }
  );
});

// ======================
// Login User
// ======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Input
  if (!email || !password) {
    const error = new Error("Please provide email and password.");
    error.statusCode = 400;
    throw error;
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  // Compare Password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return sendResponse(
    res,
    200,
    true,
    "Login successful.",
    {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode,
        avatar: user.avatar,
        role: user.role,
      },
    }
  );
});

// ======================
// Get User Profile
// ======================
const getUserProfile = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, "Profile fetched successfully.", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      city: req.user.city,
      zipCode: req.user.zipCode,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
});

// ======================
// Update User Profile
// ======================
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, city, zipCode, avatar, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (address !== undefined) user.address = address.trim();
  if (city !== undefined) user.city = city.trim();
  if (zipCode !== undefined) user.zipCode = zipCode.trim();
  if (avatar !== undefined) user.avatar = avatar;

  if (password) {
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters.");
      error.statusCode = 400;
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updated = await user.save();

  return sendResponse(res, 200, true, "Profile updated successfully.", {
    user: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      city: updated.city,
      zipCode: updated.zipCode,
      avatar: updated.avatar,
      role: updated.role,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};