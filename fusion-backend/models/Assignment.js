import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const assignmentSchema = new mongoose.Schema({
  unit: { type: Number, required: true },

  // 🔑 ADD THIS
  subject: {
    type: String,
    enum: ["c", "cpp"],
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String, default: "" },

  deadline: { type: Date, default: null },

  maxMarks: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },

  questions: [questionSchema],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);
