<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTenant } from '../../services/tenants.service';
import type { Tenant } from '../../types/tenant.types';

const route = useRoute();
const router = useRouter();
const tenantId = computed(() => route.params.id as string);

const tenant = ref<Tenant>();
const loading = ref(false);
const errorMessage = ref('');

const createdAt = computed(() => {
  if (!tenant.value?.createdAt) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(tenant.value.createdAt));
});

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    tenant.value = await getTenant(tenantId.value);
  } catch {
    errorMessage.value = 'Não foi possível carregar os detalhes do tenant.';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push('/platform/tenants')" />
      <div>
        <h1 class="text-h5 font-weight-bold">Detalhes do tenant</h1>
        <p v-if="tenant" class="text-body-2 text-medium-emphasis mb-0">{{ tenant.name }}</p>
      </div>
      <v-spacer />
      <v-btn
        v-if="tenant"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-pencil-outline"
        @click="router.push(`/platform/tenants/${tenant.id}/edit`)"
      >
        Editar
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card :loading="loading">
      <v-card-text v-if="tenant">
        <v-list lines="two" class="py-0">
          <v-list-item prepend-icon="mdi-domain" title="Nome" :subtitle="tenant.name" />
          <v-list-item prepend-icon="mdi-pound" title="Slug" :subtitle="tenant.slug" />
          <v-list-item prepend-icon="mdi-check-circle-outline" title="Status">
            <template #subtitle>
              <v-chip :color="tenant.status === 'active' ? 'success' : 'default'" size="small" variant="tonal">
                {{ tenant.status === 'active' ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-clock-outline" title="Fuso horário" :subtitle="tenant.timezone" />
          <v-list-item prepend-icon="mdi-calendar-outline" title="Criado em" :subtitle="createdAt" />
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
