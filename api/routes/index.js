const express = require("express");
const router = express.Router();

const coordsController = require("../controllers/coordsController");

router.get("/coords", coordsController.coords);
router.post("/target", coordsController.create_target);

module.exports = router;
