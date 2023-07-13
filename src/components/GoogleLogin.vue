<template>
  <div>
    <button v-if="isProcessing === false" type="button" @click="loginWithProvider('google')">Login with Google</button>
    <LoadingSnippet v-else class="flex items-center justify-center h-screen"/>
  </div>
</template>

<script>
import router from '@/router';
import axios from '../axios';
import LoadingSnippet from './LoadingSnippet.vue';

export default {
    data() {
        return {
            isProcessing: false
        };
    },
    mounted() {
        if (this.$route.query.code) {
            if(this.$route.query.code.provider){
                console.log('object :>> ', this.$route.query.code.provider);
            }
            this.isProcessing = true;
            const params = {
                code: this.$route.query.code,
            };
            axios.post("/api/auth/google/callback", params)
                .then(response => {
                    console.log("response :", response);
                    const token = response.data.token;
                    const user = response.data.user;
                    localStorage.setItem("token", token);
                    this.$store.commit("SET_USER", {user});
                    this.$store.commit("SET_TYPE", 'social');
                    router.push("/dashboard");
                })
                .catch(error => {
                    router.push("/login");
                    console.log("error :", error);
                });
        }
        else {
            router.push("/login");
        }
    },
    methods: {
        loginWithProvider(provider) {
            axios.get(`/api/auth/${provider}`)
                .then(response => {
                    console.log("response :", response);
                    window.location.href = response.data.url;
                })
                .catch(error => {
                    console.log("error :", error);
                });
        }
    },
    components: {
        LoadingSnippet
    }
}
</script>
