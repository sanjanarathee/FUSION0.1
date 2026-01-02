import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// ⭐ GET NOTES OF ANY UNIT (Dynamic)
router.get("/unit/:unitId", (req, res) => {
  const unit = req.params.unitId;

  // folder where teacher uploads files
  const notesFolder = path.join(process.cwd(), "uploads", `unit${unit}`, "notes");

  // If folder does not exist or empty
  if (!fs.existsSync(notesFolder)) {
    return res.json({ success: false, files: [] });
  }

  fs.readdir(notesFolder, (err, files) => {
    if (err || files.length === 0) {
      return res.json({ success: false, files: [] });
    }

    return res.json({
      success: true,
      files: files // return all uploaded notes
    });
  });
});

export default router;
