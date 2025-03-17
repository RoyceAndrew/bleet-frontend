import { create } from "zustand";
import axios from "axios";

export const useProfilePost = create((set) => ({
    posts: null,
    isLoading: true,
    getProfilePosts: async () => {
        try {
          const respond = await axios.get("http://localhost:3000/api/post/profilepost", {withCredentials: true})
          const result = respond.data.post
          console.log(result)
          set({posts: result, isLoading: false})
        } catch (err) {
          set({posts: null, isLoading: false})
        }
    },
}));
