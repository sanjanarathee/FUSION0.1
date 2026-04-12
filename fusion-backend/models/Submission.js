import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ✅ for coding
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingQuestion",
    required: false
  },

  // ✅ for subjective
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: false
  },

  unit: {
    type: Number
  },

  // 🔥 common fields
  code: String,
  language: String,
  status: String,
  passed: Number,
  total: Number,

  totalMarks: Number,
  maxMarks: Number,

  // ✅ subjective result
  marks: Number,
  feedback: String,

  stepResults: [
    {
      label: String,
      passed: Boolean,
      marksAwarded: Number,
      marksTotal: Number
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);