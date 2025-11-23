<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['delete', 'view-details', 'edit']);

const handleDelete = () => {
  emit('delete', props.booking.id);
};

const handleViewDetails = () => {
  emit('view-details', props.booking.id);
};

const handleEdit = () => {
  emit('edit', props.booking.id);
};

// Format date and time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
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

// Calculate duration
const duration = computed(() => {
  const start = new Date(props.booking.start);
  const end = new Date(props.booking.end);
  const diff = (end - start) / (1000 * 60); // minutes
  
  if (diff < 60) {
    return `${diff} min`;
  }
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
});

// Check if booking is upcoming, ongoing, or past
const bookingStatus = computed(() => {
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
  <v-card class="booking-card" elevation="3" hover>
    <v-card-title class="d-flex align-center bg-primary text-white py-3">
      <v-icon icon="mdi-calendar-check" size="28" class="mr-3"></v-icon>
      <span class="text-h6 font-weight-bold">{{ booking.title }}</span>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-delete"
        variant="text"
        color="white"
        size="small"
        @click="handleDelete"
      ></v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-4">
      <!-- Status Badge -->
      <div class="mb-3">
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

      <!-- Room Name -->
      <div class="d-flex align-center mb-3" v-if="room">
        <v-icon icon="mdi-door" color="primary" size="24" class="mr-3"></v-icon>
        <div class="flex-grow-1">
          <div class="text-caption text-grey-darken-1">Room</div>
          <div class="text-body-1 font-weight-medium">{{ room.name }}</div>
        </div>
      </div>

      <!-- Date & Time Combined -->
      <div class="d-flex align-center">
        <v-icon icon="mdi-calendar-clock" color="accent" size="24" class="mr-3"></v-icon>
        <div class="flex-grow-1">
          <div class="text-caption text-grey-darken-1">When</div>
          <div class="text-body-2 font-weight-medium">{{ formatDate(booking.start) }}</div>
          <div class="text-body-2 text-grey-darken-1">
            {{ formatTime(booking.start) }} - {{ formatTime(booking.end) }} ({{ duration }})
          </div>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3 card-actions">
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-eye"
        size="small"
        class="flex-shrink-1"
        @click="handleViewDetails"
      >
        View Details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="accent"
        variant="tonal"
        prepend-icon="mdi-pencil"
        size="small"
        class="flex-shrink-1"
        @click="handleEdit"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.booking-card {
  height: 100%;
  min-width: 280px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(26, 35, 126, 0.15) !important;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  min-height: 60px;
}

.card-actions .v-btn {
  white-space: nowrap;
  min-width: fit-content;
}
</style>
