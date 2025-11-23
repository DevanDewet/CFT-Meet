<script setup>
  // No logic needed here, purely presentational
</script>

<template>
  <div class="splash-container">
    <div class="content">
      <div class="logo-wrapper">
        <v-icon size="100" color="primary" class="logo-animate">
          mdi-domain
        </v-icon>
      </div>
      
      <h1 class="app-title fade-in-up">
        CFT-MEET
      </h1>
      
      <p class="app-subtitle fade-in-up-delay">
        Meeting Room Management System
      </p>

      <div class="loading-indicator fade-in-up-delay-2">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="40"
          :width="3"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.content {
  text-align: center;
}

.logo-wrapper {
  margin-bottom: 24px;
}

.app-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1a237e;
  letter-spacing: 4px;
  margin-bottom: 12px;
  text-shadow: none;
}

.app-subtitle {
  font-size: 1.2rem;
  color: #5c6bc0;
  font-weight: 400;
  letter-spacing: 1px;
  margin-bottom: 32px;
}

.loading-indicator {
  margin-top: 24px;
}

/* Animations */
.logo-animate {
  animation: logoAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  color: #1a237e !important;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.4s;
}

.fade-in-up-delay {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.7s;
}

.fade-in-up-delay-2 {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 1s;
}

@keyframes logoAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .app-title {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
}
</style>