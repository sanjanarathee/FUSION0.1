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

 auth-upgrade
  unit: {
    type: Number
  },

  // 🔥 common fields
 main
  code: String,
  language: String,
  status: String,
  passed: Number,
  total: Number,

  totalMarks: Number,
  maxMarks: Number,

auth-upgrade
  // ✅ subjective result
  marks: Number,
  feedback: String,


 main
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