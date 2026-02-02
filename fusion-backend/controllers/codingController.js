import CodingQuestion from "../models/CodingQuestion.js";
import axios from "axios";
import Submission from "../models/Submission.js";
import User from "../models/user.js";

/* ----------------------------------------------------
   1️⃣ ADD CODING PRACTICE QUESTION (GLOBAL)
---------------------------------------------------- */
export const addCodingQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      language,   // "c" or "cpp"
      testcases,
      evaluationSteps,
    } = req.body;

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        message: "title, description and language are required",
      });
    }

    const cleanedTestcases = (testcases || []).map((tc) => ({
      input: tc.input || "",
      expected: tc.expectedOutput || tc.expected || "",
    }));

    const cleanedSteps = (evaluationSteps || []).map((s, index) => ({
  stepId: s.stepId || `step_${index}`,


      label: s.label,
      type: s.type,
      value:
        s.type === "all-testcases-pass" ? undefined : s.value || "",
      minPassed:
        s.type === "min-testcases-pass"
          ? Number(s.minPassed || 0)
          : undefined,
      marks: Number(s.marks || 0),
    }));

    const newQ = new CodingQuestion({
      title,
      description,
      language,
      category: "practice", // ✅ GLOBAL PRACTICE
      testcases: cleanedTestcases,
      evaluationSteps: cleanedSteps,
    });

    await newQ.save();

    res.json({ success: true, message: "Practice question saved successfully!" });
  } catch (err) {
    console.error("ADD QUESTION ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ----------------------------------------------------
   2️⃣ GET GLOBAL CODING PRACTICE QUESTIONS
---------------------------------------------------- */
export const getCodingQuestions = async (req, res) => {
  try {
    const { language } = req.query;

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "language is required (c / cpp)",
      });
    }

    const questions = await CodingQuestion.find({
      language,
      category: "practice",   // ✅ only practice questions
    }).sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (err) {
    console.error("GET QUESTIONS ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ----------------------------------------------------
   3️⃣ DELETE CODING QUESTION
---------------------------------------------------- */
export const deleteCodingQuestion = async (req, res) => {
  try {
    await CodingQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Question deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ----------------------------------------------------
   4️⃣ EVALUATE CODE + STEP EVALUATION
---------------------------------------------------- */
export const evaluateCode = async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    const langId = language === "cpp" ? 54 : 50;

    const question = await CodingQuestion.findById(questionId);
    if (!question)
      return res.json({ success: false, message: "Question not found" });

    let passed = 0;
    let total = question.testcases.length;
    let results = [];

    /* ------------ RUN TESTCASES ------------ */
    for (let tc of question.testcases) {
      const input = tc.input ?? "";
      const expected = (tc.expected ?? "").trim().toLowerCase();

    const submit = await axios.post(
  "https://ce.judge0.com/submissions/?base64_encoded=true&wait=false",
  {
    source_code: Buffer.from(code).toString("base64"),
    language_id: langId,
    stdin: Buffer.from(input).toString("base64"),
  }
);



      const token = submit.data.token;
      let outputData = null;

      while (true) {
        const poll = await axios.get(
          `https://ce.judge0.com/submissions/${token}?base64_encoded=true`
        );
        outputData = poll.data;
        if (outputData.status.id !== 1 && outputData.status.id !== 2) break;
      }

      const output = outputData.stdout
  ? Buffer.from(outputData.stdout, "base64")
      .toString("utf8")
      .trim()
      .toLowerCase()
  : "";



      const correct = output === expected;
      if (correct) passed++;

      results.push({
        input,
        expected,
        got: output,
        status: correct ? "Passed" : "Failed",
      });
    }

    const stepResults = [];

for (const step of question.evaluationSteps) {
  let passedStep = false;

  switch (step.type) {
    case "code-contains":
      passedStep = code.includes(step.value);
      break;

    case "code-regex":
      passedStep = new RegExp(step.value).test(code);
      break;

    case "all-testcases-pass":
      passedStep = passed === total;
      break;

    case "min-testcases-pass":
      passedStep = passed >= step.minPassed;
      break;
  }

  stepResults.push({
    stepId: step.stepId,
    label: step.label,
    passed: passedStep,
    marksAwarded: passedStep ? step.marks : 0,
    marksTotal: step.marks,
  });
}


/* ----------------------------------------------------
   5️⃣ LEADERBOARD
---------------------------------------------------- */

/* ----------------------------------------------------
   6️⃣ TEACHER: GET ALL STUDENTS CODING RESULTS
---------------------------------------------------- */
export const getAllCodingResults = async (req, res) => {
  try {
    const results = await Submission.find()
      .populate("userId", "name email")
      .populate("questionId", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error("GET ALL RESULTS ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
/* ----------------------------------------------------
   7️⃣ SUBMIT CODING RESULT (SAVE TO DB)
---------------------------------------------------- */
export const submitCode = async (req, res) => {
  try {
    console.log("====== SUBMIT HIT ======");
    console.log(req.body);

    const {
      userId,
      questionId,
      code,
      language,
      passed,
      total
    } = req.body;

    if (!userId || !questionId) {
      return res.status(400).json({
        success: false,
        message: "userId and questionId are required"
      });
    }

    const status = passed === total ? "Accepted" : "Wrong Answer";

    const submission = new Submission({
      userId,
      questionId,
      code,
      language,
      status,
      passed,
      total
    });

    await submission.save();

    res.json({
      success: true,
      message: "Submission saved successfully",
      submission
    });

  } catch (err) {
    console.error("❌ SUBMIT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

