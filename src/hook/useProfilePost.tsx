import { create } from "zustand";
import axios from "axios";

export const useProfilePost = create((set) => ({
  posts: [],
  comments: [],
  profileUser: [],
  following: [],
  follower: [],
  isLoading: true,
  getProfilePosts: async (username: string) => {
    try {
      const respond = await axios.get(
        import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/post/profilepost/" + username,
        { withCredentials: true }
      );
      const { user, following, follower } = respond.data;
      const result = respond.data.posts;
      const comments = respond.data.comments;
      set({ posts: result, isLoading: false, comments: comments, profileUser: user, following:following, follower: follower });
    } catch (err) {
      console.log(err); 
      set({ posts: [], isLoading: false });
    }
  },
  editProfile: (data: any) =>
    set((state: any) => ({
      profileUser: { ...state.profileUser, ...data },
    })),
  setFollower: (data: any) => set((state: any) => ({ follower: [...state.follower, data]  })),
  setUnfollow: (data: any) => set((state: any) => ({ follower: state.follower.filter((follower: any) => follower.user_id !== data.user_id)  })),
  setFollowing: (data: any) => set((state: any) => ({ following: [...state.following, data]  })),
  setUnfollowing: (data: any) => set((state: any) => ({ following: state.following.filter((following: any) => following.following_id !== data.following_id)  })),
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
