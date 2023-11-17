const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

const scoresController = require("../controllers/scoresController");

// Get highscore
router.get("/highscore", scoresController.scores);

// Create new highscore (protected)
router.post("/create", verifyToken, scoresController.create_score);

module.exports = router;
