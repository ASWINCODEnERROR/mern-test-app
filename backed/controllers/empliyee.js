// server.js or employeeController.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const Employee = require("./models/Employee"); // Assuming you have an Employee model
const router = express.Router();

// Configure Multer to store files in a specific folder (uploads)
const upload = multer({
  dest: "uploads/", // Directory to save the uploaded images
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
    }
    cb(null, true);
  },
});

// POST route for creating an employee
router.post("/employees", upload.single("image"), async (req, res) => {
  try {
    const employee = new Employee({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      image: req.file.path, // Store image path in database
    });
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
