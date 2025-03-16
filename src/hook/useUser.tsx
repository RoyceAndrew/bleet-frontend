import { create } from "zustand";
import axios from "axios";

export const useUser = create((set) => ({
  user: null,
  isLoading: true,

  checkUser: async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/user/getInfo", {
        withCredentials: true,
      });
      set({ user: result.data.data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  editUser: (data: any) =>
    set((state: any) => ({
      user: { ...state.user, ...data },
      isLoading: false,
    })),

  logout: () => {
    axios.post(
      "http://localhost:3000/api/user/logout",
      {},
      { withCredentials: true }
    );
    set({ user: null, isLoading: false });
  },
}));
