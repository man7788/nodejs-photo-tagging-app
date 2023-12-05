const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 200 },
  time: { type: Number, required: true, max: 1000000 },
});

// Export model
module.exports = mongoose.model("Score", ScoreSchema);
