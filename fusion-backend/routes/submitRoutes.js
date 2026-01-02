import express from "express";
import { submitCode } from "../controllers/submitCodeController.js";
import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";

const router = express.Router();

/* ----------------------------------------------------
   🔹 POST – Submit Code
---------------------------------------------------- */
router.post("/submit", submitCode);

/* ----------------------------------------------------
   🔹 GET – Get All Submissions for UNIT 3
---------------------------------------------------- */
router.get("/unit/3", async (req, res) => {
  try {
    // Step 1: Find all questions that belong to Unit 3
    const questions = await CodingQuestion.find({ unit: 3 });

    // Extract IDs of those questions
    const questionIds = questions.map((q) => q._id.toString());

    // Step 2: Fetch submissions belonging to those questions
    const submissions = await Submission.find({
      questionId: { $in: questionIds }
    });

    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
});

export default router;
