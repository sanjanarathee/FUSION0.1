import Assignment from "../models/Assignment.js";
import Performance from "../models/Performance.js";
import Submission from "../models/Submission.js";
import { evaluateWithKeywords, evaluateWithAI } from "../utils/evaluate.js";

/* ================================================================
   🧩 TEACHER: CREATE ASSIGNMENT
================================================================ */
import User from "../models/user.js";
export const createAssignment = async (req, res) => {
  try {
    const { unit, type ,subject, title, description, questions, deadline, teacherId, section } = req.body;

    if (!title || !unit  || !section)
      return res.status(400).json({
        success: false,
        message: "Unit, subject, title and section are required!",
      });

    if (!deadline)
      return res.status(400).json({
        success: false,
        message: "Deadline is required!",
      });

    if (!questions || !questions.length)
      return res.status(400).json({
        success: false,
        message: "Questions are missing!",
      });

    // ✅ Verify teacher is allowed for this section
    const teacher = await User.findById(teacherId);

    if (!teacher || !teacher.sections.includes(section)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create quiz for this section",
      });
    }

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText || "",
      options: q.options || [],
      correctAnswer: q.correctAnswer || "",
    }));

    const newAssignment = new Assignment({
      unit: Number(unit),
      type,
      title,
      description: description || "",
      deadline: new Date(deadline),
      questions: formattedQuestions,

      // ⭐ MOST IMPORTANT
      section: section.toUpperCase().trim(),
      createdBy: teacherId,

      createdAt: new Date(),
    });

    await newAssignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment created successfully!",
    });

  } catch (error) {
    console.error("❌ Error creating assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating assignment",
      error: error.message,
    });
  }
};

