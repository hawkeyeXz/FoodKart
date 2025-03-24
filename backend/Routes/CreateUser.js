const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'thisisasecretphrase'

router.post(
    "/createuser",
    [
      body("email").isEmail(),
      body("name").isLength({ min: 3 }),
      body("password", "Incorrect Password").isLength({ min: 8 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
        }
  
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
  
    
        const newUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPassword,
          location: req.body.location,
        });
  
        res.json({ success: true });
      } catch (error) {
        console.error("Error while creating user", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
  

router.post(
    "/loginuser",
    [
      body("email").isEmail(),
      body("password", "Incorrect Password").isLength({ min: 8 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        let userData = await User.findOne({ email });
  
        if (!userData) {
          console.log("User not found");
          return res.status(400).json({ message: "Invalid credentials" });
        }
  
        console.log("Stored Password:", userData.password);
        console.log("Entered Password:", password);
        
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password); 
  
        if (!pwdCompare) {
          console.log("Password mismatch");
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const data = {
          user: {
            id: userData.id,
          },
        };

        const authToken = jwt.sign(data, JWT_SECRET);


        return res.json({success: true, authToken:authToken} );
      } catch (error) {
        console.error("Error while logging in:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
);

module.exports = router;
