import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  // 🔗 Student reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔗 Question reference
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingQuestion",
    required: true
  },

  code: { type: String, required: true },
  language: { type: String, default: "c" },

  status: { type: String, required: true },   // Accepted / Wrong Answer

  passed: { type: Number },
  total: { type: Number },

  // ✅ NEW — for teacher results page
  totalMarks: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);
