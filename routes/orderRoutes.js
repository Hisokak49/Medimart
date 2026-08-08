import express from "express";
import { placeOrder, getUserOrders, updateOrderPayment } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post('/', placeOrder);
orderRouter.get('/', getUserOrders);
orderRouter.post('/pay', updateOrderPayment);

export default orderRouter;
