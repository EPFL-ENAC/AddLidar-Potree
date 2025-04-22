<template>
  <div class="directory-tree-container">
    <div class="text-h6 q-pb-md">Lidar Directory Structure</div>

    <!-- Search filter -->
    <q-input
      v-model="searchTerm"
      outlined
      dense
      label="Search directories"
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

    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        v-for="group in missionGroups"
        :key="group"
        :name="group"
        :label="group"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel v-for="group in missionGroups" :key="group" :name="group">
        <!-- Simple directory listing -->
        <div class="directory-list q-gutter-y-sm">
          <q-item
            v-for="item in filteredItemsByMission(group)"
            :key="item.path"
            clickable
            :class="{ 'has-files': item.file_count > 0 }"
          >
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
        </div>
      </q-tab-panel>
    </q-tab-panels>
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
const activeTab = ref("");
const hasData = ref(false);

// Compute unique mission groups from the paths
const missionGroups = computed(() => {
  const missions = new Set<string>();
  directoryData.value.forEach((item) => {
    const pathParts = item.path.split("/");
    if (pathParts.length > 1 && pathParts[1]) {
      missions.add(pathParts[1]);
    }
  });
  return Array.from(missions).sort();
});

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

// Filter directories based on mission and search term
function filteredItemsByMission(mission: string) {
  const filtered = directoryData.value.filter((item) => {
    const pathParts = item.path.split("/");
    const itemMission = pathParts.length > 1 ? pathParts[1] : "";

    if (itemMission !== mission) return false;

    if (searchTerm.value) {
      return item.path.toLowerCase().includes(searchTerm.value.toLowerCase());
    }
    return true;
  });

  // Sort by path within the mission
  return filtered.sort((a, b) => {
    const aLabel = getNodeLabel(a.path);
    const bLabel = getNodeLabel(b.path);
    return aLabel.localeCompare(bLabel);
  });
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

  // Set first tab as active
  if (missionGroups.value.length > 0) {
    activeTab.value = missionGroups.value[0];
  }

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

.directory-list {
  max-height: 300px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.7);
}

.has-files {
  background-color: rgba(0, 0, 0, 0.03);
}

.q-tab-panel {
  padding: 8px 0;
}
</style>
