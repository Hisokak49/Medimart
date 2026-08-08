const express = require("express");
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.post("/", protect, createMedicine);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);

module.exports = router;
