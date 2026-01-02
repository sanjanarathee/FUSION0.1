import Assignment from "../models/Assignment.js";
import Performance from "../models/Performance.js";

/* ================================================================
   🧩 TEACHER: CREATE ASSIGNMENT
================================================================ */
export const createAssignment = async (req, res) => {
  try {
    const { unit, subject, title, description, questions, deadline } = req.body;

    if (!title || !unit || !subject)
      return res.status(400).json({
        success: false,
        message: "Unit, subject (c/cpp) and title are required!",
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

    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText || "",
      options: q.options || [],
      correctAnswer: q.correctAnswer || "",
    }));

    const newAssignment = new Assignment({
      unit: Number(unit),
      subject, // 🔑 c / cpp
      title,
      description: description || "",
      deadline: new Date(deadline),
      questions: formattedQuestions,
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
    const { unit, subject } = req.query;

    const filter = {};
    if (unit) filter.unit = Number(unit);
    if (subject) filter.subject = subject;

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
    const subject = req.query.subject;

    if (isNaN(unit))
      return res.status(400).json({
        success: false,
        message: "Invalid unit number",
      });

    if (!subject)
      return res.status(400).json({
        success: false,
        message: "Subject (c/cpp) is required",
      });

    const assignments = await Assignment.find({
      unit,
      subject,
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
    const unit = Number(req.query.unit);
    const subject = req.query.subject;

    const filter = {};
    if (!isNaN(unit)) filter.unit = unit;
    if (subject) filter.subject = subject;

    const assignments = await Assignment.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
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
    const { studentName, rollNumber, answers, unit, subject } = req.body;
    const numericUnit = Number(unit);

    if (!subject)
      return res.status(400).json({
        success: false,
        message: "Subject (c/cpp) is required",
      });

    const alreadyAttempted = await Performance.findOne({
      rollNumber,
      unit: numericUnit,
      subject,
    });

    if (alreadyAttempted)
      return res.status(400).json({
        success: false,
        message: "You have already attempted this assignment!",
      });

    const assignment = await Assignment.findOne({
      unit: numericUnit,
      subject,
    });

    if (!assignment)
      return res.status(404).json({
        success: false,
        message: "No assignment found for this unit & subject",
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
      subject, // 🔑 c / cpp
      correct,
      wrong,
      accuracy,
      unit: numericUnit,
    });

    await performance.save();

    res.status(200).json({
      success: true,
      message: "Performance saved!",
      performance,
    });
  } catch (error) {
    console.error("⚠ Error saving performance:", error.message);
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
    const { unit, subject } = req.query;

    const filter = {};
    if (unit) filter.unit = Number(unit);
    if (subject) filter.subject = subject;

    const performances = await Performance.find(filter);

    res.status(200).json({
      success: true,
      performances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching performances",
      error: error.message,
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
