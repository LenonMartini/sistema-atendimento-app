<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listTenants, removeTenant } from '../../services/tenants.service';
import type { Tenant } from '../../types/tenant.types';
import PageHeader from '../../components/common/PageHeader.vue';

const router = useRouter();
const tenants = ref<Tenant[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Slug', key: 'slug' },
  { title: 'Status', key: 'status' },
  { title: 'Fuso horário', key: 'timezone' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
];

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    tenants.value = await listTenants();
  } catch {
    errorMessage.value = 'Não foi possível carregar os tenants.';
  } finally {
    loading.value = false;
  }
}

async function remove(tenant: Tenant) {
  if (!confirm(`Desativar o tenant "${tenant.name}"? Ele deixa de conseguir acessar a plataforma.`)) return;
  errorMessage.value = '';
  try {
    await removeTenant(tenant.id);
    await load();
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível desativar este tenant.';
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader title="Tenants">
      <template #actions>
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/platform/tenants/new')">Novo tenant</v-btn>
      </template>
    </PageHeader>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card>
      <v-data-table :headers="headers" :items="tenants" :loading="loading" item-value="id">
        <template #item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'success' : 'default'" size="small" variant="tonal">
            {{ item.status === 'active' ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
            </template>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Editar" @click="router.push(`/platform/tenants/${item.id}/edit`)" />
              <v-list-item prepend-icon="mdi-eye-outline" title="Visualizar" @click="router.push(`/platform/tenants/${item.id}/view`)" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Excluir" base-color="error" @click="remove(item)" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
