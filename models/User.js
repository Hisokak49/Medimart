import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Mapped directly to Clerk User ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    role: { type: String, default: "customer" }, // 'customer' or 'admin'
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" }
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);

export default User;
