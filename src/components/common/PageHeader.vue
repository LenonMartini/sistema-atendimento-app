<script setup lang="ts">
defineProps<{ title: string; backTo?: string }>();
</script>
<template>
  <div class="d-flex align-center mb-4">
    <v-btn v-if="backTo" icon="mdi-arrow-left" variant="text" class="mr-2" :to="backTo" />
    <h1 class="text-h6 font-weight-bold">{{ title }}</h1>
  </div>
</template>
