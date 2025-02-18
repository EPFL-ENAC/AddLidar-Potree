<script setup>
// Import Three.js and Potree

import { ref, onMounted } from "vue";
// You may need to import Potree in a similar manner so it's available globally
// e.g.: import Potree from '../../build/potree/potree.js';

const errorMessage = ref("");
const pointcloudId = new URLSearchParams(window.location.search).get("id");

function showError(message) {
  errorMessage.value = message;
}

onMounted(() => {
  if (!pointcloudId) {
    showError(
      'No point cloud id specified. Please provide a valid "id" query parameter.'
    );
    return;
  }

  window.viewer = new Potree.Viewer(
    document.getElementById("potree_render_area")
  );
  viewer.setEDLEnabled(true);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000);
  viewer.loadSettingsFromURL();
  viewer.setDescription("");

  viewer.loadGUI(() => {
    viewer.setLanguage("en");
    $("#menu_appearance").next().show();
  });
  try {
    const pointCloudUrl = new URL(
      `https://enacit4r-cdn.epfl.ch/AddLidar/${pointcloudId}/metadata.json`
    );
    console.log("pointCloudUrl", pointCloudUrl.href);

    // Load point cloud (assumes Potree.loadPointCloud returns a promise)
    Potree.loadPointCloud(pointCloudUrl.href)
      .then((e) => {
        console.log("point cloud loaded", e);
        const pointcloud = e.pointcloud;
        const material = pointcloud.material;
        material.activeAttributeName = "rgba";
        material.minSize = 1;
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        // Add pointcloud to the viewer scene
        window.viewer.scene.addPointCloud(pointcloud);
        window.viewer.scene.view.position.set(2572291, 1096850, 1958);
        window.viewer.scene.view.lookAt(2572360, 1097496, 1787);
      })
      .catch((err) => {
        console.error(err);
        showError("Failed to load point cloud from the provided URL.");
      });
  } catch (err) {
    showError("The provided URL is not valid. Please provide a valid URL.");
    console.log(err);
  }
});

// Global function for attribute switching:
function setActiveAttributeName(name) {
  const pointcloud = window.viewer.scene.pointclouds[0];
  const material = pointcloud.material;
  material.activeAttributeName = name;
}
</script>

<template>
  <div>
    <div
      class="potree_container"
      style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px"
    >
      <div id="potree_render_area" style="width: 100%; height: 100%">
        <!-- Render error message if any -->
        <div
          v-if="errorMessage"
          id="error-message"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fdd;
            padding: 1em;
            border: 1px solid red;
          "
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
    <div id="potree_sidebar_container"></div>
  </div>
</template>
