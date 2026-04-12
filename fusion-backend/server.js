import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// ------------------------------
// ✅ Import Routes
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
// ✅ Security Middleware
// ------------------------------
app.use(helmet()); // 🔥 security + performance

// ------------------------------
// ✅ Rate Limiting (CRITICAL)
// ------------------------------
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 🔥 allow 120 requests per minute per IP
  message: "Too many requests, please try again later.",
});

app.use("/api", limiter);

// ------------------------------
// ✅ CORS
// ------------------------------


// ------------------------------
// ✅ CORS (FIXED)
// ------------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// ------------------------------
// ✅ Body Parser (optimized)
// ------------------------------
app.use(express.json({ limit: "1mb" })); // 🔥 prevent heavy payload crash

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
// ✅ MongoDB Connection (OPTIMIZED)
// ------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // 🔥 prevents overload
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ------------------------------
// ✅ MongoDB Events (minimal logs)
// ------------------------------
mongoose.connection.on("connected", () => {
  console.log("📦 DB Ready");
});

mongoose.connection.on("error", (err) => {
  console.error("DB Error:", err.message);
});

// ------------------------------
// ✅ Root Route
// ------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Fusion Backend Running");
});

// ------------------------------
// ✅ Global Error Handler
// ------------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ msg: "Internal Server Error" });
});

// ------------------------------
// ✅ Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});