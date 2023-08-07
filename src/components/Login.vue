<template>
  <div class="container">
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          login
        </a>
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div id="login-container" class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form @submit="login" method="post" class="space-y-4 md:space-y-6" action="#">
              <div>
                <div v-if="error.general" class="text-red-500">
                  {{ error.general[0] }}
                </div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <span v-if="error.email" class="text-red-500">
                  {{ error.email[0] }}
                </span>
                <input type="email" v-model="email" name="email" id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-412 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com">
              </div>
              <div>
                <label for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <span v-if="error.password" class="text-red-500">
                  {{ error.password[0] }}
                </span>
                <input type="password" v-model="password" name="password" id="password" placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-412 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
              <div class="flex items-center justify-between">
                <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot
                  password?</a>
              </div>
              <GoogleLogin />
              <button v-if="!this.processing" type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign
                in</button>
              <button v-if="this.processing" disabled type="button"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">processing</button>

              <p class="text-sm font-light text-gray-500 dark:text-gray-412">
                Don’t have an account yet?
                <router-link to="/register" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
                  Sign up
                </router-link>
              </p>
              <p>
                forgot password ?
                <router-link to="/reset" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
                  reset password
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- <form @submit="login" method="post" class="mt-3">
      <div class="form-group">
        <span v-if="error.general" class="text-danger">{{ error.general[0] }}</div>
        <label for="email">Email:</label>
        <span v-if="error.email" class="text-danger">{{ error.email[0] }}</div>
        <input type="email" id="email" v-model="email" class="form-control" />
      </div>
      <div class="form-group">
        <span v-if="error.password" class="text-danger">
          {{ error.password[0] }}
        </div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" />
      </div>
      <div v-if="this.processing" class="text-danger">
        <button type="button" disabled class="btn btn-blue">processing</button>
      </div>
      <div v-if="!this.processing" class="text-danger">
        <button type="submit" class="btn btn-blue">Login</button>
      </div>
      <router-link class="btn btn-sm" to="/dashboard">Go to Dashboard</router-link>
    </form> -->
  </div>
</template>

<script>
import axios from "../axios";
import router from "@/router";
import GoogleLogin from "./GoogleLogin.vue";

export default {
  name: "LoginForm",
  mounted() {
  },
  data() {
    return {
      email: "",
      password: "",
      error: {},
      processing: false,
    };
  },
  methods: {
    async login(event) {
      event.preventDefault();
      const loginData = {
        email: this.email,
        password: this.password,
      };
      this.processing = true;
      this.error = {};
      await axios
        .post("/api/user/login", loginData)
        .then((response) => {
          console.log("response", response.data);
          const token = response.data.token;
          const user = response.data.user;
          localStorage.setItem("token", token);
          this.$store.commit("SET_USER", user);
          this.email = "";
          this.password = "";
          router.push("/dashboard");
        })
        .catch((error) => {
          if (error.response &&
            error.response.status === 412 &&
            error.response.data.errors) {
            this.error = error.response.data.errors;
          }
          else {
            this.error = { general: "An error occurred. Please try again." };
          }
        });
      this.password = "";
      this.processing = false;
    },
  },
  components: { GoogleLogin }
};
</script>

<style>
#login-container {
  box-shadow: 0 0 15px 10px rgba(0, 0, 0, 0.05);
}

label {
  display: inline-block;
  margin-right: 3px;
}</style>

