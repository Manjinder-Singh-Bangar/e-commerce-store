import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({userId: req.user._id, isActive: true})
        return res.json(coupon || null)
    } catch (error) {
        console.log("Error while getting coupon ", error)
        return res.status(500).json({message: error.message || "Server Error",})
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body;

        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true})

        if(!coupon) return res.status(404).json({message: "Coupon not found"})

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false
            await coupon.save()
            return res.status(403).json({message: "Coupon is not valid"})
        } 

        return res.status(200).json({message: "Coupon is valid", data: {
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        }})
        
    } catch (error) {
        console.log("Error in validating coupon ", error)
        return res.status(500).json({message: error.message || "Something went wrong while validating coupon" })
    }
}