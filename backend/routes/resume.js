const express = require("express");
const jwt = require("jsonwebtoken");
const Applicant = require("../model"); // Import Mongoose model
const router = express.Router();
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET; // Replace with env variable in production

// Resume Search API
router.post("/search", async (req, res) => {
  try {
    // Extract JWT from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    try {
      jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Extract name from request body
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Bad Request: Name is required" });
    }

    // Perform case-insensitive search in MongoDB
    const searchResults = await Applicant.find({
      name: { $regex: new RegExp(name, "i") }, // Case-insensitive search
    });

    // If no matching records found
    if (searchResults.length === 0) {
      return res.status(404).json({ error: "No records found for the given name" });
    }

    // Return matching results
    res.status(200).json({ results: searchResults });

  } catch (error) {
    console.error("Error searching resumes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
