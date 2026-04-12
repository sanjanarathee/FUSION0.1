import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // 🔥 important for fast login
    },

    password: { type: String },
    passwordSet: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["student", "admin", "teacher", "test_student"],
      required: true,
      index: true, // 🔥 helps filtering
    },

    // ✅ approval
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === "teacher" ? false : true;
      },
      index: true, // 🔥 for queries
    },

    // 👇 students
    rollNumber: {
      type: String,
      trim: true,
      index: true, // 🔥 CRITICAL (login optimization)
    },

    section: { type: String, trim: true },

    // 👇 teachers
    sections: [{ type: String }],

    extraField: { type: String },

    totalAccepted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 compound index (optional but powerful)
userSchema.index({ email: 1, rollNumber: 1 });

export default mongoose.model("User", userSchema);