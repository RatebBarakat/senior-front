<template>
  <div class="container">
    <div v-if="isLoading" class="flex items-center justify-center">
      <LoadingSnippet />
    </div>
    <div v-else>
      <div class="bg-white md:mx-auto rounded shadow-xl w-full md:w-1/2 overflow-hidden">
        <div class="h-[140px] bg-blue-500"></div>
        <div class="px-5 py-2 flex flex-col gap-3 pb-6">
          <div class="h-[90px] shadow-md w-[90px] rounded-full border-4 overflow-hidden -mt-14 border-white">
            <img :src="image" class="w-full h-full rounded-full object-center object-cover">
          </div>
          <h4 class="text-md font-medium leading-3">About</h4>
          <form enctype="multipart/form-data" @submit.prevent="updateProfile">
            <textarea v-model="profile.bio"
              class="w-full form-input focus-visible:outline-blue-500 text-sm text-stone-500"></textarea>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Location</p>
                </div>
                <input v-model="profile.location"
                  class="w-full focus-visible:outline-blue-500 text-sm text-slate-500 p-2 self-start ml-auto form-input" />
              </div>
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Blood Type</p>
                </div>
                <select v-model="profile.blood_type" id="blood_type" name="blood_type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Blood Type</option>
                  <option v-for="type in bloodTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Avatar</p>
                </div>
                <input type="file" accept="image/*" @change="handleAvatarChange" class="self-start ml-auto" />
              </div>
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";
import LoadingSnippet from "./LoadingSnippet.vue";
import { useToast } from "vue-toastification";
import router from "@/router";

export default {
  name: "ProfilePage",
  data() {
    return {
      profile: {
        bio: 'no bio',
        blood_type: 'no blood type',
        location: 'no location',
        avatar: null,
      },
      image: "",
      bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      isLoading: true,
    };
  },

  mounted() {
    this.fetchProfile().then(() => { this.isLoading = false });
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
        if (response.data.data) {
          const { bio, blood_type, location, avatar } = response.data.data;
          if (bio !== null || blood_type !== null || location !== null) {
            this.profile.bio = bio !== null ? bio : 'no bio';
            this.profile.blood_type = blood_type !== null ? blood_type : 'no blood type';
            this.profile.location = location !== null ? location : 'no location';
            this.image = avatar !== null ? avatar : '';
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          this.$store.commit("LOGOUT");
          router.replace("/login");
        }
      }
    },
    async updateProfile() {
      try {
        let profile = {
          ...this.profile,
        }
        const response = await axios.post("/api/user/profile", profile, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        useToast().success(response.data.message);
        this.fetchProfile();
      } catch (error) {
        console.log('error :>> ', error);
        if (error.response?.status === 401) {
          this.$store.commit("LOGOUT");
          router.replace("/login");
        }
      }

    },
    async handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profile.avatar = file;
      }
    }
  },
  components: {
    LoadingSnippet,
  },
};
</script>

<style>
.form-input {
  appearance: none;
  outline: none;
  border-radius: 0.25rem;
  border-width: 1px;
  border-color: #e2e8f0;
  padding: 0.5rem;
  transition: border-color 0.2s ease-in-out;
}

.form-input:focus {
  border-color: #4299e1;
}
</style>
