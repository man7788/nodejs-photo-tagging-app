const { body, validationResult } = require("express-validator");
const Target = require("../models/target");
const asyncHandler = require("express-async-handler");

exports.coords = asyncHandler(async (req, res, next) => {
  const coords = await Target.find();
  res.json(coords);
});

exports.create_target = [
  body("coordx", "CoordX must not be empty.")
    .trim()
    .isLength({ max: 20 })
    .escape(),
  body("coordy", "CoordY must not be empty.")
    .trim()
    .isLength({ max: 20 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const target = new Target({
      coordX: req.body.coordx,
      coordY: req.body.coordy,
    });

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      await target.save();
      res.json(target);
    }
  }),
];
