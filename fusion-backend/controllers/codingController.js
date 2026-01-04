import CodingQuestion from "../models/CodingQuestion.js";
import axios from "axios";
import Submission from "../models/Submission.js";
import User from "../models/user.js";

/* ----------------------------------------------------
   1️⃣ ADD CODING QUESTION
---------------------------------------------------- */
export const addCodingQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      language,   // "c" or "cpp"
      unit,
      testcases,
      evaluationSteps,
    } = req.body;

    const cleanedTestcases = (testcases || []).map((tc) => ({
      input: tc.input || "",
      expected: tc.expectedOutput || tc.expected || "",
      visible: tc.visible ?? true,
    }));

    const cleanedSteps = (evaluationSteps || []).map((s) => ({
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

    // Normalize unit → "Unit X"
    let finalUnit = unit;
    if (!finalUnit.toLowerCase().includes("unit")) {
      finalUnit = "Unit " + finalUnit;
    }

    const newQ = new CodingQuestion({
      title,
      description,
      language,
      unit: finalUnit,
      testcases: cleanedTestcases,
      evaluationSteps: cleanedSteps,
    });

    await newQ.save();

    res.json({ success: true, message: "Question saved successfully!" });
  } catch (err) {
    console.error("ADD QUESTION ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ----------------------------------------------------
   2️⃣ GET CODING QUESTIONS (FIXED – LANGUAGE + UNIT)
---------------------------------------------------- */
export const getCodingQuestions = async (req, res) => {
  try {
    let { unit, language } = req.query;

    if (!unit || !language) {
      return res.status(400).json({
        success: false,
        message: "unit and language are required",
      });
    }

    // Normalize unit → "Unit X"
    if (!unit.toLowerCase().includes("unit")) {
      unit = "Unit " + unit;
    }

    const questions = await CodingQuestion.find({
      unit,
      language, // 🔥 MAIN FIX (c / cpp)
    }).sort({ createdAt: -1 });

    res.json({ success: true, questions });
  } catch (err) {
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
      const expected = (tc.expected ?? "").trim();

      const submit = await axios.post(
        "https://ce.judge0.com/submissions/?base64_encoded=true&wait=false",
        {
          source_code: code,
          language_id: langId,
          stdin: input,
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

    /* ------------ STEP EVALUATION ------------ */
    const usesScanf = /\bscanf\s*\(/i.test(code);
    const usesMod = /%/.test(code);
    const usesIf = /\bif\s*\(/.test(code);
    const allTestcasesPassed = passed === total;

    const stepResults = [
      {
        label: "uses scanf",
        passed: usesScanf,
        marksAwarded: usesScanf ? 1 : 0,
        marksTotal: 1,
      },
      {
        label: "uses modulus operator",
        passed: usesMod,
        marksAwarded: usesMod ? 1 : 0,
        marksTotal: 1,
      },
      {
        label: "uses if condition",
        passed: usesIf,
        marksAwarded: usesIf ? 1 : 0,
        marksTotal: 1,
      },
      {
        label: "all testcases passed",
        passed: allTestcasesPassed,
        marksAwarded: allTestcasesPassed ? 5 : 0,
        marksTotal: 5,
      },
    ];

    const totalMarks = stepResults.reduce(
      (sum, s) => sum + s.marksAwarded,
      0
    );
    const maxMarks = stepResults.reduce(
      (sum, s) => sum + s.marksTotal,
      0
    );

    return res.json({
      success: true,
      passed,
      total,
      results,
      stepResults,
      totalMarks,
      maxMarks,
    });
  } catch (err) {
    console.error("🔥 EVALUATE ERROR", err);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};

/* ----------------------------------------------------
   5️⃣ LEADERBOARD
---------------------------------------------------- */
export const getleaderboard = async (req, res) => {
  try {
    const leaders = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          accepted: {
            $sum: {
              $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0],
            },
          },
          totalSubmissions: { $sum: 1 },
          lastSubmission: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          accuracy: {
            $multiply: [
              { $divide: ["$accepted", "$totalSubmissions"] },
              100,
            ],
          },
        },
      },
      { $sort: { accuracy: -1, accepted: -1 } },
    ]);

    const withNames = await Promise.all(
      leaders.map(async (item) => {
        const user = await User.findById(item._id).select("name");
        return {
          userId: item._id,
          username: user?.name || "Unknown User",
          ...item,
          accuracy: item.accuracy.toFixed(2),
        };
      })
    );

    res.json({ success: true, users: withNames });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
