<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  booking: {
    type: Object,
    default: null
  },
  room: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'delete', 'edit']);

const { mobile } = useDisplay();

const closeDialog = () => {
  emit('update:modelValue', false);
};

const handleDelete = () => {
  emit('delete', props.booking.id);
  closeDialog();
};

const handleEdit = () => {
  emit('edit', props.booking.id);
  closeDialog();
};

// Format date and time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate duration
const duration = computed(() => {
  if (!props.booking) return '';
  const start = new Date(props.booking.start);
  const end = new Date(props.booking.end);
  const diff = (end - start) / (1000 * 60); // minutes
  
  if (diff < 60) {
    return `${diff} minutes`;
  }
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return minutes > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes` : `${hours} hour${hours > 1 ? 's' : ''}`;
});

// Check if booking is upcoming, ongoing, or past
const bookingStatus = computed(() => {
  if (!props.booking) return 'upcoming';
  const now = new Date();
  const start = new Date(props.booking.start);
  const end = new Date(props.booking.end);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'past';
  return 'ongoing';
});

const statusColor = computed(() => {
  switch (bookingStatus.value) {
    case 'upcoming': return 'primary';
    case 'ongoing': return 'success';
    case 'past': return 'grey';
    default: return 'primary';
  }
});

const statusText = computed(() => {
  switch (bookingStatus.value) {
    case 'upcoming': return 'Upcoming';
    case 'ongoing': return 'In Progress';
    case 'past': return 'Completed';
    default: return '';
  }
});
</script>

<template>
  <!-- Desktop: Dialog Overlay -->
  <v-dialog
    v-if="!mobile"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="700"
    :persistent="false"
  >
    <v-card v-if="booking">
      <v-card-title class="d-flex align-center bg-primary text-white pa-4">
        <v-icon icon="mdi-calendar-check" size="28" class="mr-3"></v-icon>
        <div class="flex-grow-1">
          <div class="text-h5 font-weight-bold">{{ booking.title }}</div>
          <v-chip
            :color="statusColor"
            size="small"
            variant="flat"
            class="mt-2"
          >
            <v-icon start size="16">
              {{ bookingStatus === 'ongoing' ? 'mdi-clock-outline' : 
                 bookingStatus === 'upcoming' ? 'mdi-calendar-clock' : 'mdi-check-circle' }}
            </v-icon>
            {{ statusText }}
          </v-chip>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-row>
          <!-- Room Information -->
          <v-col cols="12" v-if="room">
            <div class="detail-section">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-door" color="primary" size="28" class="mr-3"></v-icon>
                <span class="text-h6 font-weight-medium">Room Details</span>
              </div>
              <div class="ml-11">
                <div class="text-h6 text-primary mb-2">{{ room.name }}</div>
                <div class="d-flex align-center mb-1">
                  <v-icon icon="mdi-account-multiple" size="20" class="mr-2"></v-icon>
                  <span class="text-body-1">Capacity: {{ room.capacity }} {{ room.capacity === 1 ? 'person' : 'people' }}</span>
                </div>
                <div class="d-flex flex-wrap mt-2">
                  <v-chip
                    v-for="(feature, index) in room.features"
                    :key="index"
                    size="small"
                    color="primary"
                    variant="outlined"
                    class="mr-2 mb-2"
                  >
                    {{ feature }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <!-- Date & Time Information -->
          <v-col cols="12">
            <div class="detail-section">
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-calendar-clock" color="accent" size="28" class="mr-3"></v-icon>
                <span class="text-h6 font-weight-medium">Schedule</span>
              </div>
              <div class="ml-11">
                <div class="mb-3">
                  <div class="text-caption text-grey-darken-1">Date</div>
                  <div class="text-h6">{{ formatDate(booking.start) }}</div>
                </div>
                <div class="mb-3">
                  <div class="text-caption text-grey-darken-1">Start Time</div>
                  <div class="text-body-1">{{ formatDateTime(booking.start) }}</div>
                </div>
                <div class="mb-3">
                  <div class="text-caption text-grey-darken-1">End Time</div>
                  <div class="text-body-1">{{ formatDateTime(booking.end) }}</div>
                </div>
                <div>
                  <div class="text-caption text-grey-darken-1">Duration</div>
                  <div class="text-body-1 font-weight-medium">{{ duration }}</div>
                </div>
              </div>
            </div>
          </v-col>

        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="handleDelete"
          style="color: #c62828; border-color: #c62828;"
          class="delete-action-btn"
        >
          Cancel Booking
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="accent"
          variant="tonal"
          prepend-icon="mdi-pencil"
          @click="handleEdit"
        >
          Edit Booking
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
    <v-card v-if="booking">
      <v-toolbar color="primary" dark>
        <v-btn
          icon="mdi-arrow-left"
          @click="closeDialog"
        ></v-btn>
        <v-toolbar-title class="font-weight-bold">Booking Details</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-4">
        <div class="mb-4">
          <h2 class="text-h5 font-weight-bold text-primary mb-2">{{ booking.title }}</h2>
          <v-chip
            :color="statusColor"
            size="small"
            variant="flat"
            class="font-weight-medium"
          >
            <v-icon start size="16">
              {{ bookingStatus === 'ongoing' ? 'mdi-clock-outline' : 
                 bookingStatus === 'upcoming' ? 'mdi-calendar-clock' : 'mdi-check-circle' }}
            </v-icon>
            {{ statusText }}
          </v-chip>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Room Information -->
        <div class="mb-4" v-if="room">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-door" color="primary" size="28" class="mr-3"></v-icon>
            <span class="text-h6 font-weight-medium">Room Details</span>
          </div>
          <div class="ml-11">
            <div class="text-h6 text-primary mb-2">{{ room.name }}</div>
            <div class="d-flex align-center mb-1">
              <v-icon icon="mdi-account-multiple" size="20" class="mr-2"></v-icon>
              <span class="text-body-1">Capacity: {{ room.capacity }} {{ room.capacity === 1 ? 'person' : 'people' }}</span>
            </div>
            <div class="d-flex flex-wrap mt-2">
              <v-chip
                v-for="(feature, index) in room.features"
                :key="index"
                size="small"
                color="primary"
                variant="outlined"
                class="mr-2 mb-2"
              >
                {{ feature }}
              </v-chip>
            </div>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Schedule -->
        <div class="mb-4">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-calendar-clock" color="accent" size="28" class="mr-3"></v-icon>
            <span class="text-h6 font-weight-medium">Schedule</span>
          </div>
          <div class="ml-11">
            <div class="mb-3">
              <div class="text-caption text-grey-darken-1">Date</div>
              <div class="text-h6">{{ formatDate(booking.start) }}</div>
            </div>
            <div class="mb-3">
              <div class="text-caption text-grey-darken-1">Start Time</div>
              <div class="text-body-1">{{ formatDateTime(booking.start) }}</div>
            </div>
            <div class="mb-3">
              <div class="text-caption text-grey-darken-1">End Time</div>
              <div class="text-body-1">{{ formatDateTime(booking.end) }}</div>
            </div>
            <div>
              <div class="text-caption text-grey-darken-1">Duration</div>
              <div class="text-body-1 font-weight-medium">{{ duration }}</div>
            </div>
          </div>
        </div>

      </v-card-text>

      <!-- Mobile Action Buttons -->
      <v-footer class="bg-white elevation-8 pa-4">
        <v-row dense>
          <v-col cols="12" class="mb-2">
            <v-btn
              block
              size="large"
              color="accent"
              prepend-icon="mdi-pencil"
              @click="handleEdit"
            >
              Edit Booking
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              block
              size="large"
              variant="outlined"
              prepend-icon="mdi-delete"
              @click="handleDelete"
              style="color: #c62828; border-color: #c62828;"
            >
              Cancel Booking
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.detail-section {
  margin-bottom: 16px;
}

.delete-action-btn {
  transition: all 0.2s ease;
}

.delete-action-btn:hover {
  background-color: rgba(198, 40, 40, 0.1) !important;
  border-color: #b71c1c !important;
  color: #b71c1c !important;
}
</style>
