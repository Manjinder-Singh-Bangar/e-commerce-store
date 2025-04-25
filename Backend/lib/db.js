import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`Error connecting to MongoDB ${error.message}`);
        process.exit(1);
    }
}