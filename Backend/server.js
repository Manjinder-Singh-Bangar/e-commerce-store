import express from "express";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json())
app.use(cookieParser())
configDotenv()

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.listen(process.env.PORT, ()=> {
    connectDb();
    console.log("Server is running on the port",process.env.PORT);
});


