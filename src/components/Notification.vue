<template>
  <div class="container">
    <div v-if="isLoading" class="flex items-center justify-center">
      <LoadingSnippet />
    </div>
    <div v-else class="w-full md:w-2/3 mx-auto my-2 shadow-xl border border-gray-100 pt-2 rounded">
      <div class="bg-blue-500 p-3 flex items-center rounded text-white">Notifications</div>
      <div class="filters p-2 flex items-center">
        <label class="mr-2" for="type">all notifications</label>
        <input v-model="type" type="checkbox" name="type" id="type" @change="fetchNotifications">
      </div>
      <div v-if="notifications.length === 0" class="bg-white md:mx-auto rounded shadow-xl w-full md:w-1/2 overflow-hidden">
        <div class="px-5 py-2 flex flex-col gap-3 pb-6">
          <h4 class="text-md font-medium leading-3">No notifications</h4>
          <p class="text-sm text-gray-500">There are no notifications to display at the moment.</p>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-wrap" v-for="notification in notifications" :key="notification.id">
          <span class="w-3/4 rounded py-3 px-4 border bg-white border-gray-200 text-slate-500">
            {{ notification.data.message }}
          </span>
          <router-link v-if="notification.data.url" :to="notification.data.url">
            click here
          </router-link>
          <hr>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "../axios";
import router from "@/router";

export default {
  name: "notificationPage",
  data() {
    return {
      isLoading: false,
      isOpen: false,
      notifications : {},
      type : false
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      let state = this.type === true ? "?type=unread" : "";
      this.isLoading = true;
      try{
        const response = await axios.get(`/api/user/notification${state}`, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        this.notifications = response.data.data[0];
      } catch (error) {
        if (error.response?.status === 401) {
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
      } finally {
        this.isLoading = false;
      }
    },
  },
  components: {
    LoadingSnippet,
  },
};
</script>

<style>
  .modal-content{
    overflow: auto;
  }
</style>
