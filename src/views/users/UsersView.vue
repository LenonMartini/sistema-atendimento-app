<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listUsers, removeUser } from '../../services/users.service';
import type { ManagedUser } from '../../types/user.types';

const router = useRouter();
const users = ref<ManagedUser[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'E-mail', key: 'email' },
  { title: 'Papéis', key: 'roles' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
];

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    users.value = await listUsers();
  } catch {
    errorMessage.value = 'Não foi possível carregar os usuários.';
  } finally {
    loading.value = false;
  }
}

async function remove(user: ManagedUser) {
  if (!confirm(`Desativar o usuário "${user.name}"? Ele deixa de conseguir fazer login.`)) return;
  errorMessage.value = '';
  try {
    await removeUser(user.id);
    await load();
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível desativar este usuário.';
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h5 font-weight-bold">Usuários e papéis</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/settings/users/new')">Novo usuário</v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card>
      <v-data-table :headers="headers" :items="users" :loading="loading" item-value="id">
        <template #item.roles="{ item }">
          <v-chip v-for="role in item.roles" :key="role.id" size="small" variant="tonal" class="mr-1">
            {{ role.name }}
          </v-chip>
        </template>
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
              <v-list-item prepend-icon="mdi-pencil-outline" title="Editar" @click="router.push(`/settings/users/${item.id}/edit`)" />
              <v-list-item prepend-icon="mdi-eye-outline" title="Visualizar" @click="router.push(`/settings/users/${item.id}/view`)" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Excluir" base-color="error" @click="remove(item)" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
