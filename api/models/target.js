const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  name: { type: String, required: true, maxLength: 200 },
  style: {
    border: { type: String, required: true, maxLength: 20 },
    left: { type: Number, required: true, max: 8000 },
    top: { type: Number, required: true, max: 8000 },
  },
});

TargetSchema.pre("validate", function (next) {
  this.style.border === undefined ? (this.style.border = "none") : undefined;
  next();
});

// Export model
module.exports = mongoose.model("Target", TargetSchema);
