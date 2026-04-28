import express from "express";
import { submitCode } from "../controllers/submitCodeController.js";
import { submitSubjectiveAnswer } from "../controllers/assignmentController.js";
import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ---------------- CODE ---------------- */
router.post("/", submitCode);

/* ---------------- SUBJECTIVE ---------------- */
router.post(
  "/subjective",
  upload.single("file"),
  submitSubjectiveAnswer
);

/* ---------------- GET UNIT 3 ---------------- */
router.get("/unit/3", async (req, res) => {
  try {
    const questions = await CodingQuestion.find({ unit: 3 });
    const questionIds = questions.map((q) => q._id.toString());

    const submissions = await Submission.find({
      questionId: { $in: questionIds }
    });

    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
});

/* ---------------- GET BY ASSIGNMENT ---------------- */
router.get("/assignment/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;