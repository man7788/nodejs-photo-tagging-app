const express = require("express");
const router = express.Router();

const targetsController = require("../controllers/targetsController");

router.get("/targets", targetsController.targets);
router.post("/target/create", targetsController.create_target);

module.exports = router;
