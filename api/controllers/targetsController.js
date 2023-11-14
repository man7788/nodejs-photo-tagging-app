const { body, validationResult } = require("express-validator");
const Target = require("../models/target");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.names = asyncHandler(async (req, res, next) => {
  const names = await Target.find({}, "name -_id");
  res.json(names);
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
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          await target.save();
          res.status(201).json(target);
        }
      });
    }
  }),
];

exports.check_target = asyncHandler(async (req, res, next) => {
  const target = await Target.findOne({ name: req.body.selection });

  const top = target.style.top;
  const left = target.style.left;

  const topLimit = target.style.top + req.body.range.topRange;
  const leftLimit = target.style.left + req.body.range.leftRange;

  const clickPosTop = req.body.position.top;
  const clickPosLeft = req.body.position.left;

  if (
    clickPosTop >= top &&
    clickPosTop <= topLimit &&
    clickPosLeft >= left &&
    clickPosLeft <= leftLimit
  ) {
    res.status(201).json({
      result: true,
      position: { top: target.style.top, left: target.style.left },
    });
  } else {
    res.status(201).json({ result: false });
  }
});
