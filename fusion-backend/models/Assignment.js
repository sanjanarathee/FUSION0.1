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

  // ✅ SUBJECTIVE
  question: { type: String, default: "" },
  keywords: [{ type: String }],

  // 🔥 ONLY REQUIRED CHANGE (SMART maxMarks)
  maxMarks: {
    type: Number,
    required: function () {
      return this.type === "subjective";
    },
    default: function () {
      return this.type === "quiz" ? 100 : undefined;
    },
  },

  isActive: { type: Boolean, default: true },

  section: {
  type: String,
  required: function () {
    return this.type === "subjective";
  },
},

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);