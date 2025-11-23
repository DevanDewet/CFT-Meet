<script setup>
import { ref, onMounted } from 'vue';
import SplashScreen from './components/SplashScreen.vue';

// State to control splash screen visibility
const isLoading = ref(true);

onMounted(() => {
  // Show splash screen for 3 seconds, then reveal the app
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <SplashScreen v-if="isLoading" />

  <v-app v-else>
    <v-main>
      <v-container>
        <h1>Welcome to cft-meet</h1>
        </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
