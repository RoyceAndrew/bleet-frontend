import { create } from "zustand";

const useEmail = create((set) => ({
    email: null,
    setEmail: (email: string) => set({ email: email }),
    deleteEmail: () => set({ email: null }),
}));

export default useEmail;