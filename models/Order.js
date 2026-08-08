import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingDetails: {
      name: String,
      address: String,
      city: String,
      zipCode: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      default: "Processing",
    },
    receiptId: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.id || ret._id.toString();
    return ret;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
