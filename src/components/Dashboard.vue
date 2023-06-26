<template>
  <div class="container">
    <div v-if="isLoading">
      <LoadingSnippet />
    </div>
    <div v-else>
      Welcome, {{ userName }}
      <!-- Modal toggle -->
      <button @click="isOpen = true" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Toggle modal
      </button>

      <div v-if="isOpen" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Terms of Service
            </h3>
            <button @click="isOpen = false" type="button" class="close-button">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
            </p>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
            </p>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
            </p>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
            </p>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
          <div class="modal-footer">
            <button @click="isOpen = false" type="button" class="accept-button">I accept</button>
            <button @click="isOpen = false" type="button" class="decline-button">Decline</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSnippet from "./LoadingSnippet.vue";
import router from "@/router";

export default {
  name: "DashboardView",
  data() {
    return {
      isLoading: false,
      isOpen: false,
    };
  },
  computed: {
    userName() {
      const user = this.$store.getters.getUserData;
      if (user && user.name) {
        return user.name;
      }
      return null;
    },
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        this.isLoading = true;
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        const userData = response.data;
        this.$store.commit("SET_USER", userData);
        console.log('done');
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        this.$store.commit("LOGOUT");
        router.push({ name: "login" });
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
