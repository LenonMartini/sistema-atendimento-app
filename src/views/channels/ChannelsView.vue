<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listChannels, removeChannel } from '../../services/channels.service';
import type { Channel } from '../../types/channel.types';
import PageHeader from '../../components/common/PageHeader.vue';

const channels = ref<Channel[]>([]); const loading = ref(false); const errorMessage = ref('');
const router = useRouter();
const providerLabels: Record<string, string> = { 'evolution-whatsapp': 'WhatsApp (Evolution API)', email: 'E-mail', webchat: 'Webchat', instagram: 'Instagram', automation: 'Automação' };
const headers = [{ title: 'Nome', key: 'name' }, { title: 'Provedor', key: 'provider' }, { title: 'Tipo', key: 'type' }, { title: 'Status', key: 'status' }, { title: 'Contas', key: '_count.accounts' }, { title: '', key: 'actions', sortable: false }];
async function load() { loading.value = true; try { channels.value = await listChannels(); } catch { errorMessage.value = 'Não foi possível carregar os canais.'; } finally { loading.value = false; } }
async function remove(item: Channel) { if (confirm(`Desativar o canal "${item.name}"?`)) { await removeChannel(item.id); await load(); } }
onMounted(load);
</script>
<template>
  <div>
    <PageHeader title="Canais">
      <template #actions>
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-plus" @click="router.push('/settings/channels/new')">Novo canal</v-btn>
      </template>
    </PageHeader>
    <v-alert v-if="errorMessage" type="error" density="compact" class="mb-4">{{ errorMessage }}</v-alert>
    <v-card>
      <v-data-table :headers="headers" :items="channels" :loading="loading" item-value="id">
        <template #item.provider="{ item }">{{ providerLabels[item.provider] ?? item.provider }}</template>
        <template #item.status="{ item }"><v-chip :color="item.status === 'active' ? 'success' : 'default'" size="small" variant="tonal">{{ item.status === 'active' ? 'Ativo' : 'Inativo' }}</v-chip></template>
        <template #item._count.accounts="{ item }">{{ item._count?.accounts ?? 0 }}</template>
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }"><v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" /></template>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Editar" @click="router.push(`/settings/channels/${item.id}/edit`)" />
              <v-list-item prepend-icon="mdi-eye-outline" title="Visualizar" @click="router.push(`/settings/channels/${item.id}/view`)" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Desativar" base-color="error" @click="remove(item)" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
