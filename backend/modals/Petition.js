const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  petitioner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  response: { type: String },
});

module.exports = mongoose.model("Petition", petitionSchema);
