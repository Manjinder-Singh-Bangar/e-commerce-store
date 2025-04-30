import {create} from "zustand"
import {toast} from "react-hot-toast"
import axios from "../lib/axios.js"

export const useUserStore = create((set, get) => (
    {
        user: null,
        loading: false,
        checkingAuth: false,

        signup: async ({email, name, password, confirmPassword}) => {
            set({loading: true})

            if(password !== confirmPassword){
                set({loading: false})
                toast.error("Password does not match")
                return;
            }

            try {
                const res = await axios.post("/auth/signup", {email, name, password});
                set({user: res.data.user, loading: false});
                toast.success("Signup successfully")
            } catch (error) {
                set({loading: false})
                console.log()
                toast.error(error.response.data.message || "An error occured, please try again")
            }
        },

        login: async (email, password) => {
            set({loading: true})

            try {
                const res = await axios.post("/auth/login", {email, password});
                set({user: res.data.user, loading: false});
                toast.success("LoggedIn successfully");
                return 0;
            } catch (error) {
                set({loading: false});
                toast.error(error.response.data.message || "An error occured, please try again")
                throw new Error(error);
            }
        },

        checkAuth: async () => {
            set({checkingAuth: true});

            try {
                const res = await axios.get("/auth/profile")
                
                set({user: res.data.user, checkingAuth:false})
            } catch (error) {
                set({ checkingAuth: false, user: null });
                console.error(error.response.data.message || "Something went wrong")
                
            }

        },
        
        logout: async () => {
            try {
                await axios.post("/auth/logout");
                set({user:null})
                toast.success("Logged out successfully")
            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong while logging out")
            }
            
        }
    }
))