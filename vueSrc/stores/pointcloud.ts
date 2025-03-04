import { defineStore } from "pinia";
import { ref } from "vue";

export const usePointCloudStore = defineStore("pointCloud", () => {
  // State as refs
  const activeAttribute = ref("rgba");
  const pointcloudLoaded = ref(false);
  const pointcloudId = ref<string | null>(null);
  const errorMessage = ref("");

  // Single filter range for current attribute
  const filterMin = ref(0);
  const filterMax = ref(100);

  // Actions as functions
  function setActiveAttribute(attributeName: string) {
    activeAttribute.value = attributeName;

    // You might want to reset or adjust filter ranges when attribute changes
    // based on the new attribute's typical value ranges
    resetFilterRange();
  }

  function setFilterRange(min: number, max: number) {
    filterMin.value = min;
    filterMax.value = max;
  }

  function resetFilterRange() {
    // Set default ranges based on current attribute
    switch (activeAttribute.value) {
      case "elevation":
        filterMin.value = 0;
        filterMax.value = 1000;
        break;
      case "intensity":
        filterMin.value = 0;
        filterMax.value = 255;
        break;
      default:
        filterMin.value = 0;
        filterMax.value = 100;
    }
  }

  function setPointcloudId(id: string | null) {
    pointcloudId.value = id;
  }

  function setErrorMessage(message: string) {
    errorMessage.value = message;
  }

  // Return everything that should be exposed
  return {
    // State
    activeAttribute,
    pointcloudLoaded,
    pointcloudId,
    errorMessage,
    filterMin,
    filterMax,

    // Actions
    setActiveAttribute,
    setPointcloudId,
    setErrorMessage,
    setFilterRange,
    resetFilterRange,
  };
});
