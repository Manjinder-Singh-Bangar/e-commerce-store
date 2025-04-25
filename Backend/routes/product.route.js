import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendation } from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured-products", getFeaturedProducts);
router.post("/create-product",protectedRoute, adminRoute, upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]), createProduct)
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);
router.get("/recommendations", protectedRoute, getRecommendation)
export default router;