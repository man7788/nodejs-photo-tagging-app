const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verifyToken");

const targetsController = require("../controllers/targetsController");
const scoresController = require("../controllers/scoresController");
const usersController = require("../controllers/usersController");

// router.post("/token", usersController.token);
router.post("/token", usersController.fetch_token);

router.get("/targets", targetsController.targets);
router.post("/target/create", verifyToken, targetsController.create_target);

router.get("/highscore", scoresController.scores);
router.post("/score/create", verifyToken, scoresController.create_score);

module.exports = router;
