<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listBusinessPartners, removeBusinessPartner } from '../../services/business-partners.service';
import type { BusinessPartner } from '../../types/business-partner.types';
import PageHeader from '../../components/common/PageHeader.vue';
const partners = ref<BusinessPartner[]>([]); const loading = ref(false); const errorMessage = ref('');
const router = useRouter();
const roleLabels: Record<string, string> = { customer: 'Cliente', supplier: 'Fornecedor', carrier: 'Transportadora', partner: 'Parceiro' };
const headers = [{ title: 'Nome', key: 'name' }, { title: 'Documento', key: 'document' }, { title: 'Papéis', key: 'roles' }, { title: 'Contatos', key: '_count.contacts' }, { title: '', key: 'actions', sortable: false }];
async function load() { loading.value = true; try { partners.value = await listBusinessPartners(); } catch { errorMessage.value = 'Não foi possível carregar os parceiros de negócio.'; } finally { loading.value = false; } }
async function remove(item: BusinessPartner) { if (confirm(`Desativar "${item.name}"?`)) { await removeBusinessPartner(item.id); await load(); } }
onMounted(load);
</script>
<template><div><PageHeader title="Clientes e fornecedores"><template #actions><v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/business-partners/new')">Novo parceiro</v-btn></template></PageHeader><v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">{{ errorMessage }}</v-alert><v-card><v-data-table :headers="headers" :items="partners" :loading="loading" item-value="id"><template #item.roles="{ item }"><v-chip v-for="role in item.roles" :key="role.id" size="small" class="mr-1" variant="outlined">{{ roleLabels[role.role] ?? role.role }}</v-chip></template><template #item._count.contacts="{ item }">{{ item._count?.contacts ?? 0 }}</template><template #item.actions="{ item }"><v-menu><template #activator="{ props }"><v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" /></template><v-list density="compact"><v-list-item prepend-icon="mdi-pencil-outline" title="Editar" @click="router.push(`/business-partners/${item.id}/edit` )" /><v-list-item prepend-icon="mdi-eye-outline" title="Visualizar" @click="router.push(`/business-partners/${item.id}/view` )" /><v-list-item prepend-icon="mdi-delete-outline" title="Desativar" base-color="error" @click="remove(item)" /></v-list></v-menu></template></v-data-table></v-card></div></template>
