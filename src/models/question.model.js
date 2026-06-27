const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator(options) {
          return Array.isArray(options) && options.filter(Boolean).length >= 2;
        },
        message: "Question must have at least 2 options",
      },
    },
    keyword: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(value) {
          return Array.isArray(this.options) && value < this.options.length;
        },
        message: "Correct answer index must match an option",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
