import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendation, toggleFeaturedProduct } from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured-products", getFeaturedProducts);
router.post("/create-product",protectedRoute, adminRoute, createProduct)
router.delete("/delete-product/:id", protectedRoute, adminRoute, deleteProduct);
router.get("/recommendations", protectedRoute, getRecommendation)
router.get("/category/:category", protectedRoute, getProductByCategory)
router.patch("/:id", protectedRoute, adminRoute, toggleFeaturedProduct)

export default router;