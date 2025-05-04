import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import path from "path"


const app = express();

app.use(express.json({limit: "10mb"}))
app.use(cookieParser())
configDotenv()

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart",cartRoutes )
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/Frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}

app.listen(process.env.PORT, ()=> {
    connectDb();
    console.log("Server is running on the port",process.env.PORT);
});


