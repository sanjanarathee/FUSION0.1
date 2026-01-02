import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questionId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, default: "c" },
  status: { type: String, required: true },   // Accepted / Wrong Answer
  runtime: { type: String },
  memory: { type: String },
  passed: { type: Number },
  total: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);
