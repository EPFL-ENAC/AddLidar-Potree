<template>
  <q-card class="q-pa-md download-card" bordered style="width: 400px">
    <q-card-section>
      <div class="text-h6">Download Data</div>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md" @submit="downloadData">
        <q-select
          v-model="level"
          outlined
          disable
          label="Select Level"
          :options="levelOptions"
        />
        <q-select
          outlined
          disable
          label="Type"
          v-model="type"
          :options="typeOptions"
        />
        <q-select
          outlined
          label="Format"
          v-model="format"
          :options="formatOptions"
        />
        <q-input
          outlined
          disable
          type="number"
          label="EPSG Code"
          v-model="epsg"
          placeholder="EPSG Code (optional)"
        />
        <q-input
          outlined
          disable
          type="number"
          label="Density"
          v-model="density"
          placeholder="Density (optional)"
        />
        <q-input
          outlined
          disable
          type="textarea"
          label="Area (GeoJSON)"
          v-model="area"
          placeholder="Enter GeoJSON area..."
          autogrow
          rows="4"
        />
        <q-btn label="Download" type="submit" color="primary" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right"> </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const formatOptions = [
  { label: "PCD ASCII", value: "pcd-ascii" },
  { label: "PCD Binary", value: "pcd-bin" },
  { label: "LAS v1.4", value: "lasv14" },
  { label: "LAS v1.3", value: "lasv13" },
  { label: "LAS v1.2", value: "lasv12" },
];

const type = ref("traj");
const format = ref(formatOptions[0]);
const epsg = ref("");
const density = ref("");
const area = ref("");

const levelOptions = [
  { label: "Raw 3D laser vectors", value: "0" },
  { label: "ALS Mounting and Calibration", value: "1" },
  { label: "Refined Trajectory Point Cloud", value: "2" },
  { label: "Geo-referenced Point Cloud", value: "3" },
  { label: "Filtered/Denoised Point Cloud", value: "4" },
  { label: "Basic Classification", value: "5" },
  { label: "DTM/DSM/CHM", value: "6" },
  { label: "Segmented Point Cloud", value: "7" },
];

const level = ref(levelOptions[0]);

const typeOptions = [
  { label: "Trajectory", value: "traj" },
  { label: "Point Cloud", value: "pointcloud" },
  { label: "Metadata", value: "metadata" },
  { label: "DSM", value: "DSM" },
];

const prefixPath = "/api";

async function downloadData() {
  const params = new URLSearchParams();
  const pointcloudId = "defaultid"; // Replace with a prop or computed value

  // Updated file_path parameter base path
  params.append(
    "file_path",
    "/LiDAR/0001_Mission_Root/02_LAS_PCD/all_grouped_high_veg_10th_point.las"
  );

  // If type is metadata, add removal of all non-geometry attributes
  if (type.value === "metadata") {
    params.append("remove_all_attributes", "true");
  }
  // Removed type parameter

  if (format.value) {
    params.append("format", format.value.value);
  }
  if (epsg.value) {
    params.append("outcrs", epsg.value);
  }
  if (density.value) {
    params.append("density", density.value);
  }
  if (area.value) {
    params.append("roi", area.value);
  }
  // Replace the "level" parameter with "returns"
  // params.append("returns", (10).toString());
  params.append("number", (1).toString());

  console.log("Params for download :", params.values(), params.toString());
  const url = prefixPath + `/process-point-cloud?${params.toString()}`;
  console.log("Requesting:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${pointcloudId}-processed.${format.value.value}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error: any) {
    console.error("Download failed:", error);
    alert(
      "Failed to process the point cloud. " +
        error.message +
        "\n\nUsing this url: " +
        url
    );
  }
}
</script>

<style scoped>
/* Add additional custom styles as needed */
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
}
</style>
