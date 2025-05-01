import toast from "react-hot-toast";
import axios from "../lib/axios.js";
import { create } from "zustand";

export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({products}),

    createProduct: async (productData) => {
        set({loading: true})

        try {
            const res = await axios.post("/products/create-product", productData)
            set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
            toast.success("Product created successfully");
        } catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
    },

    fetchAllProducts: async () => {
        set({loading: true});

        try {
            const res = await axios.get("/products/")
            set({products: res.data.products, loading: false})
        } catch (error) {
            set({loading: false})
            toast.error(error.res.data.message || "Something went wrong")
        }
    },

    deleteProduct: async (id) => {
        set({loading: true});

        try {
            await axios.delete(`/products/delete-product/${id}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((item) => item._id !== id)
            }))
            toast.success("Product deleted")
            set({loading: false});
        } catch (error) {
            set({loading: false});
            console.log(error)
            toast.error(error.response);
        }
    },

    toggleFeaturedProduct: async(productId) => {
        set({loading: true})

        try {
            const response = await axios.patch(`/products/${productId}`)
            console.log(response.data.data)
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => {
                    return product._id === productId ? {...product, isFeatured: response.data.data.isFeatured} : product
                }),
                loading: false
            }))
            const {products} = get();
            console.log(products)
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.message || "Something went wrong")
        }
    },

    fetchProductByCategory: async (category) => {
        set({loading: true})

        try {
            const res = await axios.get(`/products/category/${category}`);
            set({products: res.data.products, loading:false});

        } catch (error) {
            console.error(error)
            set({loading:false})
            toast.error(error?.response?.data?.message || "Cannot find product of this category")
        }
    }
}))