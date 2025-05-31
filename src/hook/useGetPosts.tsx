import { create } from "zustand";
import axios, { AxiosError } from "axios";

const useGetPosts = create<any>((set) => ({
    posts: [],
    isLoading: true,
    comments: [],
    follower: [],
    following: [],
    eventSource: null,

    getPosts: async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post", {
                withCredentials: true,
            });
            const result = response.data.posts;
            const comments = response.data.comments;
            set({ posts: result, comments: comments, follower: response.data.followers, following: response.data.following, isLoading: false });
        } catch (error: unknown | Error | AxiosError) {
            if (error instanceof AxiosError) {
                console.log(error);
            } else {
                console.log(error);
            }
        }
    },
    getFollowPosts: async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/followPosts", {
                withCredentials: true,
            });
            const result = response.data.posts;
            const comments = response.data.comments;
            set({ posts: result, comments: comments, follower: response.data.followers, following: response.data.following, isLoading: false });
        } catch (error: unknown | Error | AxiosError) {
            if (error instanceof AxiosError) {
                console.log(error);
            } else {
                console.log(error);
            }
        }
    },
    setFollower: (data: any) => set((state: any) => ({ follower: [...state.follower, data] })),
    setUnfollow: (data: any) => set((state: any) => ({ follower: state.follower.filter((follower: any) => !(follower.user_id === data.user_id && follower.following_id === data.following_id)) })),
    deletePost: async (data: any) => {
        set((state: any) => ({
            posts: state.posts.filter((post: any) => post.id !== data.postId),
        }))
    },
    logout: () => set({ posts: [], isLoading: true }),    
}));

export default useGetPosts;