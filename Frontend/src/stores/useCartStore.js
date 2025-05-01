import React from 'react'
import toast from 'react-hot-toast'
import axios from "../lib/axios.js"
import { create } from 'zustand'

export const useCartStore = create({
  cart:[],
  coupon: null,
  subtotal: 0,
  total: 0,

  getTheItemsInCart
})
