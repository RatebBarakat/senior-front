<template>
  <div class="container">
    <div v-if="isLoading" class="flex items-center justify-center">
      <LoadingSnippet />
    </div>
    <div class="flex flex-wrap" v-else v-for=" notification in notifications" :key="notification.id">
        <span class="text-center w-fit">{{ notification.data.message }}</span>
        <span class="text-center w-fit">
          <a class="px-3 py-1 rounded text-blue-500">click here to see more</a>
        </span>
        <br>
    </div>
  </div>
</template>

<script>
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "axios";

export default {
  name: "notificationPage",
  data() {
    return {
      isLoading: false,
      isOpen: false,
      notifications : {}
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      this.isLoading = true;
      try{
        const response = await axios.get("http://127.0.0.1:8000/api/user/notification?type=unread", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        console.log('response :>> ', response);
        this.notifications = response.data.data[0];
      } catch (error) {
        console.error("Failed :", error);
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
