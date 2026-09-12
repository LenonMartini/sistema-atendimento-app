<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listContacts, removeContact } from '../../services/contacts.service';
import { useRouter } from 'vue-router';
import type { Contact } from '../../types/contact.types';
import PageHeader from '../../components/common/PageHeader.vue';

const contacts = ref<Contact[]>([]); const loading = ref(false); const errorMessage = ref('');
const router = useRouter();
const headers = [{ title: 'Nome', key: 'name' }, { title: 'E-mail', key: 'email' }, { title: 'Telefone', key: 'phone' }, { title: '', key: 'actions', sortable: false }];
async function load() { loading.value = true; try { contacts.value = await listContacts(); } catch { errorMessage.value = 'Não foi possível carregar os contatos.'; } finally { loading.value = false; } }
async function remove(item: Contact) { if (!confirm(`Excluir o contato "${item.name}"?`)) return; await removeContact(item.id); await load(); }
onMounted(load);
</script>
<template><div>
  <PageHeader title="Contatos"><template #actions><v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/contacts/new')">Novo contato</v-btn></template></PageHeader>
  <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">{{ errorMessage }}</v-alert>
  <v-card><v-data-table :headers="headers" :items="contacts" :loading="loading" item-value="id"><template #item.actions="{ item }"><v-btn icon="mdi-delete-outline" variant="text" color="error" size="small" @click="remove(item)" /></template></v-data-table></v-card>
</div></template>
