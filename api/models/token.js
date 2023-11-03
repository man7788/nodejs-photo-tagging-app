const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  handler: { type: String, required: true, minLength: 1, maxLength: 50 },
  token: { type: String, minLength: 1, maxLength: 1000 },
});

// Export model
module.exports = mongoose.model("Token", TokenSchema);
