const { body, validationResult } = require("express-validator");
const Target = require("../models/target");
const asyncHandler = require("express-async-handler");

exports.targets = asyncHandler(async (req, res, next) => {
  const targets = await Target.find();
  res.json(targets);
});

exports.create_target = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ maxLength: 200 })
    .escape(),
  body("border", "Border must not be empty.")
    .trim()
    .isLength({ maxLength: 100 })
    .escape(),
  body("left", "Left must not be empty.")
    .trim()
    .isLength({ maxLength: 20 })
    .escape(),
  body("top", "top must not be empty.")
    .trim()
    .isLength({ maxLength: 20 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const target = new Target({
      name: req.body.name,
      style: {
        left: req.body.left,
        top: req.body.top,
      },
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
