import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ------------------------------
// ✅ Import All Routes
// ------------------------------
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import pptRoutes from "./routes/pptRoutes.js";
import evaluatecodeRoutes from "./routes/evaluatecodeRoutes.js"; 

dotenv.config();

const app = express();

// ------------------------------
// ✅ Middleware
// ------------------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ------------------------------
// ✅ Basic Routes
// ------------------------------
app.use("/api/seed", seedRoutes);
app.use("/api/code", submitRoutes);
app.use("/api/notes", notesRoutes);

// ------------------------------
// ✅ Register All Feature Routes
// ------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ppt", pptRoutes);
app.use("/api/assignments", assignmentRoutes);

// ⭐ GLOBAL Coding Practice Routes
app.use("/api/coding", codingRoutes);

// ⭐ Judge0 / code execution route
app.use("/api/code", evaluatecodeRoutes);


app.use("/api/submit", submitRoutes);


// ------------------------------
// ✅ MongoDB Connection
// ------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

connectDB();

// Optional debug logs
mongoose.connection.on("connected", () => {
  console.log("📦 Mongoose is connected & ready!");
});
mongoose.connection.on("error", (err) => {
  console.error("⚠️ Mongoose Error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("🔌 MongoDB Disconnected!");
});

// ------------------------------
// ✅ Root Route
// ------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Fusion Backend Server is Running Perfectly!");
});

// ------------------------------
// ✅ Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
