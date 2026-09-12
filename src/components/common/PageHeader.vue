<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; backTo?: string }>();
</script>
<template>
  <div class="d-flex align-center mb-4">
    <v-btn v-if="backTo" icon="mdi-arrow-left" variant="text" class="mr-2" :to="backTo" />
    <div class="flex-grow-1">
      <h1 class="text-subtitle-1 font-weight-bold">{{ title }}</h1>
      <p v-if="subtitle" class="text-body-2 text-medium-emphasis mb-0">{{ subtitle }}</p>
    </div>
    <slot name="actions" />
  </div>
</template>
