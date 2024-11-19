const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true, unique: true },
  f_Mobile: { type: Number, required: true },
  f_Designation: { type: String, required: true },
  f_Gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  f_Course: { type: [String], required: true, enum: ['MCA', 'BCA', 'BSC'] },
  f_Image: { type: String, required: true },
  f_CreateDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // Active/Deactive field
}, { timestamps: true });


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
