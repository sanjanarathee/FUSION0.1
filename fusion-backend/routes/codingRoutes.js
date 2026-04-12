import express from "express";

import {
  addCodingQuestion,
  getCodingQuestions,
  deleteCodingQuestion,
  evaluateCode,
  getAllCodingResults,
  updateCodingQuestion
} from "../controllers/codingController.js";

import { submitCode } from "../controllers/evaluateCodeController.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { getSubmissionById } from "../controllers/submitCodeController.js";

import Submission from "../models/Submission.js";   // ✅ IMPORTANT

const router = express.Router();

// -------------------------------------------------
// ➕ Add GLOBAL coding practice question (Teacher)
// -------------------------------------------------
router.post("/add", addCodingQuestion);

// -------------------------------------------------
// 📥 Get GLOBAL coding practice questions (Student)
// Example: /api/coding/practice?language=c
// -------------------------------------------------
router.get("/practice", getCodingQuestions);

// -------------------------------------------------
// 📄 Get single submission (IMPORTANT 🔥)
// -------------------------------------------------
router.get("/submission/:id", getSubmissionById);

// -------------------------------------------------
// ❌ Delete coding question
// -------------------------------------------------
router.delete("/delete/:id", deleteCodingQuestion);

// -------------------------------------------------
// ▶ Run / evaluate code (no DB save)
// -------------------------------------------------
router.post("/run", evaluateCode);

// -------------------------------------------------
// 📤 Submit coding result (save to DB)
// -------------------------------------------------
router.post("/submit", submitCode);

// -------------------------------------------------
// 🏆 Leaderboard
// -------------------------------------------------
router.get("/leaderboard", getLeaderboard);

// -------------------------------------------------
// 📊 Teacher – Get ALL coding results
// -------------------------------------------------
router.get("/results", getAllCodingResults);

// -------------------------------------------------
// ✅ NEW: Get results by QUESTION (VERY IMPORTANT 🔥)
// -------------------------------------------------
router.get("/results/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const submissions = await Submission.find({
      questionId: questionId,
    }).populate("userId", "name rollNumber");

    res.json({
      success: true,
      submissions,
    });

  } catch (err) {
    console.error("Error fetching question results:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// -------------------------------------------------
// ✏ Update coding question
// -------------------------------------------------
router.put("/update/:id", updateCodingQuestion);

export default router;