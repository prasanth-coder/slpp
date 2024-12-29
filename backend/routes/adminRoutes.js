const express = require("express");
const Petition = require("../modals/Petition");

const router = express.Router();

// View All Petitions
router.get("/petitions", async (req, res) => {
  try {
    const petitions = await Petition.find().populate("petitioner", "email fullName");
    res.json({ petitions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Respond to a Petition
router.post("/petitions/:id/respond", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ error: "Petition not found." });

    petition.status = "closed";
    petition.response = response;
    await petition.save();
    res.json({ message: "Response added and petition closed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
