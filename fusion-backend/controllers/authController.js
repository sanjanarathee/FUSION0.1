import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const router = express.Router();

// =================== SET PASSWORD ===================
router.post("/set-password", async (req, res) => {
  try {
    const { rollNumber, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password required" });
    }

    const user = await User.findOne({
      $or: [{ rollNumber }, { email }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.passwordSet) {
      return res.status(400).json({ msg: "Password already set. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 8); // 🔥 reduced cost for performance

    user.password = hashedPassword;
    user.passwordSet = true;

    await user.save();

    res.status(200).json({ msg: "Password set successfully" });

  } catch (error) {
    console.error("Set Password Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// =================== SIGNUP ===================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, sections } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (role === "admin") {
      return res.status(403).json({ msg: "Admin cannot be created publicly" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8); // 🔥 optimized

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      sections,
      isApproved: role === "teacher" ? false : true,
      passwordSet: true,
    });

    await newUser.save();

    res.status(200).json({
      msg:
        role === "teacher"
          ? "Registration request sent. Wait for admin approval."
          : "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: "Signup failed" });
  }
});


// =================== LOGIN ===================
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const cleanIdentifier = identifier.trim();

    // 🔥 optimized query (no $or)
    const query = cleanIdentifier.includes("@")
      ? { email: cleanIdentifier.toLowerCase() }
      : { rollNumber: cleanIdentifier };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.passwordSet) {
      return res.status(400).json({ msg: "Please set your password first" });
    }

    // Teacher approval check
    if (user.role === "teacher" && !user.isApproved) {
      return res.status(403).json({
        msg: "Your account is pending admin approval",
      });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        section: user.section,
        sections: user.sections,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// =================== APPROVE TEACHER ===================
router.put("/approve/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== "teacher") {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ msg: "Teacher approved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// =================== GET PENDING TEACHERS ===================
router.get("/pending-teachers", async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isApproved: false,
    });

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// =================== GET APPROVED TEACHERS ===================
router.get("/approved-teachers", async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isApproved: true,
    });

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// =================== DISAPPROVE TEACHER ===================
router.put("/disapprove/:id", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    teacher.isApproved = false;
    await teacher.save();

    res.status(200).json({ msg: "Teacher disapproved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;