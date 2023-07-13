import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  name: "auth",
  state: {
    user: {
      data: {
      },
      type : "social"
    },
  },
  getters: {
    getUserToken: (state) => {
      const storedToken = localStorage.getItem("token");
      return state.user.token || storedToken || null;
    },
    getUserData: (state) => {state.user.data},
    getUserType: (state) => {return state.user.type},
  },
  actions: {
    async fetchUserData({ commit, getters }) {
      try {
        const token = getters.getUserToken;
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        commit("SET_USER", userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        commit("LOGOUT");
      }
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user.data = user;
    },
    SET_TYPE(state, type) {
      state.user.type = type;
    },
    LOGOUT(state) {
      state.user.token = null;
      state.user.data = null;
      localStorage.removeItem("token");
    },
    LOGIN(state, { token, user }) {
      state.user.token = token;
      state.user.data = user;
      localStorage.setItem("token", token);
    },
  },
});

export default store;
