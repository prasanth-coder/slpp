const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  bioId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["petitioner", "admin"], default: "petitioner" },
});

module.exports = mongoose.model("User", userSchema);
