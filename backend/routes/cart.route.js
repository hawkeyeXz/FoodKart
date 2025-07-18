import express from "express";
const router = express.Router();
import { addToCart, getCart, removeFromCart, updateCartItem, clearCart } from "../controllers/cart.controller.js";

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem)
router.delete("/remove/:itemId", removeFromCart);
router.delete("/clear", clearCart);
export  default router;
