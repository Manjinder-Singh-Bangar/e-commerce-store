import express from "express"
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupon)
router.post("/validate", protectedRoute, validateCoupon)

export default router