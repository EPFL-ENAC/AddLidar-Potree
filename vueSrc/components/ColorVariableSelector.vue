<template>
  <div>
    <q-expansion-item label="Color Variable" header-class="h2">
      <q-option-group
        v-model="selectedAttribute"
        :options="attributeOptions"
        type="radio"
      />
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePointCloudStore } from "@/stores/pointcloud";

// Use the store
const store = usePointCloudStore();

// Setup attribute options
const attributeOptions = [
  { label: "RGBA", value: "rgba" },
  { label: "RGB", value: "rgb" },
  { label: "Classification", value: "classification" },
  { label: "Intensity", value: "intensity" },
  { label: "Elevation", value: "elevation" },
  { label: "Group", value: "Group" },
  { label: "Normal", value: "Normal" },
  { label: "Distance", value: "Distance" },
  { label: "GPS Time", value: "gps-time" },
];

// Use a computed property with getter and setter to sync with store
const selectedAttribute = computed({
  get: () => store.activeAttribute,
  set: (value) => {
    store.setActiveAttribute(value);
  },
});
</script>

<style scoped></style>
