<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useUiStore } from '../../stores/ui';
import { useAuthStore } from '../../stores/auth';

const ui = useUiStore();
const auth = useAuthStore();
const vuetifyTheme = useTheme();

function onToggleTheme() {
  ui.toggleTheme();
  vuetifyTheme.global.name.value = ui.theme;
}

const initials = computed(() => {
  const name = auth.user?.name ?? 'Usuário';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
});
</script>

<template>
  <v-app-bar flat density="comfortable" color="surface" class="border-b">
    <v-app-bar-nav-icon @click="ui.toggleDrawer()" />

    <v-app-bar-title class="text-subtitle-1 font-weight-medium">
      {{ auth.user?.tenantName ?? 'Plataforma de Atendimento' }}
    </v-app-bar-title>

    <v-spacer />

    <v-tooltip text="Alternar densidade" location="bottom">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon variant="text" @click="ui.toggleDensity()">
          <v-icon :icon="ui.density === 'comfortable' ? 'mdi-view-agenda-outline' : 'mdi-view-headline'" />
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip :text="ui.theme === 'dark' ? 'Tema claro' : 'Tema escuro'" location="bottom">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon variant="text" @click="onToggleTheme">
          <v-icon :icon="ui.theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
        </v-btn>
      </template>
    </v-tooltip>

    <v-btn icon variant="text">
      <v-badge color="error" content="3" floating>
        <v-icon icon="mdi-bell-outline" />
      </v-badge>
    </v-btn>

    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" class="ml-1">
          <v-avatar size="32" color="primary" class="mr-2">
            <span class="text-caption font-weight-bold">{{ initials }}</span>
          </v-avatar>
          <span class="d-none d-sm-inline text-body-2">{{ auth.user?.name }}</span>
          <v-icon icon="mdi-chevron-down" size="18" class="ml-1" />
        </v-btn>
      </template>
      <v-list density="compact" min-width="220">
        <v-list-item prepend-icon="mdi-account-outline" title="Meu perfil" to="/profile" />
        <v-list-item prepend-icon="mdi-cog-outline" title="Preferências" to="/settings/users" />
        <v-divider />
        <v-list-item prepend-icon="mdi-logout" title="Sair" @click="auth.logout(); $router.push('/login')" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
