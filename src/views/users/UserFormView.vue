<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { userSchema } from '../../schemas/forms.schema';
import PageHeader from '../../components/common/PageHeader.vue';
import { useRoute, useRouter } from 'vue-router';
import { createUser, getUser, updateUser } from '../../services/users.service';
import type { ManagedUser } from '../../types/user.types';

const { setValues, validate } = useForm({ validationSchema: toTypedSchema(userSchema) });
const route = useRoute();
const router = useRouter();

const userId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!userId.value);
const isReadOnly = computed(() => route.meta.mode === 'view');

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const form = ref({ name: '', email: '', password: '', status: 'active' });
const userDetails = ref<ManagedUser | null>(null);

const userInitials = computed(() =>
  userDetails.value?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() ?? '',
);

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Nunca acessou';
}

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    if (userId.value) {
      const user = await getUser(userId.value);
      userDetails.value = user;
      form.value = {
        name: user.name,
        email: user.email,
        password: '',
        status: user.status,
      };
    }
  } catch {
    errorMessage.value = 'Não foi possível carregar os dados do usuário.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  setValues(form.value as any);
  const result = await validate();
  if (!result.valid) { errorMessage.value = 'Revise os campos destacados antes de salvar.'; return; }
  saving.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value && userId.value) {
      const payload: Record<string, unknown> = {
        name: form.value.name,
        email: form.value.email,
        status: form.value.status,
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
    <PageHeader :title="isReadOnly ? 'Visualizar usuário' : isEditing ? 'Editar usuário' : 'Novo usuário'" back-to="/settings/users" />

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card :loading="loading">
      <v-card-text>
        <template v-if="isReadOnly && userDetails">
          <div class="d-flex align-center pb-5 mb-5 border-b">
            <v-avatar color="primary" size="64" class="mr-4">
              <span class="text-h6">{{ userInitials }}</span>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-medium">{{ userDetails.name }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ userDetails.email }}</div>
            </div>
            <v-spacer />
            <v-chip :color="userDetails.status === 'active' ? 'success' : 'default'" size="small" variant="tonal">
              {{ userDetails.status === 'active' ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </div>

          <div class="text-subtitle-1 font-weight-medium mb-3">Informações da conta</div>
          <v-row class="mb-2">
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis">Último acesso</div>
              <div class="text-body-1">{{ formatDate(userDetails.lastLoginAt) }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis">Identificador</div>
              <div class="text-body-2 text-medium-emphasis text-truncate" :title="userDetails.id">{{ userDetails.id }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-2" />
          <div class="text-subtitle-1 font-weight-medium mt-5 mb-3">Grupos de acesso</div>
          <div v-if="userDetails.roles.length" class="d-flex flex-wrap ga-2">
            <v-chip v-for="role in userDetails.roles" :key="role.id" prepend-icon="mdi-shield-account-outline" variant="tonal">
              {{ role.name }}
            </v-chip>
          </div>
          <div v-else class="text-body-2 text-medium-emphasis">Nenhum grupo de acesso atribuído.</div>
        </template>

        <template v-else>
          <v-text-field v-model="form.name" label="Nome" class="mb-2" />
          <v-text-field v-model="form.email" label="E-mail" class="mb-2" />
          <v-text-field
            v-model="form.password"
            label="Senha"
            :hint="isEditing ? 'Deixe em branco para manter a senha atual' : ''"
            persistent-hint
            type="password"
            class="mb-2"
          />
          <v-switch
            v-if="isEditing"
            v-model="form.status"
            true-value="active"
            false-value="inactive"
            color="primary"
            :label="form.status === 'active' ? 'Ativo' : 'Inativo'"
            hide-details
          />
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="router.push('/settings/users')">{{ isReadOnly ? 'Voltar' : 'Cancelar' }}</v-btn>
        <v-btn v-if="!isReadOnly" color="primary" variant="outlined" :loading="saving" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
