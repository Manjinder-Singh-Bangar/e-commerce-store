import Stripe from "stripe";
import { configDotenv } from "dotenv";
configDotenv();

console.log(process.env.STRIPE_SECRET_KEY)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);