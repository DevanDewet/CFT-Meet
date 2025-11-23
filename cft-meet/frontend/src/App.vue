<script setup>
import { ref, onMounted } from 'vue';
import SplashScreen from './components/SplashScreen.vue';

// State to control splash screen visibility
const isLoading = ref(true);
const drawer = ref(false);

onMounted(() => {
  // Show splash screen for 3 seconds, then reveal the app
  setTimeout(() => {
    isLoading.value = false;
  }, 2500);
});
</script>

<template>
  <SplashScreen v-if="isLoading" />

  <v-app v-else>
    <!-- App Bar / Navigation -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-nav-icon 
        variant="text" 
        @click.stop="drawer = !drawer"
        class="d-md-none"
      ></v-app-bar-nav-icon>
      
      <v-spacer class="d-none d-md-flex"></v-spacer>
      
      <v-toolbar-title class="text-white font-weight-bold text-center">
        <v-icon icon="mdi-domain" class="mr-2"></v-icon>
        CFT-MEET
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex">
        <v-btn text class="text-white mx-1" to="/">
          Dashboard
        </v-btn>
        <v-btn text class="text-white mx-1" to="/rooms">
          Rooms
        </v-btn>
        <v-btn text class="text-white mx-1" to="/bookings">
          Bookings
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
          @click="drawer = false"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-door"
          title="Rooms"
          to="/rooms"
          @click="drawer = false"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-calendar"
          title="Bookings"
          to="/bookings"
          @click="drawer = false"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-white">
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.dashboard-card {
  transition: transform 0.2s ease-in-out;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

/* Ensure proper spacing on mobile */
@media (max-width: 960px) {
  .v-container {
    padding: 16px;
  }
}

/* Better spacing for larger screens */
@media (min-width: 1904px) {
  :deep(.v-container) {
    max-width: 1920px !important;
    margin: 0 auto;
  }
}
</style>
