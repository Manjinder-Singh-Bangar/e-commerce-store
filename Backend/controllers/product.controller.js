import { client } from "../lib/redis.js";
import Product from "../models/product.model.js"
import cloudinary, { deleteOnCloudinary, uploadOnCloudinary } from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
           products
        })
    } catch (error) {
        return res.status(500).json({message: error.message || "Error while fecting all the products"})
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await client.get("featured_products");

        if(featuredProducts) return res.status(200).json({message: "Featured products fetched", featuredProducts})

        featuredProducts = await Product.find({isFeatured: true}).lean()

        if(!featuredProducts) return res.status(401).json({message: "Featured products not found"})
        
        await client.set("featured_products", JSON.stringify(featuredProducts))

        return res.status(200).json({message: "Featured products found", featuredProducts})

    } catch (error) {
        return res.status(500).json({message: error.message || "Something went wrong while fetching the featured products"})
    }
}

export const createProduct = async (req, res) => {
    console.log(req)
    try {
        
        const {name, description, price, category, isFeatured } = req.body
        const {image} = req.files
        console.log("Image in the product controller ",image)
        if(!name || !description || !price || !category || !isFeatured){
            return res.status(401).json({message: "All fields are required"})
        }

        console.log(req.files)

        if(!image){
            return res.status(401).json({message: "Image is required"})
        }

        let imagePath = image[0].path;
        console.log(image)
        let cloudinaryResponse;
        try {
            cloudinaryResponse = await uploadOnCloudinary(imagePath);
            
        } catch (error) {
            console.log(error)
        }
        console.log("cloudinary response", cloudinaryResponse)
        const product = await Product.create(
            {
                name,
                description,
                price,
                category,
                image:cloudinaryResponse?.secure_url,
                isFeatured
            }
        )

        return res.status(201).json({message: "Product created", product})
        
    } catch (error) {
        return res.status(500).json({message: `Error in the create Product controller ${error.message}`|| "Something went wrong"})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

        const product = await Product.findById(id)

        if(!product) return res.status(404).json({message: "Product not found"})

        if(product.image){
            await deleteOnCloudinary(product.image)
        }

        await Product.findByIdAndDelete(id)

        return res.status(200).json({message: "Product deleted successfully"})
    } catch (error) {
        return res.status(500).json({message: error.message || "Something went wrong while deleting the product" })
    }
}

export const getRecommendation = async (req, res) =>{
    try {
        const products = await Product.aggregate([
            {
                $sample:{
                    size: 3,
                }
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    price: 1,
                    description: 1,
                    image: 1
                }
            }
        ])
        
        return res.status(200).json({message: "Recommended products fetched", data:products });
    } catch (error) {
        console.error("Error while getting products recommendations ",error);
        return res.status(500).json({message: "Something went wrong while getting recommendations"})
    }
}

export const getProductByCategory = async(req, res) => {
    try {
        const {category} = req.params;

        if(!category){
            return res.status(401).json({message: "Category is required in order to fetch products of specific category"})

        }

        const products = await Product.find({category})

        if(!products) return res.status(401).json({message: "products not found"})

        return res.status(200).json({message: "Products have been fetched", products})
    } catch (error) {
        console.error("Error from getProductByCategory", error)
        return res.status(500).json({message: error.message})
    }
}

const updateFeaturedProductCache = async () => {
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await client.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error occured during update Featured Products cache");
        return res.status(500).json({message: error.message || "Error occured while updating featured product cache"})
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id) return res.status(401).json({message: "Id is required in order to change featured list of products"})
        
        const product = await Product.findById(id)

        if(product){
            product.isFeatured = !product.isFeatured
            const productUpdated = await product.save();
            await updateFeaturedProductCache();
            return res.status(203).json({message: "isfeatured has been toggeled", data: productUpdated})
        }else{
            return res.status(400).json({message: "Product not found"})
        }
    } catch (error) {
        console.error("Error occured during toggling the isFeatured option")
        return res.status(500).json({message: error.message || "Error occured during setting isFeatured"});
    }
}
