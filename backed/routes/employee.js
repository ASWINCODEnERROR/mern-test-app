const express = require("express");
const multer = require("multer");
const mongoose = require('mongoose');

const Employee = require("../models/Employee"); // Import the Employee model
const router = express.Router();
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate unique file names
  },
});

const upload = multer({ storage: storage }); // Apply the storage configuration to multer

// POST route to add employee with image upload
router.post("/", upload.single("f_Image"), async (req, res) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } =
      req.body;

    // Validate the required fields
    if (
      !f_Name ||
      !f_Email ||
      !f_Mobile ||
      !f_Designation ||
      !f_Gender ||
      !f_Course ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required, including the image" });
    }
    const courses = typeof f_Course === "string" ? JSON.parse(f_Course) : f_Course;
    if (!Array.isArray(courses) || !courses.length) {
      return res.status(400).json({ message: "Invalid courses provided" });
    }
    // Create a new employee document
    const employee = new Employee({
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course:courses, // Ensure course is an array
      f_Image: req.file.path, // Store the uploaded file path
    });

    // Save the employee to the database
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (err) {
    console.error("Error adding employee:", err);
    res
      .status(500)
      .json({ message: "Error adding employee", error: err.message });
  }
  console.log('Received request body=-=-=-=-=-s:', req.body);
  console.log('File info:-=-=-==-=-=-', req.file);
});

// GET route to fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    res.status(200).json({ employees });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// GET route to fetch an employee by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
});

// PUT route to update an employee by ID
router.put("/:id", upload.single("f_Image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Handle optional file upload
    if (req.file) {
      updatedData.f_Image = req.file.path; // Update the file path
    }

    // Ensure f_Course is an array
    if (updatedData.f_Course) {
      if (typeof updatedData.f_Course === "string") {
        try {
          updatedData.f_Course = JSON.parse(updatedData.f_Course);
        } catch (error) {
          console.error("Error parsing f_Course:", error);
          updatedData.f_Course = [updatedData.f_Course];
        }
      } else if (!Array.isArray(updatedData.f_Course)) {
        updatedData.f_Course = [updatedData.f_Course];
      }
    }

    // Update the employee in the database
    const employee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
});

// DELETE route to delete an employee by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Error deleting employee", error: err.message });
  }
});

module.exports = router;


// GET route to fetch all employees with filtering, sorting, and pagination
// router.get("/", async (req, res) => {
//   try {
//     const { search, sortBy, order = "asc", page = 1, limit = 10 } = req.query;
//     const query = {};

//     // Apply search filter
//     if (search) {
//       query.$or = [
//         { f_Name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
//         { f_Email: { $regex: search, $options: "i" } } // Case-insensitive search on email
//       ];
//     }

//     // Sorting
//     const sortOptions = {};
//     if (sortBy) {
//       sortOptions[sortBy] = order === "desc" ? -1 : 1;
//     }

//     // Pagination
//     const skip = (page - 1) * limit;
//     const employees = await Employee.find(query)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Total count for pagination
//     const totalCount = await Employee.countDocuments(query);

//     res.status(200).json({
//       employees,
//       totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       currentPage: parseInt(page),
//     });
//   } catch (err) {
//     console.error("Error fetching employees:", err);
//     res.status(500).json({ message: "Error fetching employees", error: err.message });
//   }
// });
// router.put("/:id/active", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isActive } = req.body; // Pass isActive in the request body
//     const employee = await Employee.findByIdAndUpdate(id, { isActive }, { new: true });

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     res.status(200).json({ message: "Employee status updated successfully", employee });
//   } catch (err) {
//     console.error("Error updating status:", err);
//     res.status(500).json({ message: "Error updating status", error: err.message });
//   }
// });
// module.exports = router;

