const express = require("express");
const { signup, login, getUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Register new user
router.post("/signup", signup);

// Login user
router.post("/login", login);

// Get all users (except the logged-in user)
router.get("/users", authMiddleware, getUsers);

// Update user route (any authenticated user can update anyone)
router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    // Only allow updating certain fields
    const updates = { firstname, lastname, email };

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
