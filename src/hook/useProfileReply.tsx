import { create } from "zustand";

export const useProfileReply = create((set) => ({
    replies: [],
    setReplies: (data: any) => set({ replies: data }),
    deleteReplies: (data: any) => set((state: any) => ({ replies: state.replies.filter((reply: any) => reply.post.id !== data)  })),
}));