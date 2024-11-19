const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash the password if it's modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next(); // Continue with the save
  } catch (err) {
    next(err); // If an error occurs, pass it to the next middleware
  }
});

// Method to compare password for login authentication
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model("User", UserSchema);
