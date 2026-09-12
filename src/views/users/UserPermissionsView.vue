<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listRoles } from '../../services/roles.service';
import { getUser, updateUser } from '../../services/users.service';
import type { AssignableRole } from '../../types/role.types';
import type { ManagedUser } from '../../types/user.types';
import PageHeader from '../../components/common/PageHeader.vue';

const route = useRoute();
const router = useRouter();
const userId = computed(() => route.params.id as string);

const user = ref<ManagedUser>();
const roles = ref<AssignableRole[]>([]);
const roleIds = ref<string[]>([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');

const sortedRoles = computed(() => [...roles.value].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')));

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const [loadedUser, loadedRoles] = await Promise.all([getUser(userId.value), listRoles()]);
    user.value = loadedUser;
    roles.value = loadedRoles;
    roleIds.value = loadedUser.roles.map((role) => role.id);
  } catch {
    errorMessage.value = 'Não foi possível carregar as permissões do usuário.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  errorMessage.value = '';
  try {
    await updateUser(userId.value, { roleIds: roleIds.value });
    router.push('/settings/users');
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível salvar as permissões.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader title="Permissões do usuário" :subtitle="user ? `${user.name} · ${user.email}` : undefined" back-to="/settings/users" />

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card :loading="loading">
      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Selecione os grupos de acesso que definem as permissões deste usuário.
        </p>
        <v-list border rounded lines="two" class="py-0">
          <v-list-item v-for="role in sortedRoles" :key="role.id">
            <template #prepend>
              <v-checkbox-btn v-model="roleIds" :value="role.id" color="primary" />
            </template>
            <v-list-item-title>{{ role.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ role.description || 'Sem descrição' }} · {{ role.permissions.length }} permissões
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-if="!loading && sortedRoles.length === 0" class="text-body-2 text-medium-emphasis mt-3">
          Nenhum grupo de acesso disponível.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="router.push('/settings/users')">Cancelar</v-btn>
        <v-btn color="primary" variant="outlined" :loading="saving" @click="save">Salvar permissões</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
