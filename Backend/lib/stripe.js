import Stripe from "stripe";
import { configDotenv } from "dotenv";
configDotenv();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);