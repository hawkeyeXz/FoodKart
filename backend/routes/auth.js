const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

const JWT_SECRET = "thisisasecretphrase"

// Route 1: Create a user - POST /api/auth/createuser
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email })
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User with this email already exists" })
      }

      const salt = await bcrypt.genSalt(10)
      const secPassword = await bcrypt.hash(req.body.password, salt)

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      })

      res.json({ success: true })
    } catch (error) {
      console.error("Error while creating user", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  },
)

// Route 2: Login a user - POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password", "Password cannot be blank").exists()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const userData = await User.findOne({ email })

      if (!userData) {
        return res.status(400).json({ success: false, message: "Invalid credentials" })
      }

      const pwdCompare = await bcrypt.compare(password, userData.password)

      if (!pwdCompare) {
        return res.status(400).json({ success: false, message: "Invalid credentials" })
      }

      const data = {
        user: {
          id: userData.id,
        },
      }

      const authToken = jwt.sign(data, JWT_SECRET)

      return res.json({
        success: true,
        authToken: authToken,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          location: userData.location,
          profilePic:
            userData.profilePic ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          phone: userData.phone || "",
        },
      })
    } catch (error) {
      console.error("Error while logging in:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  },
)

// Route 3: Get logged in user details - GET /api/auth/getuser
router.get("/getuser", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.json({ success: true, user })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Route 4: Update user profile - PUT /api/auth/updateprofile
router.put("/updateprofile", auth, async (req, res) => {
  try {
    const { name, location, phone, profilePic } = req.body
    const userId = req.user.id

    // Create update object
    const updateFields = {}
    if (name) updateFields.name = name
    if (location) updateFields.location = location
    if (phone) updateFields.phone = phone
    if (profilePic) updateFields.profilePic = profilePic

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true }).select("-password")

    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

module.exports = router

