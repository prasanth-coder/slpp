const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const Petition = require("../modals/Petition");
const authenticate = require("../middleware/authenticate"); // Middleware for token verification

const router = express.Router();

// Register a Petitioner
router.post("/register", async (req, res) => {
  const { email, fullName, dob, password, bioId } = req.body;
  try {
    // Check if the email or bioId already exists
    const existingUser = await User.findOne({ $or: [{ email }, { bioId }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or BioID already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, fullName, dob, password: hashedPassword, bioId });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login a Petitioner
router.post("/login", async (req, res) => {

  console.log("login hit")
  const { email, password } = req.body;

  
  try {
    // if(email == 'admin@petition.parliament.sr' && password == '2025%shangrila'){
    //   const token = jwt.sign({ userId: email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // res.json({ token, message: "Login successful." });
    
    // }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials." });

    console.log(user.email + user.role)

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View All or Filtered Petitions
router.get("/petitions", authenticate, async (req, res) => {
  const { status } = req.query; // Capture the status query parameter
  try {
    const filter = status ? { status } : {}; // Apply filter if status exists
    const petitions = await Petition.find(filter).populate("petitioner", "email fullName");
    res.json({ petitions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign a Petition
router.post("/petitions/:id/sign", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Extract userId from token payload

  try {
    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ error: "Petition not found." });

    // Check if the user has already signed
    if (petition.signatures.includes(userId)) {
      return res.status(400).json({ error: "You have already signed this petition." });
    }

    petition.signatures.push(userId);
    await petition.save();
    res.json({ message: "Petition signed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a New Petition
router.post("/petitions", authenticate, async (req, res) => {
  const { title, text } = req.body;
  const userId = req.user.userId; // Extract userId from token payload

  try {
    const newPetition = new Petition({
      title,
      text,
      petitioner: userId,
    });
    await newPetition.save();
    res.status(201).json({ message: "Petition created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
