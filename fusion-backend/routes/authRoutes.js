import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const router = express.Router();

// ✅ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  console.log("🧩 Signup attempt:", req.body);
  try {
    const { name, email, password, role, extraField } = req.body;

    // Check all fields
    if (!name || !email || !password || !role || !extraField) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password safely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      extraField: extraField.trim(),
    });

    await newUser.save();
    console.log("✅ Signup successful:", email);

    // Send response (without password)
    res.status(200).json({
      msg: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        extraField: newUser.extraField,
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ msg: "Signup failed", error: error.message });
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  console.log("🧩 Login attempt:", req.body);
  try {
    const { email, password, role } = req.body; // ✅ added role here too

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found for:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Compare passwords
    if (!user.password) {
      console.log("⚠️ User has no password hash in DB");
      return res.status(500).json({ msg: "Corrupted user record (missing password)" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Optional: verify correct role
    if (role && user.role !== role) {
      console.log(`🚫 Role mismatch: tried ${role}, user is ${user.role}`);
      return res.status(403).json({ msg: `Access denied for ${role} login` });
    }

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        extraField: user.extraField,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
});

export default router;
