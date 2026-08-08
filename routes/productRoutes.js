import express from "express";
import { getProducts, getProductById, addProduct, updateMedicine, deleteMedicine } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', addProduct);
productRouter.put('/:id', updateMedicine);
productRouter.delete('/:id', deleteMedicine);

export default productRouter;
