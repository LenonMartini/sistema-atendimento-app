<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createTenant, getTenant, updateTenant } from '../../services/tenants.service';

const route = useRoute();
const router = useRouter();

const tenantId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!tenantId.value);
const isReadOnly = computed(() => route.meta.mode === 'view');

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const form = ref({ name: '', slug: '', timezone: 'America/Sao_Paulo', status: 'active' });

async function load() {
  if (!tenantId.value) return;
  loading.value = true;
  try {
    const tenant = await getTenant(tenantId.value);
    form.value = { name: tenant.name, slug: tenant.slug, timezone: tenant.timezone, status: tenant.status };
  } catch {
    errorMessage.value = 'Não foi possível carregar o tenant.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  errorMessage.value = '';
  try {
    if (isEditing.value && tenantId.value) {
      await updateTenant(tenantId.value, { name: form.value.name, timezone: form.value.timezone, status: form.value.status });
    } else {
      await createTenant(form.value);
    }
    router.push('/platform/tenants');
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível salvar o tenant.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push('/platform/tenants')" />
      <h5 class="text-h6 font-weight-bold">
        {{ isReadOnly ? 'Visualizar tenant' : isEditing ? 'Editar tenant' : 'Novo tenant' }}
      </h5>
    </div>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-card :loading="loading">
      <v-card-text>
        <v-text-field v-model="form.name" label="Nome" :readonly="isReadOnly" class="mb-2" />
        <v-text-field v-model="form.slug" label="Slug" :disabled="isEditing" :readonly="isReadOnly" class="mb-2" />
        <v-text-field v-model="form.timezone" label="Fuso horário" :readonly="isReadOnly" class="mb-2" />

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
        <v-btn variant="text" @click="router.push('/platform/tenants')">{{ isReadOnly ? 'Voltar' : 'Cancelar' }}</v-btn>
        <v-btn v-if="!isReadOnly" color="primary" :loading="saving" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
