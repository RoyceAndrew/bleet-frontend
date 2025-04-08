import { create } from "zustand";
import axios, { AxiosError } from "axios";

const useGetPosts = create<any>((set, get) => ({
    posts: [],
    isLoading: true,
    eventSource: null,

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
      if (get().eventSource) {
        get().eventSource.close();
      }

        const eventSource = new EventSource(
          "http://localhost:3000/api/post/stream",
          { withCredentials: true }
        );

        set({ eventSource });

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
          set({ isLoading: false });
          setTimeout(() => useGetPosts.getState().streamPost(), 3000);
        };
    
        return () => eventSource.close();
      },
    closeEvent: () => {
        const eventSource = get().eventSource;
        if (eventSource) {
        eventSource.close();
        set({ eventSource: null });
        }
    },
    deletePost: async (data: any) => {
        set((state: any) => ({
            posts: state.posts.filter((post: any) => post.id !== data.postId),
        }))
    },
    logout: () => set({ posts: [], isLoading: true }),    
}));

export default useGetPosts;