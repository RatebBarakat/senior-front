<template>
  <div class="container">
    <h2 class="mt-5">Login</h2>
    <form @submit="submitForm" method="post" class="mt-3">
      <div class="form-group">
        <div v-if="error.general" class="text-danger">{{ error.general[0] }}</div>
        <label for="email">Email:</label>
        <div v-if="error.email" class="text-danger">{{ error.email[0] }}</div>
        <input type="email" id="email" v-model="email" class="form-control" />
      </div>
      <div class="form-group">
        <div v-if="error.password" class="text-danger">
          {{ error.password[0] }}
        </div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" class="form-control" />
      </div>
      <div v-if="this.processing" class="text-danger">
        <button type="button" disabled class="btn btn-primary">processing</button>
      </div>
      <div v-if="!this.processing" class="text-danger">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>
      <router-link class="btn btn-sm" to="/dashboard">Go to Dashboard</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router"; 

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      error: {},
      processing : false,
    };
  },
  methods: {
    async submitForm(event) {
      event.preventDefault();

      const loginData = {
        email: this.email,
        password: this.password,
      };
      this.processing = true;
      this.error = {};
      await axios
        .post("http://127.0.0.1:8000/api/user/login", loginData)
        .then((response) => {
          console.log("response",response.data);
          const token = response.data.token;
          const user = response.data.user;
          localStorage.setItem("token", token);
          this.$store.commit("SET_USER", user);
          this.email = "";
          this.password = "";
          router.push("/dashboard");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.errors
          ) {
            this.error = error.response.data.errors;
          } else {
            this.error = { general: "An error occurred. Please try again." };
          }
        });
        this.processing = false;
    },
  },
};
</script>


