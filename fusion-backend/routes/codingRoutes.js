import express from "express";
import {
  addCodingQuestion,
  getCodingQuestions,
  deleteCodingQuestion,
  evaluateCode,
  getleaderboard,
  getAllCodingResults,
  submitCode              // ✅ ADDED
} from "../controllers/codingController.js";

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
router.get("/leaderboard", getleaderboard);

// -------------------------------------------------
// 📊 Teacher – Get all students coding results
// -------------------------------------------------
router.get("/results", getAllCodingResults);

export default router;
