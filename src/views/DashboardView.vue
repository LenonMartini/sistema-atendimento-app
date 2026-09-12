<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const stats = [
  { label: 'Tickets em aberto', value: '128', icon: 'mdi-ticket-confirmation-outline', color: 'primary' },
  { label: 'SLA em risco', value: '7', icon: 'mdi-timer-alert-outline', color: 'warning' },
  { label: 'Agentes online', value: '12', icon: 'mdi-account-check-outline', color: 'success' },
  { label: 'Produtos abaixo do mínimo', value: '4', icon: 'mdi-package-variant-closed-remove', color: 'error' },
];
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Olá, {{ auth.user?.name?.split(' ')[0] }} 👋</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Visão geral da operação em {{ auth.user?.tenantName }}.
        </p>
      </div>
    </div>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card variant="flat" border class="pa-4 h-100">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">{{ stat.label }}</p>
              <p class="text-h5 font-weight-bold mb-0">{{ stat.value }}</p>
            </div>
            <v-avatar :color="stat.color" variant="tonal" size="44">
              <v-icon :icon="stat.icon" :color="stat.color" />
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <v-card variant="flat" border class="pa-4" min-height="320">
          <div class="d-flex align-center justify-space-between mb-4">
            <span class="text-subtitle-1 font-weight-medium">Backlog por setor</span>
            <v-chip size="small" variant="tonal">últimos 7 dias</v-chip>
          </div>
          <v-empty-state
            icon="mdi-chart-areaspline"
            title="Widget de análises"
            text="Este espaço receberá os widgets publicados pelo módulo de Análises (seção 15 da documentação)."
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="flat" border class="pa-4" min-height="320">
          <span class="text-subtitle-1 font-weight-medium">Atividade recente</span>
          <v-timeline density="compact" side="end" class="mt-2">
            <v-timeline-item dot-color="primary" size="x-small">
              <span class="text-caption">Ticket #1042 atribuído a Camila</span>
            </v-timeline-item>
            <v-timeline-item dot-color="success" size="x-small">
              <span class="text-caption">NFe 35240... conciliada automaticamente</span>
            </v-timeline-item>
            <v-timeline-item dot-color="warning" size="x-small">
              <span class="text-caption">SLA do ticket #1038 em risco</span>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
