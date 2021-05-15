const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: "String",
    required: true,
  },
  summary: {
    type: "String",
    required: true,
  },
  banner: {
    type: "String",
    required: true,
  },
  url: {
    type: "String",
    required: true,
  },
  posted: {
    type: "String",
    required: false,
  },
  time: {
    type: "String",
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("news", NewsSchema);
