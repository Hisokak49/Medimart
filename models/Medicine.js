import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    minThreshold: { type: Number, default: 10 },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    dosage: { type: String, default: "" },
    description: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    warnings: { type: String, default: "" },
    image: { type: String, default: "" },
    id: { type: String }
}, { timestamps: true });

// Normalize the output by exposing id (from _id) in JSON output
medicineSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        return ret;
    }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
