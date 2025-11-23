<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../services/api';
import RoomCard from '../components/RoomCard.vue';
import AddRoomDialog from '../components/AddRoomDialog.vue';
import EditRoomDialog from '../components/EditRoomDialog.vue';

const rooms = ref([]);
const loading = ref(true);
const error = ref(null);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const roomToDelete = ref(null);
const selectedRoom = ref(null);
const deleting = ref(false);
const route = useRoute();
const router = useRouter();

const fetchRooms = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await apiClient.get('/rooms');
    rooms.value = response.data;
  } catch (err) {
    console.error('Error fetching rooms:', err);
    error.value = 'Failed to load rooms. Please make sure the backend server is running.';
  } finally {
    loading.value = false;
  }
};

const handleRoomAdded = () => {
  // Refetch all rooms to ensure data consistency after adding
  fetchRooms();
};

const openAddDialog = () => {
  showAddDialog.value = true;
};

const handleDeleteClick = (roomId) => {
  roomToDelete.value = rooms.value.find(r => r.id === roomId);
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!roomToDelete.value) return;

  try {
    deleting.value = true;
    await apiClient.delete(`/rooms/${roomToDelete.value.id}`);
    
    // Close dialog and refresh rooms list
    showDeleteDialog.value = false;
    roomToDelete.value = null;
    fetchRooms();
  } catch (err) {
    console.error('Error deleting room:', err);
    alert('Failed to delete room. Please try again.');
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  roomToDelete.value = null;
};

const handleEditClick = (roomId) => {
  selectedRoom.value = rooms.value.find(r => r.id === roomId);
  showEditDialog.value = true;
};

const handleRoomUpdated = () => {
  showEditDialog.value = false;
  selectedRoom.value = null;
  fetchRooms();
};

// Watch for edit room query parameter
watch(() => route.query.editRoom, (shouldEdit) => {
  if (shouldEdit === 'true' && route.query.roomId) {
    const roomId = parseInt(route.query.roomId);
    selectedRoom.value = rooms.value.find(r => r.id === roomId);
    if (selectedRoom.value) {
      showEditDialog.value = true;
    }
    router.replace({ path: '/rooms' });
  }
}, { immediate: true });

onMounted(() => {
  fetchRooms();
});
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center flex-wrap">
        <div>
          <h1 class="text-h4 text-md-h3 font-weight-bold text-primary mb-2">
            Meeting Rooms
          </h1>
          <p class="text-body-1 text-grey-darken-1">
            Browse and manage available meeting spaces
          </p>
        </div>
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          class="mt-3 mt-md-0"
          @click="openAddDialog"
        >
          Add New Room
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
        <p class="text-h6 text-grey mt-4">Loading rooms...</p>
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
          <v-alert-title class="text-h6 mb-2">Error Loading Rooms</v-alert-title>
          {{ error }}
          <template v-slot:append>
            <v-btn
              color="error"
              variant="outlined"
              @click="fetchRooms"
            >
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Rooms Grid -->
    <v-row v-else class="mt-2">
      <v-col
        v-for="room in rooms"
        :key="room.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <RoomCard :room="room" @delete="handleDeleteClick" @edit="handleEditClick" />
      </v-col>

      <!-- Empty State -->
      <v-col v-if="rooms.length === 0" cols="12">
        <v-card class="pa-8 text-center" elevation="0" color="grey-lighten-4">
          <v-icon icon="mdi-door-open" size="80" color="grey-darken-1" class="mb-4"></v-icon>
          <h2 class="text-h5 text-grey-darken-2 mb-3">No Rooms Available</h2>
          <p class="text-body-1 text-grey-darken-1 mb-4">
            Get started by adding your first meeting room
          </p>
          <v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="openAddDialog">
            Add New Room
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Room Dialog -->
    <AddRoomDialog
      v-model="showAddDialog"
      @room-added="handleRoomAdded"
    />

    <!-- Edit Room Dialog -->
    <EditRoomDialog
      v-model="showEditDialog"
      :room="selectedRoom"
      @roomUpdated="handleRoomUpdated"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center text-white pa-4" style="background-color: #c62828;">
          <v-icon icon="mdi-alert-circle" size="28" class="mr-3"></v-icon>
          <span class="text-h6 font-weight-bold">Delete Room</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <p class="text-body-1">
            Are you sure you want to delete 
            <strong class="text-primary">{{ roomToDelete?.name }}</strong>?
          </p>
          <p class="text-body-2 text-grey-darken-1 mt-2">
            This action cannot be undone. All bookings associated with this room will also be affected.
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
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            prepend-icon="mdi-delete"
            @click="confirmDelete"
            :loading="deleting"
            class="delete-btn"
          >
            Delete Room
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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