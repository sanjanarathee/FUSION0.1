import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

// =================== SIGNUP ===================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, extraField } = req.body;

    console.log("📥 Signup Request Received:", req.body);

    // ✅ Validate required fields
    if (!name || !email || !password || !role) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    // ✅ Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log("⚠️ User already exists:", normalizedEmail);
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed successfully for:", normalizedEmail);

    // ✅ Create new user object
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      extraField,
    });

    // ✅ Save user in database
    await newUser.save();
    console.log(`✅ New ${role} saved in DB:`, normalizedEmail);

    return res.status(200).json({
      msg: "User signup successful!",
      user: {
  _id: newUser._id,     // ✅ FIXED
  name: newUser.name,
  email: newUser.email,
  role: newUser.role,
},

    });
  } catch (error) {
    console.error("🔥 Signup Error Details:", error);
    return res.status(500).json({
      msg: "Signup failed, try again!",
      error: error.message,
    });
  }
};

// =================== LOGIN ===================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log("📥 Login Request Received:", req.body);

    // ✅ Validate fields
    if (!email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // ✅ Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("❌ User not found:", normalizedEmail);
      return res.status(400).json({ msg: "User not found!" });
    }

    // ✅ Check if role matches
    if (user.role !== role) {
      console.log(`❌ Role mismatch: tried '${role}' but user is '${user.role}'`);
      return res.status(400).json({ msg: "Invalid role selected!" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("🧩 Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`✅ ${role} login successful:`, normalizedEmail);

    return res.status(200).json({
  msg: "Login successful!",
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.extraField   // 🔥 ADD THIS
  },
});

  } catch (error) {
    console.error("🔥 Login Error Details:", error);
    return res.status(500).json({
      msg: "Login failed, try again!",
      error: error.message,
    });
  }
};
