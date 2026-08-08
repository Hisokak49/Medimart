const Medicine = require("../models/Medicine");
const sendResponse = require("../utils/response");

const getMedicines = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "Medicines fetched successfully.", medicines);
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      const error = new Error("Medicine not found.");
      error.statusCode = 404;
      throw error;
    }

    return sendResponse(res, 200, true, "Medicine fetched successfully.", medicine);
  } catch (error) {
    next(error);
  }
};

const createMedicine = async (req, res, next) => {
  try {
    const { name, category, price, stock, minThreshold, dosage, description, ingredients, warnings, image, rating, reviewsCount } = req.body;

    if (!name || !category || price === undefined || stock === undefined) {
      const error = new Error("Please provide name, category, price, and stock.");
      error.statusCode = 400;
      throw error;
    }

    const medicine = await Medicine.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      minThreshold: minThreshold ? Number(minThreshold) : 10,
      dosage: dosage || "",
      description: description || "",
      ingredients: ingredients || "",
      warnings: warnings || "",
      image: image || "",
      rating: rating ? Number(rating) : 5,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
    });

    return sendResponse(res, 201, true, "Medicine created successfully.", medicine);
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      const error = new Error("Medicine not found.");
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = ["name", "category", "price", "stock", "minThreshold", "dosage", "description", "ingredients", "warnings", "image", "rating", "reviewsCount"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        medicine[field] = field === "price" || field === "stock" || field === "minThreshold" || field === "rating" || field === "reviewsCount"
          ? Number(req.body[field])
          : req.body[field];
      }
    });

    const updatedMedicine = await medicine.save();
    return sendResponse(res, 200, true, "Medicine updated successfully.", updatedMedicine);
  } catch (error) {
    next(error);
  }
};

const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      const error = new Error("Medicine not found.");
      error.statusCode = 404;
      throw error;
    }

    await medicine.deleteOne();
    return sendResponse(res, 200, true, "Medicine deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
