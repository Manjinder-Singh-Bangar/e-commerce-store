import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) return res.status(401).json({message: "Token not provided"});

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if(!decoded) return res.status(401).json({message: "Token is not valid"});
    
            const user = await User.findById({_id: decoded._id}).select("-password");
    
            if(!user) return res.status(401).json({message: "Unauthorized - User not found"})
    
            req.user = user;
    
            next()
            
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message: "Unauthorized - Token is not authenticated"})
            }
            throw Error;
        }
        
    } catch (error) {
        return res.status(500).json({message: "Something went wrong while verifying accessToken"})
    }
}

export const adminRoute = async (req, res, next) => {
    try {
        const user = req.user

        if(user.role && user.role === "admin") {
            next()
        }else{
            return res.status(403).json({message: "Access denied - Admin Only"})
        }
    } catch (error) {
        return res.status(500).json({message: "Something went wrong while verifying the admin route"})
    }
}