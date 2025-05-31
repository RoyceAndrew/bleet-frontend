import { create } from "zustand";
// import axios from "axios";

export const useLikeList = create((set) => ({
    likeList: [],
    setLikeList: (data: any) => set({ likeList: data }), 
    setLikeOptimistic: (data: any) => set((state: any) => ({ likeList: [...state.likeList, data] })),
    setDeleteLike: (data: any) => set((state: any) => ({ likeList: state.likeList.filter((like: any) => like.post_id !== data.post_id) })),
}));