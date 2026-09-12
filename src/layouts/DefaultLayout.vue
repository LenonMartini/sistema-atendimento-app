<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUiStore } from '../stores/ui';
import AppTopBar from '../components/layout/AppTopBar.vue';
import AppNavigationDrawer from '../components/layout/AppNavigationDrawer.vue';

const ui = useUiStore();
</script>

<template>
  <AppNavigationDrawer />
  <AppTopBar />

  <v-main>
    <v-container fluid :class="ui.density === 'compact' ? 'pa-3' : 'pa-6'">
      <RouterView />
    </v-container>
  </v-main>
</template>
