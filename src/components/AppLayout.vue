<template>
  <div>
    <div v-if="!isLoading">
      <div class="container-fluid h-screen">
        <button class="openbtn mt-2 bg-primary" @click="toggleSidebar">&#9776;</button>
        <div id="mySidebar" class="bg-primary" :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
          <a href="javascript:void(0)" class="closebtn" @click="toggleSidebar">&times;</a>
          <div class="mt-5">
            <router-link :to="{ name: 'dashboard' }" :class="{ active: $route.name === 'dashboard' }"
              class="nav-link">Dashboard</router-link>
            <router-link :to="{ name: 'appointment' }" :class="{ active: $route.name === 'appointment' }"
              class="nav-link">Appointments</router-link>
            <button @click="logout" type="button">Logout</button>
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
import router from '@/router';
import "../css/sidebar.css";

export default {
  name: "AppLayout",
  data() {
    return {
      isSidebarOpen: false,
      isLoading: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    logout() {
      this.$store.commit('LOGOUT');
      router.push('/login');
    },
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
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
}
</style>
