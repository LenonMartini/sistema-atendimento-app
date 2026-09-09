<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const title = (route.meta.title as string) ?? 'Em construção';
</script>

<template>
  <v-empty-state
    icon="mdi-hammer-wrench"
    :title="title"
    text="Este módulo está descrito na documentação funcional e será implementado nas próximas fases do projeto."
  />
</template>
