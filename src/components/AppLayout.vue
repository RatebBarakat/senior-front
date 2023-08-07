<template>
  <div>
    <div v-if="!isOnline" class="offline-alert">
    You are currently offline. Please check your internet connection.
    </div>
    <div v-if="!isLoading">
      <header class="flex p-2 items-center justify-between">
        <div class="left">
          <button class="openbtn bg-blue-500 ml-2 bg-primary" @click="toggleSidebar">&#9776;</button>
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
            <template v-if="avatar">
              <img :src="avatar" alt="User Avatar" id="avatar" class="avatar cursor-pointer mr-2 rounded-full"
                @click="dropdowns.userInfo = !dropdowns.userInfo">
              <i class="fa fas fa-sort-down"></i>
            </template>
            <template v-else>
              <div class="avatar-placeholder cursor-pointer mr-2 rounded-full">
              </div>
            </template>
            <button v-if="dropdowns.userInfo" @click="dropdowns.userInfo = false" tabindex="-1"
              class="fixed top-0 inset-0 h-full w-full bg-black opacity-0 cursor-default"></button>
            <div v-if="dropdowns.userInfo"
              class="z-20 absolute top-full right-0 mt-2 w-48 py-2 rounded-lg border-gray-900 bg-white shadow-xl">
              <router-link :key="$route.fullPath" :to="{ name: 'profile' }" @click="dropdowns.userInfo = false"
                class="text-sm text-gray-900 hover:bg-blue-500 hover:text-white block px-4 py-2 cursor-pointer">profile</router-link>
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
            <router-link :key="$route.fullPath" :to="{ name: 'dashboard' }" @click="isSidebarOpen = false"
              :class="{ active: $route.name === 'dashboard' }" class="nav-link">
              Dashboard
            </router-link>
            <router-link :key="'appointment-link'" :to="{ name: 'appointment' }" @click="isSidebarOpen = false"
              :class="{ active: $route.name === 'appointment' }" class="nav-link flex items-center">
              Appointments
              <span v-if="isProcessingData === 'appointments'">
                <div class="ml-1 spinner-sm-white"></div>
              </span>
              <span v-else>[{{ counts.appointments_count || 0 }}]</span>
            </router-link>
            <router-link :key="'requests-link'" :to="{ name: 'requests' }" @click="isSidebarOpen = false"
              :class="{ active: $route.name === 'requests' }" class="nav-link flex items-center">
              Blood requests
              <span v-if="isProcessingData === 'requests'">
                <div class="ml-1 spinner-sm-white"></div>
              </span>
              <span v-else>[{{ counts.requests_count || 0 }}]</span>
            </router-link>
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
import { useToast } from "vue-toastification";

export default {
  name: "AppLayout",
  data() {
    return {
      isOnline : navigator.onLine ? true : false,
      user: {},
      isSidebarOpen: false,
      dropdowns: {
        userInfo: false,
        notifications: false,
      },
      avatar: null,
      isProcessingData: "",
      counts: {
        appointments_count: null,
        requests_count: null,
      },
      notificationsCount: 0,
      isLoading: true,
      unreadNotifications: {},
    };
  },
  watch: {
    isOnline : function () {
        if(this.onLine === true){
            this.showBackOnline = true;
            setTimeout(()=>{ this.showBackOnline = false; }, 1000);
        }
    },
  },
  async mounted() {
    window.addEventListener('online', ()=>{this.isOnline=true});
    window.addEventListener('offline', ()=>{this.isOnline=false});
    axios.get('/sanctum/csrf-cookie').then((response) => {
      console.log('response :>> ', response);
    })
    this.isLoading = true;
    await Promise.all([this.fetchUserData()])
      .then(async () => {
        await Promise.all([this.loadAvatar(), this.fetchCount(), this.fetchNotifications()]);
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
      });

    eventBus.on('notificationCountChange', this.updateNotificationsCount);
    eventBus.on('isProcessing', this.isProcessing);
    eventBus.on('updateCount', this.updateCount);
    eventBus.on('updateAvatar', this.loadAvatar);
  },
  beforeUnmount() {
    eventBus.off('notificationCountChange', this.updateNotificationsCount);
    eventBus.off('isProcessing', this.isProcessing);
    eventBus.off('updateCount', this.updateCount);
    eventBus.off('updateAvatar', this.loadAvatar);
  },

  computed: {
    userName() {
      this.$store.fetchUserData;
      const user = this.$store.getters.getUserData;
      if (user && user.name) {
        return user.name;
      }
      return null;
    },
  },
  methods: {
    isProcessing(event) {
      this.isProcessingData = event;
    },
    async updateCount(data) {
      if (this.isProcessingData == "appointments" || this.isProcessingData == "requests") {
        if (Object.keys(data).includes('appointments')) {
          this.counts.appointments_count = data.appointments;
        }
        if (Object.keys(data).includes('requests')) {
          this.counts.requests_count = data.requests;
        }
        this.isProcessingData = '';
      }
    },
    async fetchCount() {
      try {
        const response = await axios.get("/api/user/count", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        this.counts = response.data.data;
      } catch (error) {
        console.error("Failed :", error);
      }
    },
    updateNotificationsCount(count) {
      this.notificationsCount = count;
    },
    async logout() {
      await axios.post('/api/user/logout', null, {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getUserToken}`,
        },
      }).then(() => {
        localStorage.clear();
        router.replace({ name: "login" });
        this.$store.commit("LOGOUT");
      }).catch((error) => {
        console.log('error :>> ', error);
        useToast().error('failed to logout');
      })
    },
    async fetchNotifications() {
      try {
        const response = await axios.get("/api/user/notification?type=unread", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        this.unreadNotifications = response.data.data[0];
        this.notificationsCount = this.unreadNotifications.length;
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
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        this.$store.commit("LOGOUT");
        router.replace({ name: "login" });
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async loadAvatar() {
      // if (localStorage.getItem('avatar')) {
      //   this.avatar = localStorage.getItem('avatar');
      // } else {
        const response = await axios.get("/api/user/profile?value=avatar", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        if (response.data.avatar !== null) {
          this.avatar = response.data.avatar;
          localStorage.setItem('avatar', this.avatar);
        } else {
          const apiUrl = `https://ui-avatars.com/api/?name=${this.user.name}&size=50&background=3b82f6&color=fff`;
          try {
            const response = await fetch(apiUrl);

            if (response.ok) {
              const avatarData = await response.blob();
              this.avatar = URL.createObjectURL(avatarData);
              localStorage.setItem('avatar', this.avatar);
            } else {
              throw new Error('Failed to fetch avatar');
            }
          } catch (error) {
            console.error(error);
            return null;
          }
        // }
      }
    }

  },
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spinner 0.8s linear infinite;
}

.flex {
  display: flex !important;
}

#avatar {
  width: 50px;
  height: 50px;
}

.offline-alert {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
