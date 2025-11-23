<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import apiClient from '../services/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  initialRoomId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'bookingAdded']);

const { mobile } = useDisplay();

// Form data
const formData = ref({
  title: '',
  roomId: props.initialRoomId,
  date: '',
  startTime: '',
  endTime: ''
});

const rooms = ref([]);
const loading = ref(false);
const error = ref(null);
const loadingRooms = ref(true);

// Fetch available rooms
const fetchRooms = async () => {
  try {
    loadingRooms.value = true;
    const response = await apiClient.get('/rooms');
    rooms.value = response.data;
  } catch (err) {
    console.error('Error fetching rooms:', err);
    error.value = 'Failed to load rooms.';
  } finally {
    loadingRooms.value = false;
  }
};

// Form validation rules
const titleRules = [
  v => !!v || 'Meeting title is required',
  v => (v && v.length >= 3) || 'Title must be at least 3 characters'
];

const roomRules = [
  v => !!v || 'Room selection is required'
];

const dateRules = [
  v => !!v || 'Date is required',
  v => {
    const selectedDate = new Date(v);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today || 'Date cannot be in the past';
  }
];

const startTimeRules = [
  v => !!v || 'Start time is required'
];

const endTimeRules = [
  v => !!v || 'End time is required',
  v => {
    if (!formData.value.startTime || !v) return true;
    return v > formData.value.startTime || 'End time must be after start time';
  }
];

const formValid = ref(false);

// Get minimum date (today)
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Close dialog
const closeDialog = () => {
  emit('update:modelValue', false);
  resetForm();
};

// Reset form
const resetForm = () => {
  formData.value = {
    title: '',
    roomId: null,
    date: '',
    startTime: '',
    endTime: ''
  };
  error.value = null;
};

// Submit form
const submitForm = async () => {
  if (!formValid.value) return;

  try {
    loading.value = true;
    error.value = null;

    // Combine date and time into ISO format
    const startDateTime = `${formData.value.date}T${formData.value.startTime}`;
    const endDateTime = `${formData.value.date}T${formData.value.endTime}`;

    const response = await apiClient.post('/bookings', {
      title: formData.value.title,
      roomId: formData.value.roomId,
      start: startDateTime,
      end: endDateTime
    });

    // Emit success event
    emit('bookingAdded', response.data);
    closeDialog();
  } catch (err) {
    console.error('Error creating booking:', err);
    error.value = err.response?.data?.error || 'Failed to create booking. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRooms();
});
</script>

<template>
  <!-- Desktop: Dialog Overlay -->
  <v-dialog
    v-if="!mobile"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-primary text-white pa-4">
        <v-icon icon="mdi-calendar-plus" size="28" class="mr-3"></v-icon>
        <span class="text-h5 font-weight-bold">Make a Booking</span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form v-model="formValid" @submit.prevent="submitForm">
          <!-- Meeting Title -->
          <v-text-field
            v-model="formData.title"
            label="Meeting Title"
            placeholder="e.g., Team Standup"
            :rules="titleRules"
            variant="outlined"
            prepend-inner-icon="mdi-text"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Room Selection -->
          <v-select
            v-model="formData.roomId"
            :items="rooms"
            item-title="name"
            item-value="id"
            label="Select Room"
            placeholder="Choose a meeting room"
            :rules="roomRules"
            variant="outlined"
            prepend-inner-icon="mdi-door"
            :loading="loadingRooms"
            class="mb-4"
            required
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:subtitle>
                  <span class="text-caption">Capacity: {{ item.raw.capacity }} people</span>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <!-- Date -->
          <v-text-field
            v-model="formData.date"
            label="Date"
            type="date"
            :rules="dateRules"
            :min="minDate"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Start Time -->
          <v-text-field
            v-model="formData.startTime"
            label="Start Time"
            type="time"
            :rules="startTimeRules"
            variant="outlined"
            prepend-inner-icon="mdi-clock-start"
            class="mb-4"
            required
          ></v-text-field>

          <!-- End Time -->
          <v-text-field
            v-model="formData.endTime"
            label="End Time"
            type="time"
            :rules="endTimeRules"
            variant="outlined"
            prepend-inner-icon="mdi-clock-end"
            class="mb-2"
            required
          ></v-text-field>

          <!-- Error Alert -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          variant="text"
          color="grey"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          @click="submitForm"
          :disabled="!formValid"
          :loading="loading"
        >
          Create Booking
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Mobile: Full Page -->
  <v-dialog
    v-else
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn
          icon="mdi-arrow-left"
          @click="closeDialog"
        ></v-btn>
        <v-toolbar-title class="font-weight-bold">Make a Booking</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-form v-model="formValid" @submit.prevent="submitForm">
          <!-- Meeting Title -->
          <v-text-field
            v-model="formData.title"
            label="Meeting Title"
            placeholder="e.g., Team Standup"
            :rules="titleRules"
            variant="outlined"
            prepend-inner-icon="mdi-text"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Room Selection -->
          <v-select
            v-model="formData.roomId"
            :items="rooms"
            item-title="name"
            item-value="id"
            label="Select Room"
            placeholder="Choose a meeting room"
            :rules="roomRules"
            variant="outlined"
            prepend-inner-icon="mdi-door"
            :loading="loadingRooms"
            class="mb-4"
            required
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:subtitle>
                  <span class="text-caption">Capacity: {{ item.raw.capacity }} people</span>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <!-- Date -->
          <v-text-field
            v-model="formData.date"
            label="Date"
            type="date"
            :rules="dateRules"
            :min="minDate"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Start Time -->
          <v-text-field
            v-model="formData.startTime"
            label="Start Time"
            type="time"
            :rules="startTimeRules"
            variant="outlined"
            prepend-inner-icon="mdi-clock-start"
            class="mb-4"
            required
          ></v-text-field>

          <!-- End Time -->
          <v-text-field
            v-model="formData.endTime"
            label="End Time"
            type="time"
            :rules="endTimeRules"
            variant="outlined"
            prepend-inner-icon="mdi-clock-end"
            class="mb-2"
            required
          ></v-text-field>

          <!-- Error Alert -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <!-- Mobile Action Button -->
      <v-footer class="bg-white elevation-8 pa-4">
        <v-btn
          block
          size="large"
          color="primary"
          @click="submitForm"
          :disabled="!formValid"
          :loading="loading"
        >
          Create Booking
        </v-btn>
      </v-footer>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Custom styles if needed */
</style>
