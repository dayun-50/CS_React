import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: "",
  id: "",
  isLogin: false,

  login: (token, id) => {
    set((state) => {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("id", id);
      return { token: token, id: id, isLogin: true };
    });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    set({ token: "", id: "", isLogin: false });

    sessionStorage.removeItem("jamesAccessToken");
    set({ token: "", id: "", isLogin: false });
  },
}));
export default useAuthStore;
