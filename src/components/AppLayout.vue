<template>
  <div>
    <div v-if="!isLoading">
      <header class="flex p-2 items-center justify-between">
        <div class="left">
          <button class="openbtn bg-blue-500 mt-2 bg-primary" @click="toggleSidebar">&#9776;</button>
        </div>
        <div class="right flex items-center">
          <div class="messages">
            <span @click="dropdowns.notifications = !dropdowns.notifications">

            </span>
            <div class="user-info relative">
              <router-link :key="$route.fullPath" to="notification"
                class="block m-2 overflow-hidden focus:outline-none text-sm leading-loose align-middle px-4 py-1 rounded cursor-pointer ">
                Notifications <span class="text-blue-500">[{{ notificationsCount }}]</span> <i
                  class="fa fas fa-sort-down"></i>
              </router-link>

            </div>

          </div>
          <div class="user-info relative">
            <button
              class="block m-2 overflow-hidden focus:outline-none leading-loose align-middle px-4 py-1 rounded cursor-pointer text-sm bg-blue-500 text-white"
              @click="dropdowns.userInfo = !dropdowns.userInfo">
              {{ user.name }} <i class="fa fas fa-sort-down"></i>
            </button>
            <button v-if="dropdowns.userInfo" @click="dropdowns.userInfo = false" tabindex="-1"
              class="fixed top-0 inset-0 h-full w-full bg-black opacity-0 cursor-default"></button>
            <div v-if="dropdowns.userInfo"
              class="z-20 absolute top-full right-0 mt-2 w-48 py-2 rounded-lg border-gray-900 bg-white shadow-xl">
              <router-link :key="$route.fullPath" :to="{ name: 'profile' }" @click="dropdowns.userInfo = false"
                class="text-sm text-gray-900 hover:bg-blue-500 hover:text-white block px-4 py-2 cursor-pointer">profile</router-link>
              <router-link :key="$route.fullPath" to=""
                class="text-sm text-gray-900 hover:bg-blue-500 hover:text-white block px-4 py-2 cursor-pointer">Support</router-link>
              <div @click="logout"
                class="text-sm text-gray-900 hover:bg-blue-500 hover:text-white block px-4 py-2 cursor-pointer">Sign Out
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="container-fluid h-screen">
        <div id="mySidebar" class="bg-primary" :class="['sidebar', 'bg-blue-500', { 'sidebar-open': isSidebarOpen }]">
          <a href="javascript:void(0)" class="closebtn" @click="toggleSidebar">&times;</a>
          <div class="mt-5">
            <router-link :key="$route.fullPath" :to="{ name: 'dashboard' }" @click="this.isSidebarOpen = false"
              :class="{ active: $route.name === 'dashboard' }" class="nav-link">Dashboard</router-link>
            <router-link :key="'appointment-link'" :to="{ name: 'appointment' }" @click="this.isSidebarOpen = false"
              :class="{ active: $route.name === 'appointment' }" class="nav-link">Appointments</router-link>
            <router-link :key="'requests-link'" :to="{ name: 'requests' }" @click="this.isSidebarOpen = false"
              :class="{ active: $route.name === 'requests' }" class="nav-link">blood requests</router-link>
          </div>
        </div>

        <div class="col-md-9 main mt-3">
          <router-view />
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <div class="spinner"></div>
    </div>
  </div>
</template>


<script>
import router from "@/router";
import "../css/sidebar.css";
import axios from "../axios";
import { eventBus } from "../eventBus";

export default {
  name: "AppLayout",
  data() {
    return {
      user: {},
      isSidebarOpen: false,
      dropdowns: {
        userInfo: false,
        notifications: false,
      },
      notificationsCount: 0,
      isLoading: true,
      unreadNotifications: {},
    };
  },
  mounted() {
    this.fetchUserData()
      .then(() => this.fetchNotifications())
      .finally(() => {
        this.isLoading = false;
      });
    eventBus.on('notificationCountChange', this.updateNotificationsCount);
  },
  beforeUnmount() {
    eventBus.off('notificationCountChange', this.updateNotificationsCount);
  },

  computed: {
    userName() {
      // store.emit("");
      this.$store.fetchUserData;
      console.log('object :>> ', this.$store.getters.getUserData);
      const user = this.$store.getters.getUserData;
      if (user && user.name) {
        return user.name;
      }
      return null;
    },
  },
  methods: {
    updateNotificationsCount(count) {
      this.notificationsCount = count;
    },
    logout() {
      this.$store.commit("LOGOUT");
      router.replace({ name: "login" });
    },
    async fetchNotifications() {
      try {
        const response = await axios.get("/api/user/notification?type=unread", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        console.log('response :>> ', response);
        this.unreadNotifications = response.data.data[0];
        this.notificationsCount = this.unreadNotifications.length;
        console.log('object :>> ', this.unreadNotifications);
      } catch (error) {
        console.error("Failed :", error);
      }
    },
    async fetchUserData() {
      try {
        const response = await axios.get("/api/user", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        const userData = response.data;
        this.$store.commit("SET_USER", userData);
        this.user = userData;
        console.log('done');
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        this.$store.commit("LOGOUT");
        router.replace({ name: "login" });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a4a4a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}</style>
