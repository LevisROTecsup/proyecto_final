const mongoose = require("mongoose");

const thesisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  file: {
    uuid: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    extension: {
      type: String,
      required: true
    }
  },
  theme: {
    type: String,
    required: true
  },
  contents: {
    type: [String],
    required: true
  },
  key_words: {
    type: [String],
    required: true
  },
  num_reviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ["PRIVATE", "PUBLIC"],
    default: "PUBLIC"
  },
  authors: {
    type: [String],
    required: true
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      }
    },
  ],
  published_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model("Thesis", thesisSchema);