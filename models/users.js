// Require
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

// Model
module.exports = mongoose.model("users", {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
