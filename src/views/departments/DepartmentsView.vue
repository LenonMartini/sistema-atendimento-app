<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createTeam, listDepartments, removeDepartment, removeTeam } from '../../services/departments.service';
import { useRouter } from 'vue-router';
import type { Department } from '../../types/department.types';
import PageHeader from '../../components/common/PageHeader.vue';
const router = useRouter(); const departments = ref<Department[]>([]); const loading = ref(false); const teamDialog = ref(false); const errorMessage = ref(''); const selected = ref<Department>();
const teamName = ref('');
async function load() { loading.value = true; try { departments.value = await listDepartments(); } catch { errorMessage.value = 'Não foi possível carregar os setores.'; } finally { loading.value = false; } }
async function addTeam() { if (!selected.value || !teamName.value) return; await createTeam(selected.value.id, teamName.value); teamDialog.value = false; teamName.value = ''; await load(); }
async function deleteDepartment(item: Department) { if (confirm(`Desativar o setor "${item.name}"?`)) { await removeDepartment(item.id); await load(); } }
async function deleteTeam(department: Department, teamId: string) { if (confirm('Excluir esta equipe?')) { await removeTeam(department.id, teamId); await load(); } }
onMounted(load);
</script>
<template><div>
  <PageHeader title="Setores e equipes"><template #actions><v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/settings/departments/new')">Novo setor</v-btn></template></PageHeader>
  <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">{{ errorMessage }}</v-alert>
  <v-card><v-list lines="two"><v-list-item v-for="department in departments" :key="department.id" :title="department.name" :subtitle="`Código: ${department.code}`"><template #append><v-btn icon="mdi-account-group-plus-outline" variant="text" @click="selected = department; teamDialog = true" /><v-btn icon="mdi-delete-outline" variant="text" color="error" @click="deleteDepartment(department)" /></template><template #default><div class="d-flex flex-wrap ga-2 mt-2"><v-chip v-for="team in department.teams" :key="team.id" size="small" closable @click:close="deleteTeam(department, team.id)">{{ team.name }}</v-chip><span v-if="!department.teams.length" class="text-caption text-medium-emphasis">Nenhuma equipe cadastrada</span></div></template></v-list-item><v-list-item v-if="!departments.length && !loading" title="Nenhum setor cadastrado." /></v-list></v-card>
  <v-dialog v-model="teamDialog" max-width="520"><v-card><v-card-title>Nova equipe</v-card-title><v-card-text><v-text-field v-model="teamName" label="Nome da equipe" /></v-card-text><v-card-actions><v-spacer /><v-btn variant="text" @click="teamDialog = false">Cancelar</v-btn><v-btn color="primary" :disabled="!teamName" @click="addTeam">Salvar</v-btn></v-card-actions></v-card></v-dialog>
</div></template>