/* ================================================================
   👩‍🏫 TEACHER: GET ALL ASSIGNMENTS (FILTERABLE)
================================================================ */
export const getAllAssignments = async (req, res) => {
  try {
    const { unit, section } = req.query;

    const filter = {};
    if (unit) filter.unit = Number(unit);
    if (section) filter.section = section;
    

    const assignments = await Assignment.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

/* ================================================================
   👩‍🏫 TEACHER: GET ASSIGNMENTS BY UNIT + SUBJECT
================================================================ */
export const getAssignmentsByUnit = async (req, res) => {
  try {
    const unit = Number(req.params.unit);

    if (isNaN(unit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid unit number",
      });
    }

    const assignments = await Assignment.find({
      unit,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assignments,
    });

  } catch (error) {
    console.error("❌ Error fetching assignments by unit:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};
/* ================================================================
   👩‍🎓 STUDENT: GET ASSIGNMENTS (UNIT + SUBJECT)
================================================================ */
export const getAssignment = async (req, res) => {
  try {
    const { unit, rollNumber } = req.query;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Roll number required",
      });
    }

    const numericUnit = Number(unit);

    // ✅ VERY IMPORTANT
    const student = await User.findOne({
      rollNumber: rollNumber.trim()
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("Student section:", student.section);

    const assignments = await Assignment.find({
      unit: numericUnit,
      section: { 
  $regex: new RegExp(`^${student.section.trim()}$`, "i") 
}
    });

    console.log("Assignments:", assignments);

    res.status(200).json({
      success: true,
      assignments,
    });

  } catch (error) {
    console.error("❌ Error in getAssignment:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

/* ================================================================
   🧠 STUDENT: SAVE PERFORMANCE (UNIT + SUBJECT SAFE)
================================================================ */
export const savePerformance = async (req, res) => {
  try {
    const { studentName, rollNumber, answers, unit,  } = req.body;
    const numericUnit = Number(unit);

    // ✅ Get student section
    const student = await User.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ✅ Find assignment ONLY of that section
    const { assignmentId } = req.body;  // 🔥 ADD THIS

const assignment = await Assignment.findById(assignmentId);

if (!assignment) {
  return res.status(404).json({
    success: false,
    message: "Assignment not found",
  });
}

    const alreadyAttempted = await Performance.findOne({
      rollNumber,
      unit: numericUnit,
    
    });

    if (alreadyAttempted)
      return res.status(400).json({
        success: false,
        message: "You have already attempted this assignment!",
      });

    let correct = 0;
    assignment.questions.forEach((q, i) => {
      const studentAns =
        answers[i]?.toString().trim().toLowerCase() || "";
      const actualAns = q.correctAnswer
        .toString()
        .trim()
        .toLowerCase();
      if (studentAns === actualAns) correct++;
    });

    const wrong = assignment.questions.length - correct;
    const accuracy = assignment.questions.length
      ? (correct / assignment.questions.length) * 100
      : 0;

    const performance = new Performance({
      studentName,
      rollNumber,
      correct,
      wrong,
      accuracy,
      unit: numericUnit,
      section: student.section,
        assignmentId: assignmentId,   // 🔥 ADD THIS
  // ⭐ SAVE SECTION
    });

    await performance.save();

    res.status(200).json({
      success: true,
      message: "Performance saved!",
      performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving performance",
      error: error.message,
    });
  }
};

/* ================================================================
   👩‍🏫 TEACHER: GET PERFORMANCE LIST (FILTERABLE)
================================================================ */
export const getAllPerformances = async (req, res) => {
  try {
    const { unit, section, assignmentId } = req.query;

    let filter = {
      unit: Number(unit),
      section: section
    };

    if (assignmentId) {
      filter.assignmentId = assignmentId;   // 🔥 KEY LINE
    }

    const performances = await Performance.find(filter);

    res.status(200).json({
      success: true,
      performances
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
/* ================================================================
   ❌ TEACHER: DELETE ASSIGNMENT
================================================================ */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment)
      return res.status(404).json({
        success: false,
        message: "Assignment not found!",
      });

    res.status(200).json({
      success: true,
      message: "🗑 Assignment deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting assignment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting assignment",
      error: error.message,
    });
  }
};
export const createSubjectiveAssignment = async (req, res) => {
  try {
    const { question, keywords, maxMarks, unit, section, deadline } = req.body;

    const newAssignment = await Assignment.create({
      type: "subjective",
      question,

      // ✅ keywords safe conversion
      keywords: Array.isArray(keywords)
        ? keywords
        : keywords
        ? keywords.split(",").map((k) => k.trim())
        : [],

      maxMarks: Number(maxMarks),

      // ✅ deadline safe
      deadline: deadline ? new Date(deadline) : null,

      unit: Number(unit),

      // ✅ section safe
      section: section ? section.toUpperCase().trim() : "",

      // ✅ SAFE USER (no crash)
      createdBy: req.user?.id || null,

      // ✅ DON'T FORGET COMMA ABOVE 👆
      isActive: true,
    });

    res.json({ success: true, data: newAssignment });
  } catch (err) {
    console.error("CREATE SUBJECTIVE ERROR:", err); // 🔥 better debug
    res.status(500).json({ error: "Failed to create assignment" });
  }
};
export const updateSubjectiveAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { deadline } = req.body;

    const updated = await Assignment.findByIdAndUpdate(
      id,
      { deadline },
      { new: true }
    );

    res.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};


export const getSubjectiveResults = async (req, res) => {
  try {
    const { assignmentId, unit } = req.query;

    const filter = {};

    if (assignmentId) filter.assignmentId = assignmentId;
    if (unit) filter.unit = Number(unit);   // 🔥 ADD THIS

    const results = await Submission.find(filter)
      .populate("userId", "name email")
      .populate("assignmentId", "question maxMarks");

    res.json({ success: true, results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};
export const submitSubjectiveAnswer = async (req, res) => {
  try {
    const { assignmentId, answer, userId } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // 🔥 yaha evaluation hona chahiye
    // ✅ 1. KEYWORD EVALUATION
const keywordResult = evaluateWithKeywords(
  answer,
  assignment.keywords,
  assignment.maxMarks
);

// ✅ 2. AI EVALUATION
const aiResult = await evaluateWithAI(
  assignment.question,
  answer,
  assignment.maxMarks
);

// extract AI marks
let aiMarks = 0;
const match = aiResult.match(/Marks:\s*(\d+)/);
if (match) aiMarks = parseInt(match[1]);

// ✅ 3. FINAL MARKS (HYBRID)
const finalMarks = Math.round(
  keywordResult.marks * 0.4 + aiMarks * 0.6
);

// ✅ 4. FINAL FEEDBACK (AI priority)
const feedback =
  aiResult.split("Feedback:")[1]?.trim() || keywordResult.feedback;

    const submission = await Submission.create({
      userId,
      assignmentId,
      answer,
      marks: finalMarks,
      feedback: feedback,    
      unit: assignment.unit 
    });

    res.json({ success: true, submission });

  } catch (err) {
    console.error("🔥 Submit error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
};
export const getSubjectiveAssignmentsForStudent = async (req, res) => {
  try {
    const { unit, section } = req.query;

    // 🔥 FIX START
    const filter = {
      unit: Number(unit),
      type: "subjective",
      isActive: true,
    };

    // ✅ only apply section if it exists
    if (section) {
      filter.section = {
        $regex: new RegExp(`^${section.trim()}$`, "i"),
      };
    }

    const assignments = await Assignment.find(filter);
    // 🔥 FIX END

    const uniqueAssignments = Array.from(
      new Map(assignments.map(a => [a._id.toString(), a])).values()
    );

    res.json({ assignments: uniqueAssignments });

  } catch (err) {
    console.error("🔥 Fetch subjective error:", err);
    res.status(500).json({ error: "Failed to fetch subjective assignments" });
  }
};
export const getStudentSubmissions = async (req, res) => {
  try {
    const { userId } = req.query;

    const submissions = await Submission.find({ userId });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};
