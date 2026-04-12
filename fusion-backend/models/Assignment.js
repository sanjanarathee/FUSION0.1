import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String },
  options: [{ type: String }],
  correctAnswer: { type: String },
});

const assignmentSchema = new mongoose.Schema({
  unit: { type: Number, required: true },

  type: {
    type: String,
    enum: ["quiz", "subjective"],
    default: "quiz",
  },

  // ✅ QUIZ
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  deadline: { type: Date, default: null },
  questions: [questionSchema],

  // ✅ SUBJECTIVE 🔥 (CLEAN VERSION)
  question: { type: String, default: "" },
  keywords: [{ type: String }],
  maxMarks: { type: Number, default: 100 },

  isActive: { type: Boolean, default: true },

  section: {
    type: String,
    default: "",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);