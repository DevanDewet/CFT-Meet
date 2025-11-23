<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

const router = useRouter();
const rooms = ref([]);
const bookings = ref([]);
const loading = ref(true);

const fetchData = async () => {
  try {
    loading.value = true;
    const [roomsResponse, bookingsResponse] = await Promise.all([
      apiClient.get('/rooms'),
      apiClient.get('/bookings')
    ]);
    rooms.value = roomsResponse.data;
    bookings.value = bookingsResponse.data;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  } finally {
    loading.value = false;
  }
};

// Calculate total capacity
const totalCapacity = computed(() => {
  return rooms.value.reduce((sum, room) => sum + room.capacity, 0);
});

// Get today's bookings
const todaysBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.start);
    return bookingDate >= today && bookingDate < tomorrow;
  });
});

// Get upcoming bookings (next 7 days)
const upcomingBookings = computed(() => {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.start);
    return bookingDate >= now && bookingDate <= weekFromNow;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));
});

// Calculate room utilization
const roomUtilization = computed(() => {
  if (rooms.value.length === 0) return 0;
  
  const roomsWithBookings = new Set(bookings.value.map(b => b.roomId)).size;
  return Math.round((roomsWithBookings / rooms.value.length) * 100);
});

// Get most popular room
const mostPopularRoom = computed(() => {
  if (bookings.value.length === 0 || rooms.value.length === 0) return null;
  
  const roomBookingCounts = {};
  bookings.value.forEach(booking => {
    roomBookingCounts[booking.roomId] = (roomBookingCounts[booking.roomId] || 0) + 1;
  });
  
  const mostBookedRoomId = Object.keys(roomBookingCounts).reduce((a, b) => 
    roomBookingCounts[a] > roomBookingCounts[b] ? a : b
  );
  
  const room = rooms.value.find(r => r.id === parseInt(mostBookedRoomId));
  return {
    ...room,
    bookingCount: roomBookingCounts[mostBookedRoomId]
  };
});

