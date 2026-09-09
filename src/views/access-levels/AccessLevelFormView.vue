<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createRole, getRole, updateRole } from '../../services/roles.service';
import { listPermissionsGrouped } from '../../services/permissions.service';
import type { PermissionGroup } from '../../types/permission.types';
import { translatePermissionModule } from '../../utils/permission-module-labels';

const route = useRoute();
const router = useRouter();

const roleId = computed(() => route.params.id as string | undefined);
const isEditing = computed(() => !!roleId.value);

const permissionGroups = ref<PermissionGroup[]>([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const isSystemRole = ref(false);
const form = ref({ name: '', description: '', permissionIds: [] as string[] });

function toggleGroup(group: PermissionGroup, checked: boolean) {
  const groupIds = group.permissions.map((p) => p.id);
  if (checked) {
    form.value.permissionIds = Array.from(new Set([...form.value.permissionIds, ...groupIds]));
  } else {
    form.value.permissionIds = form.value.permissionIds.filter((id) => !groupIds.includes(id));
  }
}

function isGroupFullyChecked(group: PermissionGroup) {
  return group.permissions.every((p) => form.value.permissionIds.includes(p.id));
}

function isGroupPartiallyChecked(group: PermissionGroup) {
  const some = group.permissions.some((p) => form.value.permissionIds.includes(p.id));
  return some && !isGroupFullyChecked(group);
}

async function load() {
  loading.value = true;
  errorMessage.value = '';
  try {
    permissionGroups.value = await listPermissionsGrouped();
    if (roleId.value) {
      const role = await getRole(roleId.value);
      isSystemRole.value = role.isSystem;
      form.value = { name: role.name, description: role.description ?? '', permissionIds: role.permissionIds };
    }
  } catch {
    errorMessage.value = 'Não foi possível carregar os dados do grupo de acesso.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  errorMessage.value = '';
  try {
    const payload = { name: form.value.name, description: form.value.description || undefined, permissionIds: form.value.permissionIds };
    if (isEditing.value && roleId.value) {
      await updateRole(roleId.value, payload);
    } else {
      await createRole(payload);
    }
    router.push('/settings/access-levels');
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message ?? 'Não foi possível salvar o grupo de acesso.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" class="mr-2" @click="router.push('/settings/access-levels')" />
      <h1 class="text-h5 font-weight-bold">{{ isEditing ? 'Editar grupo de acesso' : 'Novo grupo de acesso' }}</h1>
    </div>

    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="isSystemRole" type="info" variant="tonal" density="compact" class="mb-4">
      Este é um grupo do sistema — você pode alterar o nome, a descrição e incluir/remover permissões livremente. Só não é
      possível excluí-lo.
    </v-alert>

    <v-card :loading="loading">
      <v-card-text>
        <v-text-field v-model="form.name" label="Nome do grupo" placeholder="Ex.: Estoque" class="mb-2" />
        <v-textarea v-model="form.description" label="Descrição (opcional)" rows="2" auto-grow class="mb-4" />

        <p class="text-subtitle-1 font-weight-medium mb-2">Permissões</p>
        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel v-for="group in permissionGroups" :key="group.module">
            <v-expansion-panel-title>
              <v-checkbox-btn
                :model-value="isGroupFullyChecked(group)"
                :indeterminate="isGroupPartiallyChecked(group)"
                class="mr-2"
                @click.stop="toggleGroup(group, !isGroupFullyChecked(group))"
              />
              {{ translatePermissionModule(group.module) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-checkbox
                v-for="permission in group.permissions"
                :key="permission.id"
                v-model="form.permissionIds"
                :value="permission.id"
                :label="permission.description"
                density="compact"
                hide-details
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="router.push('/settings/access-levels')">Cancelar</v-btn>
        <v-btn color="primary" :loading="saving" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
