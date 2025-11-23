<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit']);
const router = useRouter();

const handleDelete = () => {
  emit('delete', props.room.id);
};

const handleEdit = () => {
  emit('edit', props.room.id);
};

const handleBookRoom = (roomId) => {
  router.push({ 
    path: '/bookings', 
    query: { addBooking: 'true', roomId: roomId } 
  });
};

</script>

<template>
  <v-card class="room-card" elevation="3" hover>
    <v-card-title class="d-flex align-center bg-primary text-white py-3">
      <v-icon icon="mdi-door" size="28" class="mr-3"></v-icon>
      <span class="text-h6 font-weight-bold">{{ room.name }}</span>
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
      <!-- Capacity -->
      <div class="d-flex align-center mb-3">
        <v-icon icon="mdi-account-multiple" color="primary" size="24" class="mr-3"></v-icon>
        <div>
          <div class="text-caption text-grey-darken-1">Capacity</div>
          <div class="text-h6 font-weight-medium">{{ room.capacity }} {{ room.capacity === 1 ? 'person' : 'people' }}</div>
        </div>
      </div>

      <!-- Features -->
      <div class="features-section">
        <div class="d-flex align-center mb-2">
          <v-icon icon="mdi-star-circle" color="accent" size="24" class="mr-3"></v-icon>
          <div class="text-caption text-grey-darken-1 font-weight-medium">Features</div>
        </div>
        
        <div class="ml-10">
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
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3 card-actions">
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
      <v-spacer></v-spacer>
      <v-btn
        color="accent"
        variant="tonal"
        prepend-icon="mdi-calendar-plus"
        size="small"
        class="flex-shrink-1"
        @click="handleBookRoom(room.id)"
      >
        Book Room
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    getFeatureIcon(feature) {
      const icons = {
        'Projector': 'mdi-projector',
        'TV Screen': 'mdi-television',
        'Whiteboard': 'mdi-whiteboard',
        'Soundproofing': 'mdi-volume-off',
        'Video Conferencing': 'mdi-video',
        'WiFi': 'mdi-wifi'
      };
      return icons[feature] || 'mdi-check-circle';
    }
  }
};
</script>

<style scoped>
.room-card {
  height: 100%;
  min-width: 250px;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.room-card:hover {
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

.features-section {
  margin-top: 8px;
}

.v-chip {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
