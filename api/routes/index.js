const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

const scoresController = require("../controllers/scoresController");
const usersController = require("../controllers/usersController");

// Get generated jwt from user input
// router.post("/token", usersController.token);

// Get jwt token
router.post("/token", usersController.fetch_token);

// Get highscore
router.get("/highscore", scoresController.scores);

// Create new highscore (protected)
router.post("/score/create", verifyToken, scoresController.create_score);

module.exports = router;
