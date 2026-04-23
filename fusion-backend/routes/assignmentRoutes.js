import express from "express";
import {
  createAssignment,
  getAssignment,
  getAllAssignments,
  deleteAssignment,
  savePerformance,
  getAllPerformances,
  getAssignmentsByUnit,
  createSubjectiveAssignment,
  updateSubjectiveAssignment,
  getSubjectiveResults,
  getSubjectiveAssignmentsForStudent,
  submitSubjectiveAnswer,
  getStudentSubmissions
} from "../controllers/assignmentController.js";

import Performance from "../models/Performance.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧩 TEACHER ROUTES */
/* -------------------------------------------------------------------------- */

/* ➕ Create a new assignment */
router.post("/create", createAssignment);

/* 📘 Get all assignments */
router.get("/all", getAllAssignments);

/* 🔍 Get assignments by UNIT (🔥 IMPORTANT TOP PE) */
router.get("/unit/:unit", getAssignmentsByUnit);

/* 📄 Subjective specific */
router.get("/subjective/results", getSubjectiveResults);
router.get("/subjective/student", getSubjectiveAssignmentsForStudent);
router.get("/subjective/submissions", getStudentSubmissions);

router.post("/subjective", protect, createSubjectiveAssignment);
router.post("/subjective/submit", submitSubjectiveAnswer);

router.put("/subjective/:id", updateSubjectiveAssignment);

/* 🗑 Delete (🔥 ALWAYS LAST) */
router.delete("/:id", deleteAssignment);

/* -------------------------------------------------------------------------- */
/* 👩‍🎓 STUDENT ROUTES */
/* -------------------------------------------------------------------------- */

router.get("/student", getAssignment);

router.post("/performance", savePerformance);
router.get("/performance", getAllPerformances);

/* -------------------------------------------------------------------------- */
/* ⭐ Check if student already attempted */
/* -------------------------------------------------------------------------- */

router.post("/check", async (req, res) => {
  try {
    const { rollNumber, unit } = req.body;

    if (!rollNumber || !unit) {
      return res.status(400).json({
        attempted: false,
        message: "Missing roll number or unit",
      });
    }

    const attempt = await Performance.findOne({ rollNumber, unit });

    if (attempt) {
      return res.json({ attempted: true });
    }

    return res.json({ attempted: false });

  } catch (error) {
    console.error("🔥 Error checking performance:", error);
    return res.status(500).json({
      attempted: false,
      error: error.message,
    });
  }
});

export default router;