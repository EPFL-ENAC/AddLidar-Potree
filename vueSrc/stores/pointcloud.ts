import { defineStore } from "pinia";
import { ref } from "vue";

export const usePointCloudStore = defineStore("pointCloud", () => {
  // State as refs
  const activeAttribute = ref("rgba");
  const pointcloudLoaded = ref(false);
  const pointcloudId = ref<string | null>(null);
  const errorMessage = ref("");

  // Actions as functions
  function setActiveAttribute(attributeName: string) {
    activeAttribute.value = attributeName;
  }

  function setPointcloudLoaded(loaded: boolean) {
    pointcloudLoaded.value = loaded;
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

    // Actions
    setActiveAttribute,
    setPointcloudLoaded,
    setPointcloudId,
    setErrorMessage,
  };
});
