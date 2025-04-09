import { create } from "zustand";
// import axios from "axios";

export const useLikeList = create((set) => ({
    likeList: [],
    // getLikeList: async (data:string) => {
    //     try {
    //         const result = await axios.get(`http://localhost:3000/api/post/like/${data}`, { withCredentials: true });
    //         set({ likeList: result.data.data });
    //     } catch (error) {
    //         set({ likeList: [] });
    //     } 
    // },
    setLikeList: (data: any) => set({ likeList: data }), 
    
}));