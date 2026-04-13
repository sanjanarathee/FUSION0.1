import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

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
// ✅ Security
// ------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ------------------------------
// ✅ Rate Limiting
// ------------------------------
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many requests, please try again later.",
});

app.use("/api", limiter);

// ------------------------------
// ✅ CORS (FINAL FIX)
// ------------------------------
// ------------------------------
// ✅ CORS (FINAL FIX)
// ------------------------------
app.use(cors({
  origin: "https://fusion-0-1.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ❌ REMOVE THIS LINE (important)
// app.options("*", cors());

// ------------------------------
// ✅ Body Parser
// ------------------------------
app.use(express.json({ limit: "1mb" }));

// ------------------------------
// ✅ Routes
// ------------------------------
app.use("/api/seed", seedRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ppt", pptRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/code", evaluatecodeRoutes);
app.use("/api/submit", submitRoutes);

// ------------------------------
// ✅ MongoDB
// ------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("📦 DB Ready");
});

mongoose.connection.on("error", (err) => {
  console.error("DB Error:", err.message);
});

// ------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Fusion Backend Running");
});

// ------------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});