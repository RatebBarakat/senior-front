<template>
  <div class="container">
    <div class="container mt-4 p-3">
      <form action="" @submit.prevent="sendEmail">
        <input type="email" v-model="email" placeholder="enter you email"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        <button class="border border-blue-500 rounded p-2 text-lg mt-2 text-blue-500" type="submit">submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import router from "@/router";
// import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "../axios";
import "../css/table.css";
import { useToast } from "vue-toastification";

export default {
  name: "BLoodRequestPage",
  data() {
    return {
      email : "",
      isOnline: navigator.onLine ? true : false,
      isLoading: false,
      errors: {},
    };
  },
  mounted() {
    window.addEventListener('online', () => { this.isOnline = true });
    window.addEventListener('offline', () => { this.isOnline = false });
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    sendEmail(){
      this.isLoading = true;
      axios.post('/api/user/sendResetPassword',{'email' : this.email})
      .then((response) => {
        console.log('response :>> ', response);
        useToast().success('email send seccuussfully');
        router.push('/login');
      })
      .catch((error) => {
        console.log('error :>> ', error);
      })
    }
  },
  components: {
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity .2s ease-in-out, transform .3s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-40%);
}

.modal-content{
  width: min(650px,90%) !important;
}

button:disabled {
  cursor: not-allowed;
}

.error{
  display: inline-block;
}
</style>
