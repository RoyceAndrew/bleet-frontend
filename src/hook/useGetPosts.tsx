import { create } from "zustand";
import axios, { AxiosError } from "axios";

const useGetPosts = create((set) => ({
    posts: null,
    isLoading: true,
    getPosts: async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/post", {
                withCredentials: true,
            });
            const result = response.data.post;
            set({ posts: result, isLoading: false });
        } catch (error: unknown | Error | AxiosError) {
            if (error instanceof AxiosError) {
                console.log(error);
            } else {
                console.log(error);
            }
        }
    },
    deletePost: async (data: any) => {
        set((state: any) => ({
            posts: state.posts.filter((post: any) => post.id !== data.postId),
        }))
    },
    logout: () => set({ posts: null, isLoading: true }),    
}));

export default useGetPosts;