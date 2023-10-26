const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 200 },
  time: { type: String, required: true, maxLength: 200 },
  score: { type: String, required: true, maxLength: 200 },
});

// Export model
module.exports = mongoose.model("Score", ScoreSchema);
