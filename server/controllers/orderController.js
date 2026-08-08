const Order = require("../models/Order");
const sendResponse = require("../utils/response");

const getOrders = async (req, res, next) => {
  try {
    const query = req.user?.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "Orders fetched successfully.", orders);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingDetails, paymentMethod, paymentStatus, subtotal, discount, tax, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error("Order must include at least one item.");
      error.statusCode = 400;
      throw error;
    }

    const deliveryAddress = [shippingDetails?.address, shippingDetails?.city, shippingDetails?.zipCode]
      .filter(Boolean)
      .join(", ");

    const order = await Order.create({
      user: req.user._id,
      userEmail: req.user.email,
      items,
      shippingDetails,
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      tax: Number(tax || 0),
      total: Number(total || 0),
      status: paymentStatus === "Paid" ? "Shipped" : "Processing",
      receiptId: `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      deliveryAddress,
    });

    return sendResponse(res, 201, true, "Order created successfully.", order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  createOrder,
};
