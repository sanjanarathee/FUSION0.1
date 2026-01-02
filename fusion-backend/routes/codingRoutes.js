import express from "express";
import {
  addCodingQuestion,
  getCodingQuestions,
  deleteCodingQuestion,
  evaluateCode,
  getleaderboard
} from "../controllers/codingController.js";

import CodingQuestion from "../models/CodingQuestion.js";

const router = express.Router();

// Add coding question
router.post("/add", addCodingQuestion);

// Get all questions
router.get("/get", getCodingQuestions);

// Delete question
router.delete("/delete/:id", deleteCodingQuestion);

// Run / evaluate code
router.post("/run", evaluateCode);

// Leaderboard
router.get("/leaderboard", getleaderboard);


/* =====================================================
   ⭐ FIXED — GET CODING QUESTIONS BY UNIT (1,2,3,...)
   Now works with /api/coding/unit/3
===================================================== */
router.get("/unit/:unitId", async (req, res) => {
  try {
    const unitId = req.params.unitId;      // "3"

    // Convert number → DB format "Unit 3"
    const unitName = `Unit ${unitId}`;

    const questions = await CodingQuestion.find({ unit: unitName });

    res.json({
      success: true,
      questions,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coding questions",
    });
  }
});

export default router;
