<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '../../stores/loading';

const loading = useLoadingStore();
const { isLoading } = storeToRefs(loading);
</script>

<template>
  <v-overlay
    :model-value="isLoading"
    persistent
    scrim="rgba(0, 0, 0, 0.35)"
    contained
    :z-index="9999"
    class="align-center justify-center"
    style="position: fixed; inset: 0"
  >
    <v-progress-circular indeterminate color="primary" size="56" width="5" />
  </v-overlay>
</template>
