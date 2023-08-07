<template>
  <div class="container">
    <!-- <div v-if="isLoading" class="flex items-center justify-center">
      <LoadingSnippet />
    </div> -->
    <div >
      <div class="bg-white md:mx-auto rounded shadow-xl w-full md:w-1/2 overflow-hidden">
        <div class="h-[140px] bg-blue-500"></div>
        <div class="px-5 py-2 flex flex-col gap-3 pb-6">
          <div class="h-[90px] shadow-md w-[90px] rounded-full border-4 overflow-hidden -mt-14 border-white">
            <img v-show="isLoading === false" :src="image" class="w-full h-full rounded-full object-center object-cover">
            <img v-show="isLoading === true"
             src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921" 
            class="w-full h-full rounded-full object-center object-cover">
          </div>
          <h4 class="text-md font-medium leading-3">About</h4>
          <form enctype="multipart/form-data" @submit.prevent="updateProfile">
            <textarea v-model="profile.bio" :disabled="isLoading === true || isOnline === false"
              class="w-full form-input focus-visible:outline-blue-500 text-sm text-stone-500"></textarea>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Location</p>
                </div>
                <input :disabled="isLoading === true || isOnline === false" v-model="profile.location"
                  class="w-full focus-visible:outline-blue-500 text-sm text-slate-500 p-2 self-start ml-auto form-input" />
              </div>
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Blood Type</p>
                </div>
                <div v-if="hasBloodType">your blood type is {{ profile.blood_type }}</div>
                <div v-else>
                  <select :disabled="isLoading === true || isOnline === false" v-model="profile.blood_type" id="blood_type" name="blood_type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Blood Type</option>
                  <option v-for="type in bloodTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
                </div>
              </div>
              <div class="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full">
                <div class="leading-3">
                  <p class="text-sm font-bold text-slate-700">Avatar</p>
                  <!-- <button :disabled="isLoading === true || isOnline === false" type="button" v-show="isSocial" @click="syncAvatar">sync avatar?</button> -->
                </div>
                <input :disabled="isLoading === true || isOnline === false" type="file" accept="image/*" @change="handleAvatarChange" class="self-start ml-auto" />
              </div>
            </div>
            <button :disabled="isLoading === true || isOnline === false" type="submit" class="bg-blue-500 text-white mt-4 px-4 py-2 rounded">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";
// import LoadingSnippet from "./LoadingSnippet.vue";
import { useToast } from "vue-toastification";
import router from "@/router";
import { eventBus } from "@/eventBus";

export default {
  name: "ProfilePage",
  data() {
    return {
      hasBloodType : false,
      isOnline : navigator.onLine ? true : false,
      profile: {
        bio: 'no bio',
        blood_type: 'no blood type',
        location: 'no location',
        avatar: null,
      },
      isSocial : false,
      image: "",
      bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      isLoading: true,
    };
  },

  mounted() {
    window.addEventListener('online', ()=>{this.isOnline=true});
    window.addEventListener('offline', ()=>{this.isOnline=false});
    
    this.fetchProfile().then(() => { this.isLoading = false });
  },
  methods: {
    async syncAvatar() {
        await axios.get("/api/user/profile/syncAvatar", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        }).then((response) => {
          useToast().success(response.data.message);
          localStorage.removeItem('avatar');
          eventBus.emit('updateAvatar');
          this.fetchProfile();         
        }).catch((error) => {
          console.error('error :>> ', error);
        });
    },
    async fetchProfile() {
      this.isLoading = true;
      try {
        const response = await axios.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        });
         if (response.data.data) {
          let type = this.$store.getters.getUserType;
          if(type == 'social'){
            this.isSocial = true;
          }
          const { bio, blood_type, location, avatar } = response.data.data;
          this.profile.bio = bio !== null ? bio : 'no bio';
          this.profile.blood_type = blood_type !== null ? blood_type : 'no blood type';
          this.profile.location = location !== null ? location : 'no location';
          this.image = avatar !== null ? avatar : '';
          this.hasBloodType = blood_type !== null;
        }
      } catch (error) {
        console.log('error :>> ', error);
        if (error.response?.status === 401) {
          this.$store.commit("LOGOUT");
          router.replace("/login");
        }
      }
      this.isLoading = false;
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
        useToast().success(response.data.message);
        if(this.profile.avatar){
          localStorage.removeItem('avatar');
          eventBus.emit('updateAvatar');
        }
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
  // components: {
  //   LoadingSnippet,
  // },
};
</script>

<style>

:disabled{
  opacity: .7;
  background-color: rgba(0, 0, 0, 0.1);
}

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
