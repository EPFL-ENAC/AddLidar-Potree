<template>
  <q-card class="q-pa-md download-card column justify-around" bordered>
    <q-card-section>
      <div class="text-h6 q-pb-md">Download Data Options:</div>
      <q-form class="q-gutter-md" @submit.prevent="onSubmit">
        <q-select
          outlined
          label="Format"
          v-model="format"
          :options="formatOptions"
        />
        <q-select
          outlined
          label="EPSG Code"
          :options="epsgOptions"
          v-model="epsg"
          placeholder="EPSG Code (optional)"
        />
        <clip-volume> </clip-volume>

        <q-input
          outlined
          type="number"
          label="Number of points"
          v-model="number"
          placeholder="Number of points (optional)"
        />

        <q-btn
          label="Generate processing request"
          class="100"
          size="md"
          outline
          type="submit"
          color="primary"
          :loading="processing"
        >
          <template v-slot:loading>
            <q-spinner-gears class="on-left" />
            Starting job...
          </template>
        </q-btn>
      </q-form>
    </q-card-section>

    <!-- Status and progress section -->
    <q-card-section v-if="currentJob">
      <div class="text-h6">Job Status</div>
      <div class="q-mt-sm">
        <div class="row items-center">
          <div class="col">
            <div><strong>Job ID:</strong> {{ currentJob.job_name }}</div>
            <div><strong>Status:</strong> {{ jobStatus }}</div>
            <div v-if="jobProgress > 0">
              <strong>Progress:</strong>
              {{ Math.floor(jobProgress * 100) }}%
            </div>
          </div>
          <div class="col-auto">
            <!-- Show checkmark when job is complete -->
            <q-icon
              v-if="
                jobStatus === 'Complete' || jobStatus === 'SuccessCriteriaMet'
              "
              name="check_circle"
              color="primary"
              size="md"
              class="q-ml-md"
            />
            <!-- Show error icon when there's an error -->
            <q-icon
              v-else-if="jobStatus === 'Error'"
              name="error"
              color="negative"
              size="md"
              class="q-ml-md"
            />
            <!-- Show indeterminate progress otherwise -->
            <q-circular-progress
              v-else
              size="md"
              indeterminate
              color="secondary"
              track-color="grey-3"
              class="q-ml-md"
            />
          </div>
        </div>

        <q-btn
          v-if="jobStatus === 'Complete' || jobStatus === 'SuccessCriteriaMet'"
          label="Download File"
          outline
          color="primary"
          class="q-mt-md full-width"
          @click="downloadResult"
        />

        <q-btn
          v-else-if="jobStatus !== 'Error'"
          label="Check Status"
          color="secondary"
          outline
          class="q-mt-md full-width"
          @click="checkJobStatus"
          :loading="checkingStatus"
        />
      </div>
    </q-card-section>

    <!-- Status log (can be expanded/collapsed) -->
    <q-card-section v-if="statusLogs.length">
      <q-expansion-item label="Status Log" header-class="text-primary">
        <q-card>
          <q-card-section class="status-log q-pa-sm">
            <div
              v-for="(log, index) in statusLogs"
              :key="index"
              class="log-item"
            >
              <span class="text-caption">{{ log.time }}:</span>
              {{ log.message }}
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>

    <q-card-section>
      <color-variable-selector />
    </q-card-section>

    <q-card-section>
      <range-filter :max="10" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import ColorVariableSelector from "@/components/ColorVariableSelector.vue";
import ClipVolume from "@/components/ClipVolume.vue";
import RangeFilter from "@/components/RangeFilter.vue";
import { ref, onBeforeUnmount } from "vue";
import { formatOptions, epsgOptions, type SelectOption } from "@/utils/api";
import useDownloadService from "@/utils/useDownloadService";
import type { JobParams } from "@/utils/useDownloadService";
import { usePointCloudStore } from "@/stores/pointcloud";

const store = usePointCloudStore();

// Keep the entire service instance available
const downloadService = useDownloadService();

// Extract frequently used properties
const {
  processing,
  currentJob,
  closeConnection,
  jobStatus,
  jobProgress,
  statusLogs,
  startJob,
  downloadResult,
  checkJobStatus,
  checkingStatus,
} = downloadService;

const { clipPosition, clipRotation, clipScale } = store;

// Form values
const type = ref("traj");
const format = ref<SelectOption | undefined>(undefined);
const epsg = ref<string | undefined>(undefined);
const density = ref("");
const area = ref("");
const number = ref(1000);

function clipCoorToString(coor: { x: number; y: number; z: number }) {
  return `${coor.x},${coor.y},${coor.z}`;
}

// Function to handle form submission
function onSubmit(): void {
  // Create params object from form values
  const params: JobParams = {
    file_path:
      "/LiDAR/0001_Mission_Root/02_LAS_PCD/all_grouped_high_veg_10th_point.las", // Default path
    format: format.value ? format.value.value : undefined,
    number: parseInt(number.value as any),
  };

  // Add optional parameters if they exist
  if (epsg.value) params.outcrs = epsg.value;
  if (density.value) params.density = density.value;
  if (area.value) params.roi = area.value;
  if (store.clipVolume)
    params.roi = `${clipCoorToString(clipPosition)},${clipCoorToString(
      clipRotation
    )},${clipCoorToString(clipScale)}`;

  console.log("ROI", params.roi);
  // If type is metadata, add special flag
  if (type.value === "metadata") params.remove_all_attributes = true;

  // Call the startJob function with our params
  startJob(params);
}

// Clean up WebSocket connection when component is destroyed
onBeforeUnmount(closeConnection);
</script>

<style scoped>
.download-card {
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  z-index: 2;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.status-log {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f5f5f5;
  font-family: monospace;
  font-size: 0.8rem;
}

.log-item {
  padding: 2px 0;
  border-bottom: 1px solid #eee;
}

.log-item:last-child {
  border-bottom: none;
}
</style>
