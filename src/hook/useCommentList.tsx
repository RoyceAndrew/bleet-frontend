import { create } from "zustand";

export const useCommentList = create((set) => ({
    commentList: [],

    updateCommentList: (data: any) => set({ commentList: data }),
}));