<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../services/api';
import BookingCard from '../components/BookingCard.vue';
import BookingDetailsDialog from '../components/BookingDetailsDialog.vue';
import AddBookingDialog from '../components/AddBookingDialog.vue';
import EditBookingDialog from '../components/EditBookingDialog.vue';

const bookings = ref([]);
const rooms = ref([]);
const loading = ref(true);
const error = ref(null);
const showAddBookingDialog = ref(false);
const showEditBookingDialog = ref(false);
const showDeleteDialog = ref(false);
const bookingToDelete = ref(null);
const deleting = ref(false);
const showDetailsDialog = ref(false);
const selectedBooking = ref(null);
const route = useRoute();
const router = useRouter();
const selectedRoomId = ref(null);

const fetchBookingsAndRooms = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch both bookings and rooms in parallel
    const [bookingsResponse, roomsResponse] = await Promise.all([
      apiClient.get('/bookings'),
      apiClient.get('/rooms')
    ]);
    
    bookings.value = bookingsResponse.data;
    rooms.value = roomsResponse.data;
  } catch (err) {
    console.error('Error fetching bookings:', err);
    error.value = 'Failed to load bookings. Please make sure the backend server is running.';
  } finally {
    loading.value = false;
  }
};

// Get room details for a booking
const getRoomForBooking = (roomId) => {
  return rooms.value.find(r => r.id === roomId);
};

const handleDeleteClick = (bookingId) => {
  bookingToDelete.value = bookings.value.find(b => b.id === bookingId);
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!bookingToDelete.value) return;

  try {
    deleting.value = true;
    await apiClient.delete(`/bookings/${bookingToDelete.value.id}`);
    
    // Close dialog and refresh bookings list
    showDeleteDialog.value = false;
    bookingToDelete.value = null;
    fetchBookingsAndRooms();
  } catch (err) {
    console.error('Error deleting booking:', err);
    alert('Failed to delete booking. Please try again.');
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  bookingToDelete.value = null;
};

const handleBookingAdded = () => {
  showAddBookingDialog.value = false;
  selectedRoomId.value = null;
  fetchBookingsAndRooms();
};

const handleBookingUpdated = () => {
  showEditBookingDialog.value = false;
  fetchBookingsAndRooms();
};

const handleViewDetails = (bookingId) => {
  selectedBooking.value = bookings.value.find(b => b.id === bookingId);
  showDetailsDialog.value = true;
};

const handleDeleteFromDetails = (bookingId) => {
  showDetailsDialog.value = false;
  handleDeleteClick(bookingId);
};

const handleEditFromDetails = (bookingId) => {
  selectedBooking.value = bookings.value.find(b => b.id === bookingId);
  showDetailsDialog.value = false;
  showEditBookingDialog.value = true;
};

const handleEdit = (bookingId) => {
  selectedBooking.value = bookings.value.find(b => b.id === bookingId);
  showEditBookingDialog.value = true;
};

watch(() => route.query.addBooking, (shouldAdd) => {
  if (shouldAdd === 'true') {
    // Get roomId from query if present
    selectedRoomId.value = route.query.roomId ? parseInt(route.query.roomId) : null;
    showAddBookingDialog.value = true;
    // Clean up the URL by removing query parameters
    router.replace({ path: '/bookings' });
  }
}, { immediate: true });

onMounted(() => {
  fetchBookingsAndRooms();
});
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center flex-wrap">
        <div>
          <h1 class="text-h4 text-md-h3 font-weight-bold text-primary mb-2">
            Bookings
          </h1>
          <p class="text-body-1 text-grey-darken-1">
            View and manage meeting schedules
          </p>
        </div>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          class="mt-3 mt-md-0"
          @click="showAddBookingDialog = true"
        >
          Make a Booking
        </v-btn>
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
        <p class="text-h6 text-grey mt-4">Loading bookings...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="mt-8">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          prominent
          border="start"
        >
          <v-alert-title class="text-h6 mb-2">Error Loading Bookings</v-alert-title>
          {{ error }}
          <template v-slot:append>
            <v-btn
              color="error"
              variant="outlined"
              @click="fetchBookingsAndRooms"
            >
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Bookings Grid -->
    <v-row v-else class="mt-2">
      <v-col
        v-for="booking in bookings"
        :key="booking.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <BookingCard 
          :booking="booking" 
          :room="getRoomForBooking(booking.roomId)"
          @delete="handleDeleteClick"
          @view-details="handleViewDetails"
          @edit="handleEdit"
        />
      </v-col>

      <!-- Empty State -->
      <v-col v-if="bookings.length === 0" cols="12">
        <v-card class="pa-8 text-center" elevation="0" color="grey-lighten-4">
          <v-icon icon="mdi-calendar-blank" size="80" color="grey-darken-1" class="mb-4"></v-icon>
          <h2 class="text-h5 text-grey-darken-2 mb-3">No Bookings Yet</h2>
          <p class="text-body-1 text-grey-darken-1 mb-4">
            Get started by scheduling your first meeting
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="showAddBookingDialog = true">
            Make a Booking
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center text-white pa-4" style="background-color: #c62828;">
          <v-icon icon="mdi-alert-circle" size="28" class="mr-3"></v-icon>
          <span class="text-h6 font-weight-bold">Cancel Booking</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <p class="text-body-1">
            Are you sure you want to cancel the booking 
            <strong class="text-primary">{{ bookingToDelete?.title }}</strong>?
          </p>
          <p class="text-body-2 text-grey-darken-1 mt-2">
            This action cannot be undone and will free up the room for other bookings.
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="cancelDelete"
            :disabled="deleting"
            class="cancel-btn"
          >
            Keep Booking
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            prepend-icon="mdi-calendar-remove"
            @click="confirmDelete"
            :loading="deleting"
            class="delete-btn"
          >
            Cancel Booking
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Booking Details Dialog -->
    <BookingDetailsDialog
      v-model="showDetailsDialog"
      :booking="selectedBooking"
      :room="selectedBooking ? getRoomForBooking(selectedBooking.roomId) : null"
      @delete="handleDeleteFromDetails"
      @edit="handleEditFromDetails"
    />

    <!-- Add Booking Dialog -->
    <AddBookingDialog 
      v-model="showAddBookingDialog" 
      :initialRoomId="selectedRoomId"
      @bookingAdded="handleBookingAdded"
    />

    <!-- Edit Booking Dialog -->
    <EditBookingDialog 
      v-model="showEditBookingDialog" 
      :booking="selectedBooking"
      :rooms="rooms"
      @bookingUpdated="handleBookingUpdated"
    />
  </v-container>
</template>

<style scoped>
.cancel-btn {
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
  border-color: #424242 !important;
}

.delete-btn {
  background-color: #c62828;
  color: white;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #b71c1c !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(198, 40, 40, 0.3) !important;
}

.delete-btn:active {
  transform: translateY(0);
}
</style>