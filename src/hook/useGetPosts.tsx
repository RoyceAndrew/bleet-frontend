import { create } from "zustand";
import axios, { AxiosError } from "axios";

const useGetPosts = create<any>((set) => ({
    posts: [],
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
    streamPost: async () => {
        const eventSource = new EventSource(
          "http://localhost:3000/api/post/stream",
          { withCredentials: true }
        );

        eventSource.onmessage = (event) => {
            try {
          const data = JSON.parse(event.data);
          set(() => ({
            posts: [...data],
            isLoading: false,
          }));
        } catch (error: unknown | Error | AxiosError) {
          if (error instanceof AxiosError) {
            console.log(error);
          } else {
            console.log(error);
          }
        }
        };
        eventSource.onerror = (err) => {
            console.log(err);
          set({ posts: [], isLoading: false });
          setTimeout(() => useGetPosts.getState().streamPost(), 3000);
        };
    
        return () => eventSource.close();
      },
    deletePost: async (data: any) => {
        set((state: any) => ({
            posts: state.posts.filter((post: any) => post.id !== data.postId),
        }))
    },
    logout: () => set({ posts: [], isLoading: true }),    
}));

export default useGetPosts;