const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const petitionerRoutes = require("./routes/petitionerRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    console.error("Critical environment variables are missing.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Using built-in middleware for parsing JSON

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api/petitioner", petitionerRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'An unexpected error occurred!' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
