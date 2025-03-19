import { create } from "zustand";
import axios from "axios";

export const useProfilePost = create((set) => ({
    posts: null,
    isLoading: true,
    getProfilePosts: async () => {
        try {
          const respond = await axios.get("http://localhost:3000/api/post/profilepost", {withCredentials: true})
          const result = respond.data.post
          set({posts: result, isLoading: false})
        } catch (err) {
          set({posts: null, isLoading: false})
        }
    },

  deleteProfilePost: async (data: any) => {
    try {
      await axios.delete("http://localhost:3000/api/post/delete", {data, withCredentials: true})
      set((state:any) => ({posts: state.posts.filter((post: any) => post.id !== data.postId), isLoading: false}))
    } catch (err) {
      set({posts: null, isLoading: false})
    }
  },
  logout: () => set({ posts: null, isLoading: true }),  
}));
