const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    minThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dosage: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    ingredients: {
      type: String,
      default: "",
    },
    warnings: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicine", medicineSchema);
