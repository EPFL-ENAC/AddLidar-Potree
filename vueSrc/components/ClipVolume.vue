<template>
  <q-expansion-item
    label="Clip Box Properties"
    header-class="text-primary"
    icon="crop_3d"
    default-opened
  >
    <q-card>
      <q-card-section>
        <q-btn
          label="Insert volume"
          color="secondary"
          outline
          class="q-mt-md full-width"
          @click="startInsertion"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Position X,Y,Z</div>
        <div class="row q-mb-sm">
          <div class="col">
            <q-badge color="blue" flat>{{ position.x.toFixed() }}</q-badge>
          </div>
          <div class="col">
            <q-badge color="green" flat>{{ position.y.toFixed() }}</q-badge>
          </div>
          <div class="col">
            <q-badge color="red" flat>{{ position.z.toFixed() }}</q-badge>
          </div>
        </div>

        <div class="text-subtitle2 q-mb-sm">Rotation X,Y,Z (deg)</div>
        <div class="row q-mb-sm">
          <div class="col">
            <q-badge color="blue" flat
              >{{ ((rotation.x * 180) / Math.PI).toFixed(1) }}°</q-badge
            >
          </div>
          <div class="col">
            <q-badge color="green" flat
              >{{ ((rotation.y * 180) / Math.PI).toFixed(1) }}°</q-badge
            >
          </div>
          <div class="col">
            <q-badge color="red" flat
              >{{ ((rotation.z * 180) / Math.PI).toFixed(1) }}°</q-badge
            >
          </div>
        </div>

        <div class="text-subtitle2 q-mb-sm">Scale X,Y,Z</div>
        <div class="row">
          <div class="col">
            <q-badge color="blue" flat>{{ scale.x.toFixed(2) }}</q-badge>
          </div>
          <div class="col">
            <q-badge color="green" flat>{{ scale.y.toFixed(2) }}</q-badge>
          </div>
          <div class="col">
            <q-badge color="red" flat>{{ scale.z.toFixed(2) }}</q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { usePointCloudStore } from "@/stores/pointcloud";
import { ref } from "vue";
import { nextTick } from "vue";

const store = usePointCloudStore();
const {
  clipPosition: position,
  clipRotation: rotation,
  clipScale: scale,
} = store;

function startInsertion() {
  const volumeTool = store.volumeTool;
  if (!volumeTool || !volumeTool.startInsertion) return;

  // Start insertion and get the created item
  const item = volumeTool.startInsertion({ clip: true });

  // Use nextTick to ensure the DOM has updated
  nextTick(() => {
    try {
      let measurementsRoot = $("#jstree_scene")
        .jstree()
        .get_json("measurements");
      let jsonNode = measurementsRoot.children.find(
        (child) => child.data.uuid === item.uuid
      );
      $.jstree.reference(jsonNode.id).deselect_all();
      $.jstree.reference(jsonNode.id).select_node(jsonNode.id);
    } catch (error) {
      console.error("Error selecting clip volume in jstree:", error);
    }
  });
}
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -12px;
  margin-right: -12px;
}

.col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  text-align: center;
  padding: 0 8px;
}

.q-badge {
  width: 100%;
}
</style>
