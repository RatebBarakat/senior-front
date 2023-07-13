<template>
  <div class="container">
    <div class="w-full md:w-2/3 mx-auto my-2 shadow-xl border border-gray-100 pt-2 rounded">
      <div class="bg-blue-500 p-3 flex items-center rounded text-white">Notifications</div>
      <div class="filters p-2 flex items-center">
        <div v-show="isLoading" class="flex items-center justify-center w-full">
          <LoadingSnippet />
        </div>
        <span v-show="!isLoading">
          <label class="mr-2" for="type">all notifications</label>
        <input v-model="type" type="checkbox" name="type" id="type" @change="fetchNotifications">
        </span>
      </div>
      <div v-show="!isLoading" v-if="notifications.length === 0" class="bg-white md:mx-auto rounded shadow-xl w-full overflow-hidden">
        <div class="px-5 py-2 flex flex-col gap-3 pb-6">
          <h4 class="text-md w-full font-medium leading-3">No notifications</h4>
          <p class="text-sm text-gray-500">There are no notifications to display at the moment.</p>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-wrap" v-for="notification in notifications" :key="notification.id">
          <div class="w-full rounded py-3 px-4 border bg-white border-gray-200 text-slate-500 flex justify-between items-center">
            <span>{{ notification.data.message }}</span>
            <router-link v-if="notification.data.url" :to="notification.data.url" class="text-blue-500">
              Click here
            </router-link>
          </div>
          <hr class="w-full">
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "../axios";
import router from "@/router";
import { eventBus } from "../eventBus";

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
      let state = this.type === false ? "?type=unread" : "";
      this.isLoading = true;
      try{
        const response = await axios.get(`/api/user/notification${state}`, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        this.notifications = response.data.data[0];
        eventBus.emit('notificationCountChange', this.notifications.length);
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
