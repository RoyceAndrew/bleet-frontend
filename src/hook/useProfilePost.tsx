import { create } from "zustand";
import axios from "axios";

export const useProfilePost = create((set) => ({
  posts: [],
  isLoading: true,
  getProfilePosts: async () => {
    try {
      const respond = await axios.get(
        import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/profilepost",
        { withCredentials: true }
      );
      const result = respond.data.post;
      set({ posts: result, isLoading: false });
    } catch (err) {
      set({ posts: [], isLoading: false });
    }
  },

  deleteProfilePost: async (data: any) => {
    try {
      await axios.delete(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/delete", {
        data,
        withCredentials: true,
      });
      set((state: any) => ({
        posts: state.posts.filter((post: any) => post.id !== data.postId),
        isLoading: false,
      }));
    } catch (err) {
      set({ posts: [], isLoading: false });
    }
  },
  logout: () => set({ posts: [], isLoading: true }),
}));
