<template>
  <div class="directory-tree-container">
    <div class="text-h6 q-pb-md">Lidar Directory Structure</div>

    <!-- Search filter -->
    <q-input
      v-model="searchTerm"
      outlined
      dense
      label="Search files"
      class="q-mb-md"
      clearable
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div v-if="!hasData" class="text-center q-pa-md">
      <q-spinner color="primary" size="24px" />
      <div class="q-mt-sm text-grey">Loading directory data...</div>
    </div>

    <!-- Mission selection - First level -->
    <q-list bordered separator class="rounded-borders list-files">
      <q-expansion-item
        v-for="mission in filteredMissions"
        :key="mission"
        :label="mission"
        icon="folder"
        group="missions"
        header-class="text-primary"
      >
        <!-- Files in mission - Second level -->
        <q-list padding>
          <q-item
            v-for="item in getFilesForMission(mission)"
            :key="item.path"
            clickable
            :class="{ 'has-files': item.file_count > 0 }"
          >
            <q-item-section avatar>
              <q-icon name="description" color="grey" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ getNodeLabel(item.path) }}</q-item-label>
              <q-item-label caption>
                {{ formatSize(item.size_kb) }}
                <q-badge
                  v-if="item.file_count > 0"
                  color="green"
                  text-color="white"
                  class="q-ml-xs"
                >
                  {{ item.file_count }}
                  {{ item.file_count === 1 ? "file" : "files" }}
                </q-badge>
                <q-badge v-else color="grey" text-color="white" class="q-ml-xs"
                  >Empty</q-badge
                >
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="item.file_count > 0">
              <q-btn
                flat
                round
                dense
                icon="download"
                color="primary"
                @click="downloadDirectory(item.path)"
              >
                <q-tooltip>Download files</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import directoryMetadata from "@/assets/lidar_directory_metadata.json";

interface DirectoryNode {
  path: string;
  size_kb: number;
  mod_time: string;
  mod_time_epoch: number;
  file_count: number;
}

// State
const searchTerm = ref("");
const directoryData = ref<DirectoryNode[]>([]);
const baseUrl = ref("https://addlidar-potree-dev.epfl.ch");
const hasData = ref(false);

// Compute unique mission names from the paths
const missions = computed(() => {
  const missionSet = new Set<string>();
  directoryData.value.forEach((item) => {
    const pathParts = item.path.split("/");
    if (pathParts.length > 1 && pathParts[1]) {
      missionSet.add(pathParts[1]);
    }
  });
  return Array.from(missionSet).sort();
});

// Filter missions based on search term
const filteredMissions = computed(() => {
  if (!searchTerm.value) {
    return missions.value;
  }

  const term = searchTerm.value.toLowerCase();

  // Include mission if mission name matches or any of its files match
  return missions.value.filter((mission) => {
    // Check if mission name matches search
    if (mission.toLowerCase().includes(term)) {
      return true;
    }

    // Check if any file in this mission matches search
    const filesInMission = getFilesForMission(mission);
    return filesInMission.some(
      (item) =>
        getNodeLabel(item.path).toLowerCase().includes(term) ||
        item.path.toLowerCase().includes(term)
    );
  });
});

// Get files for a specific mission
function getFilesForMission(mission: string) {
  const filtered = directoryData.value.filter((item) => {
    const pathParts = item.path.split("/");
    return pathParts.length > 1 && pathParts[1] === mission;
  });

  // Sort by filename (last part of path)
  return filtered.sort((a, b) => {
    const aLabel = getNodeLabel(a.path);
    const bLabel = getNodeLabel(b.path);
    return aLabel.localeCompare(bLabel);
  });
}

// Format size to human-readable
function formatSize(sizeKb: number): string {
  if (sizeKb < 1024) {
    return `${sizeKb} KB`;
  } else if (sizeKb < 1024 * 1024) {
    return `${(sizeKb / 1024).toFixed(2)} MB`;
  } else {
    return `${(sizeKb / (1024 * 1024)).toFixed(2)} GB`;
  }
}

// Extract the last part of the path for display
function getNodeLabel(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

// Function to initiate direct download
function downloadDirectory(path: string): void {
  // Create the download URL by combining baseUrl with the path
  // Remove the leading slash from path if present
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  const downloadUrl = `${baseUrl.value}/static/${cleanPath}`;

  // Open in new tab or trigger download
  window.open(downloadUrl, "_blank");
}

// Load directory data on component mount
onMounted(() => {
  // Load the directory metadata
  directoryData.value = directoryMetadata as DirectoryNode[];
  hasData.value = true;

  // In production, get the actual base URL from the environment or config
  if (import.meta.env.VITE_API_BASE_URL) {
    baseUrl.value = import.meta.env.VITE_API_BASE_URL;
  }
  // Otherwise use the deployment URL
});
</script>

<style scoped>
.directory-tree-container {
  width: 100%;
}

.list-files {
  max-height: 400px;
  overflow-y: auto;
}

.has-files {
  background-color: rgba(0, 0, 0, 0.03);
}

.q-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
