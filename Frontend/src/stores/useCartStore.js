import React from 'react'
import toast from 'react-hot-toast'
import axios from "../lib/axios.js"
import { create } from 'zustand'


export const useCartStore = create((set,get) => ({
  cart:[],
  coupon: null,
  subtotal: 0,
  total: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons")
      set({coupon: response.data})

    } catch (error) {
      console.error("Error fetching coupon", error)
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", {code})
      set({coupon:response.data.data, isCouponApplied: true})
      get().calculateTotals();
      toast.success("Coupon applied successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to validate coupon")
    }
  },

  removeCoupon:() => {
    set({coupon:null, isCouponApplied: false})
    get().calculateTotals();
    toast.success("Coupon removed")
  },

  getCartItems: async () =>{
    try {
      const res = await axios.get("/cart")
      set({cart: res.data})
      get().calculateTotals();
    } catch (error) {
      set({cart: []})
      toast.error(error.response.data.message || "Cannot get the cart items")
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", {productId: product._id})
      
      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
        ? prevState.cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      )
      : [...prevState.cart, { ...product, quantity: 1 }];
      return { cart: newCart };
    });
    get().calculateTotals();
    toast.success("Product has been added to the cart")
    } catch (error) {
      toast.error(error?.res?.data?.message || "Cannot add item to cart")
    }
  },

  calculateTotals: async (product) => {
    const {cart, coupon} = get();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    let total = subtotal;

    if(coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount
    }
    set({subtotal, total});
  },

  removeFromCart: async (productId) => {
    set({loading: true});

    try {
      const res = await axios.delete("/cart", {data:{productId}})
      set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		  get().calculateTotals();
      toast.success("Product deleted from cart")
    } catch (error) {
      set({loading:false})
      console.error(error)
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({loading: true})

    try {
      if(quantity === 0){
        get().removeFromCart(productId);
        return;
      }else{
        await axios.put(`/cart/${productId}`, {quantity})
        set((prevState) => ({cart: prevState.cart.map((item) => item._id === productId  ?{ ...item, quantity }: item )}))
        get().calculateTotals();
      }
    } catch (error) {
      console.error(error)
    }
  },

  clearCart: async () => {

    try {
      const res = await axios.delete("/cart");
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
      
    } catch (error) {
      console.log(error)
    }

	},
}))
