<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <v-main class="auth-layout">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center" class="fill-height ma-0">
        <v-col cols="12" sm="9" md="6" lg="4" xl="3">
          <div class="d-flex flex-column align-center mb-8">
            <v-avatar color="primary" size="56" class="mb-4">
              <v-icon icon="mdi-headset" size="30" color="white" />
            </v-avatar>
            <h1 class="text-h5 font-weight-bold text-center">HelpNexo</h1>
            <span class="text-body-2 text-medium-emphasis">Atendimento multicanal para múltiplas empresas</span>
          </div>

          <v-card elevation="8" class="pa-2">
            <RouterView />
          </v-card>

          <p class="text-caption text-center text-medium-emphasis mt-6 mb-0">
            © {{ new Date().getFullYear() }} — Plataforma de Atendimento. Todos os direitos reservados.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}
</style>
