<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listCompanies, removeCompany } from '../../services/companies.service';
import type { Company } from '../../types/company.types';
const companies = ref<Company[]>([]); const loading = ref(false); const errorMessage = ref('');
const router = useRouter();
const headers = [{ title: 'Nome', key: 'name' }, { title: 'Nome legal', key: 'legalName' }, { title: 'Documento', key: 'document' }, { title: 'Contatos', key: '_count.contacts' }, { title: 'Setores', key: '_count.departments' }, { title: '', key: 'actions', sortable: false }];
async function load() { loading.value = true; try { companies.value = await listCompanies(); } catch { errorMessage.value = 'Não foi possível carregar as empresas.'; } finally { loading.value = false; } }
async function remove(item: Company) { if (confirm(`Desativar a empresa "${item.name}"?`)) { await removeCompany(item.id); await load(); } }
onMounted(load);
</script>
<template><div><div class="d-flex align-center mb-4"><h1 class="text-h5 font-weight-bold">Empresas</h1><v-spacer /><v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/companies/new')">Nova empresa</v-btn></div><v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">{{ errorMessage }}</v-alert><v-card><v-data-table :headers="headers" :items="companies" :loading="loading" item-value="id"><template #item._count.contacts="{ item }">{{ item._count?.contacts ?? 0 }}</template><template #item._count.departments="{ item }">{{ item._count?.departments ?? 0 }}</template><template #item.actions="{ item }"><v-menu><template #activator="{ props }"><v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" /></template><v-list density="compact"><v-list-item prepend-icon="mdi-pencil-outline" title="Editar" @click="router.push(`/companies/${item.id}/edit` )" /><v-list-item prepend-icon="mdi-eye-outline" title="Visualizar" @click="router.push(`/companies/${item.id}/view` )" /><v-list-item prepend-icon="mdi-delete-outline" title="Desativar" base-color="error" @click="remove(item)" /></v-list></v-menu></template></v-data-table></v-card></div></template>