// Get peak booking times
const peakBookingTime = computed(() => {
  if (bookings.value.length === 0) return 'N/A';
  
  const hourCounts = {};
  bookings.value.forEach(booking => {
    const hour = new Date(booking.start).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const peakHour = Object.keys(hourCounts).reduce((a, b) => 
    hourCounts[a] > hourCounts[b] ? a : b
  );
  
  return `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`;
});

// Format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRoomName = (roomId) => {
  const room = rooms.value.find(r => r.id === roomId);
  return room ? room.name : 'Unknown Room';
};

const navigateToRooms = () => router.push('/rooms');
const navigateToBookings = () => router.push('/bookings');

onMounted(() => {
  fetchData();
});
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold text-primary mb-2">Dashboard</h1>
        <p class="text-h6 text-grey-darken-1">Overview of your meeting room system</p>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Key Metrics Cards -->
      <v-row class="mb-4">
        <!-- Total Rooms -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" elevation="3" hover @click="navigateToRooms">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-3">
                <v-avatar color="primary" size="56" class="mr-4">
                  <v-icon icon="mdi-door" size="32" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h3 font-weight-bold text-primary">{{ rooms.length }}</div>
                  <div class="text-body-2 text-grey-darken-1">Total Rooms</div>
                </div>
              </div>
              <v-chip size="small" color="primary" variant="tonal">
                <v-icon start icon="mdi-account-multiple"></v-icon>
                {{ totalCapacity }} capacity
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Total Bookings -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" elevation="3" hover @click="navigateToBookings">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-3">
                <v-avatar color="accent" size="56" class="mr-4">
                  <v-icon icon="mdi-calendar-check" size="32" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h3 font-weight-bold" style="color: #3949ab;">{{ bookings.length }}</div>
                  <div class="text-body-2 text-grey-darken-1">Total Bookings</div>
                </div>
              </div>
              <v-chip size="small" color="accent" variant="tonal">
                <v-icon start icon="mdi-calendar-today"></v-icon>
                {{ todaysBookings.length }} today
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Room Utilization -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" elevation="3">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-3">
                <v-avatar color="success" size="56" class="mr-4">
                  <v-icon icon="mdi-chart-line" size="32" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h3 font-weight-bold text-success">{{ roomUtilization }}%</div>
                  <div class="text-body-2 text-grey-darken-1">Room Utilization</div>
                </div>
              </div>
              <v-progress-linear 
                :model-value="roomUtilization" 
                color="success" 
                height="8" 
                rounded
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Peak Time -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card" elevation="3">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-3">
                <v-avatar color="orange-darken-2" size="56" class="mr-4">
                  <v-icon icon="mdi-clock-outline" size="32" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold text-orange-darken-2">{{ peakBookingTime }}</div>
                  <div class="text-body-2 text-grey-darken-1">Peak Time</div>
                </div>
              </div>
              <v-chip size="small" color="orange-darken-2" variant="tonal">
                <v-icon start icon="mdi-trending-up"></v-icon>
                Most active hour
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content Row -->
      <v-row>
        <!-- Most Popular Room -->
        <v-col cols="12" md="6">
          <v-card elevation="3" class="h-100">
            <v-card-title class="d-flex align-center bg-primary text-white pa-4">
              <v-icon icon="mdi-star-circle" size="28" class="mr-3"></v-icon>
              <span class="text-h6 font-weight-bold">Most Popular Room</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="mostPopularRoom" class="pa-6">
              <div class="d-flex align-center mb-4">
                <v-avatar color="primary" size="72" class="mr-4">
                  <v-icon icon="mdi-door" size="40" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold text-primary">{{ mostPopularRoom.name }}</div>
                  <div class="text-body-1 text-grey-darken-1">{{ mostPopularRoom.bookingCount }} bookings</div>
                </div>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-account-multiple" color="primary" class="mr-3"></v-icon>
                <span class="text-body-1">Capacity: <strong>{{ mostPopularRoom.capacity }} people</strong></span>
              </div>
              <div class="d-flex align-start">
                <v-icon icon="mdi-star-circle" color="accent" class="mr-3 mt-1"></v-icon>
                <div>
                  <div class="text-body-2 text-grey-darken-1 mb-2">Features:</div>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip 
                      v-for="feature in mostPopularRoom.features" 
                      :key="feature"
                      size="small"
                      color="primary"
                      variant="outlined"
                    >
                      {{ feature }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-card-text v-else class="pa-6 text-center text-grey-darken-1">
              <v-icon icon="mdi-information-outline" size="48" class="mb-3"></v-icon>
              <p>No booking data available</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Upcoming Bookings -->
        <v-col cols="12" md="6">
          <v-card elevation="3" class="h-100">
            <v-card-title class="d-flex align-center bg-accent text-white pa-4">
              <v-icon icon="mdi-calendar-clock" size="28" class="mr-3"></v-icon>
              <span class="text-h6 font-weight-bold">Upcoming Bookings</span>
              <v-spacer></v-spacer>
              <v-chip color="white" size="small" variant="flat">
                Next 7 Days
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0" style="max-height: 400px; overflow-y: auto;">
              <v-list v-if="upcomingBookings.length > 0" class="py-0">
                <template v-for="(booking, index) in upcomingBookings.slice(0, 5)" :key="booking.id">
                  <v-list-item class="px-6 py-4">
                    <template v-slot:prepend>
                      <v-avatar color="accent" size="40">
                        <v-icon icon="mdi-calendar" color="white"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-bold text-primary mb-1">
                      {{ booking.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex align-center mb-1">
                        <v-icon icon="mdi-door" size="16" class="mr-1"></v-icon>
                        {{ getRoomName(booking.roomId) }}
                      </div>
                      <div class="d-flex align-center">
                        <v-icon icon="mdi-clock-outline" size="16" class="mr-1"></v-icon>
                        {{ formatDateTime(booking.start) }}
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="index < upcomingBookings.slice(0, 5).length - 1"></v-divider>
                </template>
              </v-list>
              <div v-else class="pa-8 text-center text-grey-darken-1">
                <v-icon icon="mdi-calendar-blank" size="64" class="mb-3"></v-icon>
                <p>No upcoming bookings</p>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
              <v-btn 
                color="accent" 
                variant="tonal" 
                block
                prepend-icon="mdi-calendar-multiple"
                @click="navigateToBookings"
              >
                View All Bookings
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Quick Actions -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="3">
            <v-card-title class="pa-4 bg-grey-lighten-4">
              <v-icon icon="mdi-lightning-bolt" class="mr-2" color="primary"></v-icon>
              <span class="font-weight-bold">Quick Actions</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-btn 
                    color="primary" 
                    size="large" 
                    block
                    prepend-icon="mdi-plus-circle"
                    @click="router.push({ path: '/rooms', query: { addRoom: 'true' } })"
                  >
                    Add Room
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn 
                    color="accent" 
                    size="large" 
                    block
                    prepend-icon="mdi-calendar-plus"
                    @click="router.push({ path: '/bookings', query: { addBooking: 'true' } })"
                  >
                    Make Booking
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn 
                    color="success" 
                    size="large" 
                    block
                    variant="tonal"
                    prepend-icon="mdi-door"
                    @click="navigateToRooms"
                  >
                    View Rooms
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-btn 
                    color="orange-darken-2" 
                    size="large" 
                    block
                    variant="tonal"
                    prepend-icon="mdi-calendar-multiple"
                    @click="navigateToBookings"
                  >
                    View Bookings
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(26, 35, 126, 0.15) !important;
}

.h-100 {
  height: 100%;
}
</style>
