import Medicine from "../models/Medicine.js";

// Get all medicines
export const getProducts = async (req, res) => {
    try {
        const medicines = await Medicine.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: medicines });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get single medicine details
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.json({ success: false, message: "Medicine not found" });
        }
        res.json({ success: true, data: medicine });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Add a new medicine (Admin function)
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock, minThreshold, dosage, ingredients, warnings } = req.body;
        const medicine = await Medicine.create({
            name,
            description,
            price: Number(price),
            image,
            category,
            stock: Number(stock),
            minThreshold: Number(minThreshold || 10),
            dosage: dosage || "",
            ingredients: ingredients || "",
            warnings: warnings || ""
        });
        // We set the custom 'id' field to match the DB string _id for frontend compatibility
        medicine.id = medicine._id.toString();
        await medicine.save();

        res.json({ success: true, message: "Medicine added successfully", data: medicine });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update an existing medicine (Admin function)
export const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.json({ success: false, message: "Medicine not found" });
        }
        res.json({ success: true, message: "Medicine updated successfully", data: updated });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Delete a medicine (Admin function)
export const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Medicine.findByIdAndDelete(id);
        if (!deleted) {
            return res.json({ success: false, message: "Medicine not found" });
        }
        res.json({ success: true, message: "Medicine deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}
