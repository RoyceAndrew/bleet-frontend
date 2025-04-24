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
    setLikeOptimistic: (data: any) => set((state: any) => ({ likeList: [...state.likeList, data] })),
    setDeleteLike: (data: any) => set((state: any) => ({ likeList: state.likeList.filter((like: any) => like.post_id !== data.post_id) })),
}));