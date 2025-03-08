<template>
  <div>
    <div
      class="potree_container"
      style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px"
    >
      <div id="potree_render_area" style="width: 100%; height: 100%">
        <!-- Render error message if any -->
        <ErrorMessage :message="errorMessage"> </ErrorMessage>
      </div>
    </div>
    <div id="potree_sidebar_container"></div>
  </div>
</template>

<script setup>
// Import Three.js and Potree
import { usePointCloudStore } from "@/stores/pointcloud";
import { ref, onMounted, watch } from "vue";
import ErrorMessage from "./ErrorMessage.vue";
import ColorVariableSelector from "./ColorVariableSelector.vue";

const pointcloudId = new URLSearchParams(window.location.search).get("id");
const errorMessage = ref("");
const pointcloudLoaded = ref(false);

const pointcloudStore = usePointCloudStore();

const volume = ref(null);

function showError(message) {
  errorMessage.value = message;
  console.error(message);
}

// Function to change the active attribute
function onAttributeChange(attributeName) {
  if (window.viewer && window.viewer.scene.pointclouds.length > 0) {
    const pointcloud = window.viewer.scene.pointclouds[0];
    const material = pointcloud.material;
    material.activeAttributeName = attributeName;
  }
}

watch(
  () => pointcloudStore.activeAttribute,
  (newValue) => {
    console.log("New attribute", newValue);
    onAttributeChange(newValue);
  }
);

watch(
  () => [pointcloudStore.filterMin, pointcloudStore.filterMax],
  ([newMin, newMax]) => {
    console.log("Filtering source ID", newMin, newMax);
    window.viewer.setFilterPointSourceIDRange(newMin, newMax);
  }
);

function onClipChanged({ type, object }) {
  pointcloudStore.setClipPosition(object.position);
  pointcloudStore.setClipRotation(object.rotation.toVector3());
  pointcloudStore.setClipScale(object.scale);
}

function onVolumeAdded({ scene, volume }) {
  console.log("Volume added", scene, volume);

  volume.addEventListener("scale_changed", onClipChanged);
  volume.addEventListener("orientation_changed", onClipChanged);
  volume.addEventListener("position_changed", onClipChanged);
}

onMounted(() => {
  if (!pointcloudId) {
    showError(
      'No point cloud id specified. Please provide a valid "id" query parameter. <a href="/?id=data">Here\'s an example</a>'
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
        material.activeAttributeName = pointcloudStore.activeAttribute;
        material.minSize = 1;
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        // Add pointcloud to the viewer scene
        window.viewer.scene.addPointCloud(pointcloud);
        window.viewer.scene.view.position.set(2572291, 1096850, 1958);
        window.viewer.scene.view.lookAt(2572360, 1097496, 1787);
        window.viewer.scene.addEventListener("volume_added", onVolumeAdded);

        // Mark pointcloud as loaded
        pointcloudLoaded.value = true;
      })
      .catch((err) => {
        console.error(err);
        showError("Failed to load point cloud from the provided URL.");
      });
  } catch (err) {
    showError("The provided URL is not valid. Please provide a valid URL.");
    console.error(err);
  }
});

// Provide the global setActiveAttributeName function for backward compatibility
window.setActiveAttributeName = function (name) {
  onAttributeChange(name);
};
</script>

<style scoped>
.potree_container {
}
</style>
