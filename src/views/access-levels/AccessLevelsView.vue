<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listRoles, removeRole } from '../../services/roles.service';
import type { AssignableRole } from '../../types/role.types';

const router = useRouter();
const roles = ref<AssignableRole[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Descrição', key: 'description' },
  { title: 'Permissões', key: 'permissions' },
  { title: 'Origem', key: 'origin' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
];

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    roles.value = await listRoles();
  } catch {
    errorMessage.value = 'Não foi possível carregar os grupos de acesso.';
  } finally {
    loading.value = false;
  }
}

async function remove(role: AssignableRole) {
  errorMessage.value = '';
  try {
    await removeRole(role.id);
    await load();
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível excluir este grupo de acesso.';
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h5 font-weight-bold">Níveis de acesso</h1>
      <v-spacer />
      <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/settings/access-levels/new')">Novo grupo de acesso</v-btn>
    </div>

    <p class="text-body-2 text-medium-emphasis mb-4">
      Um grupo de acesso reúne uma ou mais permissões e pode ser atribuído a vários usuários — ex.: um usuário pode
      acumular os grupos "Administrador", "Estoque" e "Compras" ao mesmo tempo. Grupos do sistema (Administrador,
      Super Admin) podem ter suas permissões ampliadas, mas não podem ser renomeados nem excluídos.
    </p>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card>
      <v-data-table :headers="headers" :items="roles" :loading="loading" item-value="id">
        <template #item.description="{ item }">
          {{ item.description || '—' }}
        </template>
        <template #item.permissions="{ item }">
          <v-chip size="small" variant="tonal">{{ item.permissions.length }} permissões</v-chip>
        </template>
        <template #item.origin="{ item }">
          <v-chip v-if="item.isGlobal" color="primary" size="small" variant="tonal">Global</v-chip>
          <v-chip v-else-if="item.isSystem" size="small" variant="tonal">Sistema</v-chip>
          <v-chip v-else size="small" variant="tonal">Personalizado</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
            </template>
            <v-list density="compact">
              <v-list-item
                prepend-icon="mdi-pencil-outline"
                title="Editar"
                @click="router.push(`/settings/access-levels/${item.id}/edit`)"
              />
              <v-list-item
                v-if="!item.isSystem"
                prepend-icon="mdi-delete-outline"
                title="Excluir"
                base-color="error"
                @click="remove(item)"
              />
              <v-list-item v-else prepend-icon="mdi-lock-outline" title="Não pode ser excluído" disabled />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
