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
import multer from "multer";

const router = express.Router();

/* -------------------- MULTER SETUP -------------------- */
const upload = multer({
  storage: multer.memoryStorage(), // ⭐ IMPORTANT
});


/* -------------------------------------------------------------------------- */
/* 📄 SUBJECTIVE ROUTES (🔥 KEEP FIRST TO AVOID CONFLICT) */
/* -------------------------------------------------------------------------- */

router.get("/subjective/results", getSubjectiveResults);
router.get("/subjective/student", getSubjectiveAssignmentsForStudent);
router.get("/subjective/submissions", getStudentSubmissions);

router.post("/subjective", protect, createSubjectiveAssignment);

router.post(
  "/subjective/submit",
  protect, // 🔥 added security
  upload.single("file"),
  submitSubjectiveAnswer
);

router.put("/subjective/:id", updateSubjectiveAssignment);

/* -------------------------------------------------------------------------- */
/* 🧩 TEACHER ROUTES */
/* -------------------------------------------------------------------------- */

router.post("/create", createAssignment);
router.get("/all", getAllAssignments);

/* -------------------------------------------------------------------------- */
/* 👩‍🎓 STUDENT ROUTES */
/* -------------------------------------------------------------------------- */

router.get("/student", getAssignment);

/* -------------------------------------------------------------------------- */
/* 📊 PERFORMANCE */
/* -------------------------------------------------------------------------- */

router.post("/performance", savePerformance);
router.get("/performance", getAllPerformances);

/* -------------------------------------------------------------------------- */
/* 🔍 UNIT ROUTE (🔥 KEEP AFTER SUBJECTIVE) */
/* -------------------------------------------------------------------------- */

router.get("/unit/:unit", getAssignmentsByUnit);

/* -------------------------------------------------------------------------- */
/* ⭐ CHECK ATTEMPT */
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

/* -------------------------------------------------------------------------- */
/* 🗑 DELETE (ALWAYS LAST) */
/* -------------------------------------------------------------------------- */

router.delete("/:id", deleteAssignment);

export default router;