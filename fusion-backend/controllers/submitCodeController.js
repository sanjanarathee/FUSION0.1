import Submission from "../models/Submission.js";
import CodingQuestion from "../models/CodingQuestion.js";

export const submitCode = async (req, res) => {
  try {
    const {
      userId,
      code,
      language,
      questionId,
      testcasesPassed,
      totalTestcases,
      totalMarks,     // ✅ NEW
      maxMarks        // ✅ NEW
    } = req.body;

    if (!userId || !questionId)
      return res.status(400).json({ success: false, message: "Missing data" });

    const question = await CodingQuestion.findById(questionId);
    if (!question)
      return res.status(404).json({ success: false, message: "Question not found" });

    const status = testcasesPassed === totalTestcases ? "Accepted" : "Wrong Answer";

    const submission = await Submission.create({
      userId,
      questionId,
      code,
      language,
      status,
      passed: testcasesPassed,
      total: totalTestcases,

      // ✅ VERY IMPORTANT (Teacher ke liye)
      totalMarks,
      maxMarks
    });

    return res.json({
      success: true,
      submissionId: submission._id,
      status,
    });

  } catch (err) {
    console.error("❌ Submit Error:", err);
    return res.status(500).json({ success: false, message: "Submit failed" });
  }
};
