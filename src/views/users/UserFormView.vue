<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createUser, getUser, updateUser } from '../../services/users.service';
import { listRoles } from '../../services/roles.service';
import type { AssignableRole } from '../../types/role.types';

const route = useRoute();
const router = useRouter();

const userId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!userId.value);
const isReadOnly = computed(() => route.meta.mode === 'view');

const roles = ref<AssignableRole[]>([]);
const roleOptions = computed(() => roles.value.map((role) => ({ title: role.name, value: role.id })));

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const form = ref({ name: '', email: '', password: '', status: 'active', roleIds: [] as string[] });

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    roles.value = await listRoles();
    if (userId.value) {
      const user = await getUser(userId.value);
      form.value = {
        name: user.name,
        email: user.email,
        password: '',
        status: user.status,
        roleIds: user.roles.map((r) => r.id),
      };
    }
  } catch {
    errorMessage.value = 'Não foi possível carregar os dados do usuário.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value && userId.value) {
      const payload: Record<string, unknown> = {
        name: form.value.name,
        email: form.value.email,
        status: form.value.status,
        roleIds: form.value.roleIds,
      };
      if (form.value.password) payload.password = form.value.password;
      await updateUser(userId.value, payload);
    } else {
      await createUser(form.value);
    }
    router.push('/settings/users');
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível salvar o usuário.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push('/settings/users')" />
      <h1 class="text-h5 font-weight-bold">
        {{ isReadOnly ? 'Visualizar usuário' : isEditing ? 'Editar usuário' : 'Novo usuário' }}
      </h1>
    </div>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card :loading="loading" max-width="560">
      <v-card-text>
        <v-text-field v-model="form.name" label="Nome" :readonly="isReadOnly" class="mb-2" />
        <v-text-field v-model="form.email" label="E-mail" :readonly="isReadOnly" class="mb-2" />
        <v-text-field
          v-if="!isReadOnly"
          v-model="form.password"
          label="Senha"
          :hint="isEditing ? 'Deixe em branco para manter a senha atual' : ''"
          persistent-hint
          type="password"
          class="mb-2"
        />
        <v-select
          v-model="form.roleIds"
          :items="roleOptions"
          label="Papéis (grupos de acesso)"
          multiple
          chips
          :readonly="isReadOnly"
          class="mb-2"
        />

        <v-switch
          v-if="isEditing"
          v-model="form.status"
          :readonly="isReadOnly"
          true-value="active"
          false-value="inactive"
          color="success"
          :label="form.status === 'active' ? 'Ativo' : 'Inativo'"
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="router.push('/settings/users')">{{ isReadOnly ? 'Voltar' : 'Cancelar' }}</v-btn>
        <v-btn v-if="!isReadOnly" color="primary" :loading="saving" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
