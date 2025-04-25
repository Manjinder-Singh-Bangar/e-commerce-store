import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { client } from "../lib/redis.js";

const generateAccessToken = (userId) => {
    const accessToken = jwt.sign(
        {_id: userId},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"15m",
        }
    )

    return accessToken
}

const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign(
        {_id: userId},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    )

    return refreshToken
}


const storeRefreshToken = async (userId, refreshToken) => {
    await client.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60)
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if(!decoded) return res.status(400).json({message: "refresh token is not valid"})
        await client.del(`refresh_token:${decoded._id}`)
        return res
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .status(200)
                .json({message: "Logged out successfully"})

    } catch (error) {
        res.status(500).json({message: "Something went wrong while logging out user", error: error?.message})
    }
    res.send("Logout route called");
}

export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    
    try {
        const userExists = await User.findOne({email});
        console.log(userExists)
        if(userExists) return res.status(400).json({message : "User already exists"})

        const user = await User.create({name, email, password})

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)
        
        await storeRefreshToken(user._id, refreshToken)

        const options = {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }

        return res
                .status(201)
                .cookie("accessToken", accessToken, {...options, maxAge: 15 * 60 * 1000})
                .cookie("refreshToken", refreshToken, {...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
                .json({user:{
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, message: "User created successfully"})

    } catch (error) {
        return res.status(501).json({message: error.message || "Something went wrong while creating user"})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user) return res.status(401).json({message: "Try again with correct credentials"})
        
        const isPasswordCorrect = await user.comparePassword(password)
        
        if(!isPasswordCorrect) return res.status(401).json({message: "Try again with correct credentials"})
        
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        await client.set(`refresh_token:${user._id}`, refreshToken, "EX", 7*24*60*60);

        const options = {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }

        return res
                .status(200)
                .cookie("accessToken", accessToken, {...options, maxAge: 15 * 60 * 1000})
                .cookie("refreshToken", refreshToken, {...options, maxAge: 7 * 24 * 60 * 60 * 1000 })
                .json(
                    {
                        message: "LoggedIn succesfull",
                        user: {
                            _id:user._id,
                            name: user.name,
                            email: user.email,
                            role:user.role
                        }
                    })
    }


    catch (error) {
        console.log("Error occured in the login function ",error)
        res.status(500).json({message:error.message || "Something went wrong while log In"})
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) return res.status(401).json({message: "Refresh Token is not provided"})

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log(decoded)
        const storedRefreshToken = await client.get(`refresh_token:${decoded._id}`)
        console.log(storeRefreshToken === refreshToken)
        if(storedRefreshToken !== refreshToken){
            return res.status(401).json({message: "Refresh token is not valid"})
        }

        const accessToken = generateAccessToken(decoded._id)
        const options = {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }
        res.status(200).cookie("accessToken", accessToken, {...options, maxAge: 15 * 60 * 1000 }).json({message: "access token created"})
    } catch (error) {
        return res.status(500).json({message: error.message || "Something went wrong while refreshing access token"})
    }
}