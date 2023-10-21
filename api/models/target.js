const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  coordX: { type: String, required: true, maxLength: 20 },
  coordY: { type: String, required: true, maxLength: 20 },
  // coordX: { type: Schema.Types.Decimal128, required: true },
  // coordY: { type: Schema.Types.Decimal128, required: true },
});

// Export model
module.exports = mongoose.model("Target", TargetSchema);
