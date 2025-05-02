import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);

        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId)
        }

        await user.save();
        return res.json({data: user.cartItems})
    } catch (error) {
        console.error("Error occured while adding to cart", error)
        return res.status(401).json({message: error.message || "Error occured while add to cart" })
    }
}

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body

        const user = req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId)

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item !== productId)
                await user.save();
                return res.json({data: user.cartItems});
            }

            existingItem.quantity = quantity;
            await user.save();
            return res.json({data: user.cartItems})
        }
    } catch (error) {
        console.error("Error while updating the quantity", error)
        return res.status(500).json({message: error.message || "Something went wrong while updating the quantity"})
    }
}

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({_id: {$in: req.user.cartItems}})

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItems) => cartItems.id === product.id);
            return {...product.toJSON(), quantity: item.quantity};
        })

        return res.json(cartItems);
    } catch (error) {
        console.error("Error in while getting the items in the cart", error)
        return res.status(500).json({message: "Something went wrong while getting the cart products"});
        
    }
}