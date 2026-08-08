import Order from "../models/Order.js";
import { inngest } from "../inngest/index.js";
import User from "../models/User.js";
import { getOrCreateUser } from "../utils/syncUser.js";

// Place a new order
export const placeOrder = async (req, res) => {
    try {
        const userId = req.auth().userId; // Extracted from Clerk middleware token validation
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { items, shippingDetails, paymentMethod, paymentStatus, subtotal, discount, tax, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must include at least one item." });
        }

        // Fetch user or sync on-demand to guarantee email/name availability
        const user = await getOrCreateUser(userId);
        const userEmail = user ? user.email : "unknown@clerk.com";
        const userName = user ? user.name : "Valued Customer";

        const deliveryAddress = [shippingDetails?.address, shippingDetails?.city, shippingDetails?.zipCode]
            .filter(Boolean)
            .join(", ");

        const newOrder = await Order.create({
            user: userId,
            userEmail,
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
            deliveryAddress
        });

        // Trigger Inngest function asynchronously to send order confirmation email
        try {
            await inngest.send({
                name: "app/order.confirmed",
                data: {
                    orderId: newOrder._id.toString(),
                    userEmail,
                    userName,
                    items,
                    totalAmount: total
                }
            });
        } catch (inngestError) {
            console.error("Inngest trigger failed:", inngestError.message);
        }

        res.json({ success: true, message: "Order placed successfully", data: newOrder });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Fetch user's orders (All orders if admin, personal orders otherwise)
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.auth().userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Fetch or create user record to guarantee profile is in local DB
        const user = await getOrCreateUser(userId);
        const query = user?.role === "admin" ? {} : { user: userId };

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update order payment status (Mocking Stripe webhook or admin validation)
export const updateOrderPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: "Paid", status: "Shipped" }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order marked as paid", data: order });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
