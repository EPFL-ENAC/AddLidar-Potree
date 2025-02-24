<template>
  <q-card class="q-pa-md download-card" bordered style="width: 300px">
    <q-card-section>
      <div class="text-h6">Download Data</div>
    </q-card-section>
    <q-form @submit.prevent="downloadData">
      <q-card-section class="q-pa-sm">
        <q-select
          filled
          label="Select Level"
          v-model="form.level"
          :options="levelOptions"
        />
        <q-select
          filled
          label="Type"
          v-model="form.type"
          :options="typeOptions"
        />
        <q-select
          filled
          label="Format"
          v-model="form.format"
          :options="formatOptions"
        />
        <q-input
          filled
          type="number"
          label="EPSG Code"
          v-model="form.epsg"
          placeholder="EPSG Code (optional)"
        />
        <q-input
          filled
          type="number"
          label="Density"
          v-model="form.density"
          placeholder="Density (optional)"
        />
        <q-input
          filled
          type="textarea"
          label="Area (GeoJSON)"
          v-model="form.area"
          placeholder="Enter GeoJSON area..."
          autogrow
          rows="4"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Download" type="submit" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  level: "0",
  type: "traj",
  format: "LAS",
  epsg: "",
  density: "",
  area: "",
});

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

const typeOptions = [
  { label: "Trajectory", value: "traj" },
  { label: "Point Cloud", value: "pointcloud" },
  { label: "Metadata", value: "metadata" },
  { label: "DSM", value: "DSM" },
];

const formatOptions = [
  { label: "LAS", value: "LAS" },
  { label: "LAZ", value: "LAZ" },
  { label: "PCD", value: "PCD" },
];

async function downloadData() {
  const params = new URLSearchParams();
  // Assume the pointcloudId is defined (consider passing it as a prop if needed)
  const pointcloudId = "defaultid"; // Replace with a prop or computed value

  params.append("file_path", `/AddLidar/${pointcloudId}/data.las`);

  if (form.value.type) {
    if (form.value.type === "metadata") {
      params.append("remove_all_attributes", "true");
    }
    params.append("type", form.value.type);
  }
  if (form.value.format) {
    params.append("format", form.value.format);
  }
  if (form.value.epsg) {
    params.append("outcrs", form.value.epsg);
  }
  if (form.value.density) {
    params.append("density", form.value.density);
  }
  if (form.value.area) {
    params.append("roi", form.value.area);
  }
  params.append("level", form.value.level);

  const url = `/process-point-cloud?${params.toString()}`;
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
    a.download = `${pointcloudId}-processed.${form.value.format.toLowerCase()}`;
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
  position: fixed;
  background: white;
  right: 0;
  top: 0;
  height: 100%;
  width: 300px;
  z-index: 10000;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
}
</style>
