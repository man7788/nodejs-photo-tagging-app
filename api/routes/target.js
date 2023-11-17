const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

const targetsController = require("../controllers/targetsController");

// Get all target names
router.get("/names", targetsController.names);

// Check target from user input
router.post("/check", targetsController.check_target);

// Create new target (protected)
router.post("/create", verifyToken, targetsController.create_target);

module.exports = router;
