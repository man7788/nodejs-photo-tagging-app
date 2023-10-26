const express = require("express");
const router = express.Router();

const targetsController = require("../controllers/targetsController");
const scoresController = require("../controllers/scoresController");

router.get("/targets", targetsController.targets);
router.post("/target/create", targetsController.create_target);

router.get("/highscore", scoresController.scores);
router.post("/score/create", scoresController.create_score);

module.exports = router;
