import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingQuestion",
    required: true
  },

  code: { type: String, required: true },
  language: { type: String, default: "c" },

  status: { type: String, required: true },

  passed: { type: Number },
  total: { type: Number },

  totalMarks: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 0 },

  stepResults: [   // 🔥🔥 ADD THIS
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
