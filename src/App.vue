<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalLoader from './components/common/GlobalLoader.vue';
</script>

<template>
  <v-app>
    <RouterView />
    <GlobalLoader />
  </v-app>
</template>
