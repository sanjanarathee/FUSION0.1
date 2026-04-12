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
  getSubjectiveResults  // ✅ yahi add karo upar
} from "../controllers/assignmentController.js";

import Performance from "../models/Performance.js";
import { getSubjectiveAssignmentsForStudent } from "../controllers/assignmentController.js";
import { submitSubjectiveAnswer } from "../controllers/assignmentController.js";
import { getStudentSubmissions } from "../controllers/assignmentController.js";
import { protect } from "../middleware/authmiddleware.js";
const router = express.Router();


/* -------------------------------------------------------------------------- */
/* 🧩 TEACHER ROUTES */
/* -------------------------------------------------------------------------- */

/* ➕ Create a new assignment */
router.post("/create", createAssignment);

/* 📘 Get all assignments (Teacher panel) */
router.get("/all", getAllAssignments);
router.get("/subjective/submissions", getStudentSubmissions);

/* 🔍 Teacher: Get assignments by UNIT */
router.get("/unit/:unit", getAssignmentsByUnit);

/* 🗑 Delete an assignment */
router.put("/subjective/:id", updateSubjectiveAssignment);
router.delete("/:id", deleteAssignment);
router.get("/subjective/results", getSubjectiveResults);
router.post("/subjective/submit", submitSubjectiveAnswer);
router.get("/subjective/student", getSubjectiveAssignmentsForStudent);

router.post("/subjective", protect, createSubjectiveAssignment);

router.get("/unit/:unit", getAssignmentsByUnit);

/* -------------------------------------------------------------------------- */
/* 👩‍🎓 STUDENT ROUTES */
/* -------------------------------------------------------------------------- */

/*
  📋 Student fetch assignments  
  correct endpoint the frontend MUST call:
  GET https://fusion0-1.onrender.com/api/assignments/student?unit=3
*/
router.get("/student", getAssignment);

/* 🧠 Save student performance */
router.post("/performance", savePerformance);

/* 📊 Get all performances */
router.get("/performance", getAllPerformances);

router.post("/subjective", createSubjectiveAssignment);



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
