import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  extraField: { type: String }, // roll number / teacher ID

  // ⭐ Add this leaderboard stat field
  totalAccepted: { type: Number, default: 0 }
});

export default mongoose.model("User", userSchema);
