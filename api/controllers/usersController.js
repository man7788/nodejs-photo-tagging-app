const { body, validationResult } = require("express-validator");
const Token = require("../models/token");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Handle generate token on POST
exports.token = asyncHandler(async (req, res, next) => {
  jwt.sign({ user: req.body.user }, "secretkey", (err, token) => {
    if (err) {
      return next(err);
    }
    try {
      res.json({ token });
    } catch (err) {
      return next(err);
    }
  });
});

// Handle fetch token on GET
exports.fetch_token = [
  body("handler", "Handler must be provided.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const token = await Token.findOne(
      { handler: req.body.handler },
      "token -_id"
    );

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    } else {
      res.status(201).json(token);
    }
  }),
];
