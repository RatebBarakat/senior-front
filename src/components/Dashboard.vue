<template>
  <div class="container self-center m-auto">
    <div v-if="isLoading">
      <LoadingSnippet />
    </div>
    <div v-else>
      <div class="container flex flex-col items-center shadow-xl h-auto">
        <h2 class="text-blue-500 text-2xl font-bold mb-4">
          Upcoming Events
        </h2>
        <div class="border mb-3 rounded p-2 w-full">
          <div v-for="(event) in upcomingEvents" :key="event.id" class="flex flex-col items-center p-4">
            <h2 class="text-blue-500 text-lg font-bold mb-2">Title</h2>
            <div class="text-center">{{ event.title }}</div>
            <h2 class="text-blue-500 text-lg font-bold mt-4 mb-2">Description</h2>
            <div style="overflow-wrap: anywhere;" class="text-center p-2">{{ event.description }}</div>
            <div class="w-full mt-4">
              <div class="flex bg-blue-100 p-2 rounded">
                <h2 class="text-blue-500 w-1/3">Start Date</h2>
                <h2 class="text-blue-500 w-1/3">End Date</h2>
                <h2 class="text-blue-500 w-1/3">Centers</h2>
              </div>
              <div class="flex p-2">
                <div class="w-1/3 whitespace-pre-wrap">{{ event.start_date }}</div>
                <div class="w-1/3 whitespace-pre-wrap">{{ event.end_date }}</div>
                <div class="w-1/3 whitespace-pre-wrap">{{ event.centers }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ... (Rest of the script and style tags remain unchanged) ... -->


<script>
import axios from "../axios";
import LoadingSnippet from "./LoadingSnippet.vue";
import "../css/table.css";

export default {
  name: "DashboardView",
  data() {
    return {
      upcomingEvents : {},
      isLoading: false,
      isOpen: false,
    };
  },
  computed: {
    name() {
      const user = this.$store.getters.getUserData;
      if (user && user.name) {
        return user.name;
      }
      return null;
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchUpcomingEvents();
    this.$nextTick(() => {
        this.isLoading = false;
    });
  },
  methods: {
    async fetchUpcomingEvents() {
      await axios.get('/api/user/event/upcoming',{
        headers : {
          Authorization : `Bearer ${this.$store.getters.getUserToken}`,
        }
      })
      .then((response) => {
        this.upcomingEvents = response.data.data;
      }).catch((error) => {
        console.log('error :>> ', error);
      })
    }
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
