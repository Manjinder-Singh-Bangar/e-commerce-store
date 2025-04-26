import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"

const app = express();

app.use(express.json())
app.use(cookieParser())
configDotenv()

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart",cartRoutes )
app.use("/api/coupon", couponRoutes)

app.listen(process.env.PORT, ()=> {
    connectDb();
    console.log("Server is running on the port",process.env.PORT);
});


