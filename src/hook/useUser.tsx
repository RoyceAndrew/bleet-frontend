import { create } from "zustand";
import axios from "axios";

export const useUser = create((set) => ({
  user: null,
  isLoading: true,

  checkUser: async () => {
    try {
      const result = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/getInfo", {
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
      import.meta.env.VITE_REACT_APP_BACKEND_URL + "/api/user/logout",
      {},
      { withCredentials: true }
    );
    set({ user: null, isLoading: false });
  },
}));
