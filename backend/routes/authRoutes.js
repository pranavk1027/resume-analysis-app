const express = require("express");
const jwt = require("jsonwebtoken");
const pdf = require("pdf-parse"); // Library for extracting text from PDF
const axios = require("axios"); // To fetch the PDF file
const fs = require("fs");
const path = require("path");
const generateResumeJSON = require("../gemini");

const route = express.Router();

let user = {
  username: "naval.ravikant",
  password: "05111974"
};

// Login route (unchanged)
route.post("/login", (req, res) => {
  let { username, password } = req.body;
  try {
    if (username === "naval.ravikant" && password === "05111974") {
      let token = jwt.sign(user, process.env.JWT_SECRET);
      return res.status(200).json({ message: "ho gya login", token });
    }
  } catch (error) {
    console.log("error");
  }
});
let a;
// PDF extraction route
route.post("/extract-pdf", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { url } = req.body; // Get PDF URL from request body

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify JWT
    jwt.verify(token, process.env.JWT_SECRET);

    // Download the PDF file
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(response.data);

    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);
    a=pdfData.text;
    console.log(pdfData.text);
    
    generateResumeJSON(a);

    return res.status(200).json({ text: pdfData.text });

  } catch (error) {
    return res.status(401).json({ message: "Invalid token or error processing PDF" });
  }
});

 


module.exports = {route,a};

