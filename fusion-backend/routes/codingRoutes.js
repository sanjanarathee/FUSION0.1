import express from "express";
import {
  addCodingQuestion,
  getCodingQuestions,
  deleteCodingQuestion,
  evaluateCode,
  getleaderboard,
  getAllCodingResults   // ✅ NEW
} from "../controllers/codingController.js";

const router = express.Router();

// -------------------------------------------------
// ➕ Add GLOBAL coding practice question (Teacher)
// -------------------------------------------------
router.post("/add", addCodingQuestion);

// -------------------------------------------------
// 📥 Get GLOBAL coding practice questions (Student)
// Example: /api/coding/practice?language=cpp
// -------------------------------------------------
router.get("/practice", getCodingQuestions);

// -------------------------------------------------
// ❌ Delete coding question
// -------------------------------------------------
router.delete("/delete/:id", deleteCodingQuestion);

// -------------------------------------------------
// ▶ Run / evaluate code
// -------------------------------------------------
router.post("/run", evaluateCode);

// -------------------------------------------------
// 🏆 Leaderboard
// -------------------------------------------------
router.get("/leaderboard", getleaderboard);

// -------------------------------------------------
// 📊 Teacher – Get all students coding results
// -------------------------------------------------
router.get("/results", getAllCodingResults);   // ✅ NEW

export default router;
