<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="text-2xl font-bold mb-4">Your email is verified</div>
    <router-link to="login" class="text-blue-500">Click here to login and continue</router-link>
  </div>
</template>

<script>
export default {
  name: 'EmailVerificationPage',
};
</script>

<style>
</style>
