const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

const targetsController = require("../controllers/targetsController");
const scoresController = require("../controllers/scoresController");
const usersController = require("../controllers/usersController");

// Get generated jwt from user input
// router.post("/token", usersController.token);

// Get jwt token
router.post("/token", usersController.fetch_token);

// Get all target names
router.get("/target/names", targetsController.names);

// Check target from user input
router.post("/target/check", targetsController.check_target);

// Create new target (protected)
router.post("/target/create", verifyToken, targetsController.create_target);

// Get highscore
router.get("/highscore", scoresController.scores);

// Create new highscore (protected)
router.post("/score/create", verifyToken, scoresController.create_score);

module.exports = router;
