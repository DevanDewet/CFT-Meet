<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import apiClient from '../services/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'roomAdded']);

const { mobile } = useDisplay();

// Form data
const formData = ref({
  name: '',
  capacity: null,
  features: []
});

const loading = ref(false);
const error = ref(null);

// Available features to choose from
const availableFeatures = [
  'Projector',
  'TV Screen',
  'Whiteboard',
  'Soundproofing',
  'Video Conferencing',
  'WiFi',
  'Air Conditioning',
  'Phone'
];

// Form validation rules
const nameRules = [
  v => !!v || 'Room name is required',
  v => (v && v.length >= 3) || 'Room name must be at least 3 characters'
];

const capacityRules = [
  v => !!v || 'Capacity is required',
  v => v > 0 || 'Capacity must be greater than 0',
  v => v <= 100 || 'Capacity must be 100 or less'
];

const formValid = ref(false);

// Close dialog
const closeDialog = () => {
  emit('update:modelValue', false);
  resetForm();
};

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    capacity: null,
    features: []
  };
  error.value = null;
};

// Submit form
const submitForm = async () => {
  if (!formValid.value) return;

  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.post('/rooms', {
      name: formData.value.name,
      capacity: parseInt(formData.value.capacity),
      features: formData.value.features
    });

    // Emit success event
    emit('roomAdded', response.data);
    closeDialog();
  } catch (err) {
    console.error('Error adding room:', err);
    error.value = err.response?.data?.error || 'Failed to add room. Please try again.';
  } finally {
    loading.value = false;
  }
};
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
        <v-icon icon="mdi-plus-circle" size="28" class="mr-3"></v-icon>
        <span class="text-h5 font-weight-bold">Add New Room</span>
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
          <!-- Room Name -->
          <v-text-field
            v-model="formData.name"
            label="Room Name"
            placeholder="e.g., Conference Room A"
            :rules="nameRules"
            variant="outlined"
            prepend-inner-icon="mdi-door"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Capacity -->
          <v-text-field
            v-model.number="formData.capacity"
            label="Capacity"
            placeholder="Number of people"
            type="number"
            :rules="capacityRules"
            variant="outlined"
            prepend-inner-icon="mdi-account-multiple"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Features -->
          <v-select
            v-model="formData.features"
            :items="availableFeatures"
            label="Features"
            placeholder="Select room features"
            variant="outlined"
            prepend-inner-icon="mdi-star-circle"
            multiple
            chips
            closable-chips
            class="mb-2"
          >
            <template v-slot:chip="{ item, props }">
              <v-chip v-bind="props" color="primary" size="small">
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>

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
          prepend-icon="mdi-check"
          @click="submitForm"
          :disabled="!formValid"
          :loading="loading"
        >
          Add Room
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
        <v-toolbar-title class="font-weight-bold">Add New Room</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-form v-model="formValid" @submit.prevent="submitForm">
          <!-- Room Name -->
          <v-text-field
            v-model="formData.name"
            label="Room Name"
            placeholder="e.g., Conference Room A"
            :rules="nameRules"
            variant="outlined"
            prepend-inner-icon="mdi-door"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Capacity -->
          <v-text-field
            v-model.number="formData.capacity"
            label="Capacity"
            placeholder="Number of people"
            type="number"
            :rules="capacityRules"
            variant="outlined"
            prepend-inner-icon="mdi-account-multiple"
            class="mb-4"
            required
          ></v-text-field>

          <!-- Features -->
          <v-select
            v-model="formData.features"
            :items="availableFeatures"
            label="Features"
            placeholder="Select room features"
            variant="outlined"
            prepend-inner-icon="mdi-star-circle"
            multiple
            chips
            closable-chips
            class="mb-2"
          >
            <template v-slot:chip="{ item, props }">
              <v-chip v-bind="props" color="primary" size="small">
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>

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
          prepend-icon="mdi-check"
          @click="submitForm"
          :disabled="!formValid"
          :loading="loading"
        >
          Add Room
        </v-btn>
      </v-footer>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Custom styles if needed */
</style>
