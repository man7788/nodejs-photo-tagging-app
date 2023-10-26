const { body, validationResult } = require("express-validator");
const Score = require("../models/score");
const asyncHandler = require("express-async-handler");

exports.scores = asyncHandler(async (req, res, next) => {
  const scores = await Score.find({}).sort({ score: 1 });
  res.json(scores);
});

exports.create_score = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("time", "Time must not be empty.")
    .trim()
    .isLength({ max: 200 })
    .escape(),
  body("score", "Score must not be empty.")
    .trim()
    .isLength({ max: 200 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const score = new Score({
      name: req.body.name,
      time: req.body.time,
      score: req.body.score,
    });

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      await score.save();
      res.json(score);
    }
  }),
];
