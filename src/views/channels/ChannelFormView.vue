<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute, useRouter } from 'vue-router';
import {
  addChannelAccount,
  createChannel,
  getChannel,
  removeChannelAccount,
  rotateChannelWebhookSecret,
  updateChannel,
} from '../../services/channels.service';
import PageHeader from '../../components/common/PageHeader.vue';
import type { Channel, ChannelAccount, ChannelPayload, ChannelProvider } from '../../types/channel.types';
import { channelSchema } from '../../schemas/channel.schema';

const route = useRoute(); const router = useRouter(); const id = computed(() => route.params.id as string | undefined); const editing = computed(() => !!id.value); const readonly = computed(() => route.meta.mode === 'view'); const loading = ref(false); const saving = ref(false); const error = ref('');
const { setValues, validate } = useForm({ validationSchema: toTypedSchema(channelSchema) });

const providerOptions: Array<{ title: string; value: ChannelProvider }> = [
  { title: 'WhatsApp (Evolution API)', value: 'evolution-whatsapp' },
  { title: 'E-mail', value: 'email' },
  { title: 'Webchat', value: 'webchat' },
  { title: 'Instagram', value: 'instagram' },
  { title: 'Automação', value: 'automation' },
];

const empty = (): ChannelPayload & { configText: string } => ({ name: '', provider: 'evolution-whatsapp', type: '', status: 'active', configText: '' });
const form = ref(empty());
const channel = ref<Channel>();
const newSecret = ref('');
const rotating = ref(false);

const accountId = ref('');
const accountName = ref('');
const addingAccount = ref(false);

async function load() {
  if (!id.value) return;
  loading.value = true;
  try {
    channel.value = await getChannel(id.value);
    form.value = { name: channel.value.name, provider: channel.value.provider, type: channel.value.type, status: channel.value.status, configText: '' };
  } catch {
    error.value = 'Não foi possível carregar o canal.';
  } finally {
    loading.value = false;
  }
}

async function save() {
  setValues({ name: form.value.name, provider: form.value.provider, type: form.value.type } as any);
  const result = await validate();
  if (!result.valid) { error.value = 'Revise os campos destacados antes de salvar.'; return; }
  let config: Record<string, unknown> | undefined;
  if (form.value.configText.trim()) {
    try { config = JSON.parse(form.value.configText); } catch { error.value = 'A configuração precisa ser um JSON válido.'; return; }
  }
  saving.value = true;
  error.value = '';
  try {
    const payload: ChannelPayload = { name: form.value.name, provider: form.value.provider, type: form.value.type, status: form.value.status, config };
    if (editing.value) await updateChannel(id.value!, payload);
    else await createChannel(payload);
    router.push('/settings/channels');
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Não foi possível salvar o canal.';
  } finally {
    saving.value = false;
  }
}

async function rotateSecret() {
  if (!id.value || !confirm('Gerar um novo secret invalida o anterior nas integrações que já o usam. Continuar?')) return;
  rotating.value = true;
  error.value = '';
  try {
    const updated = await rotateChannelWebhookSecret(id.value);
    newSecret.value = updated.webhookSecret ?? '';
    channel.value = updated;
  } catch {
    error.value = 'Não foi possível gerar um novo secret.';
  } finally {
    rotating.value = false;
  }
}

async function addAccount() {
  if (!id.value || !accountId.value) return;
  addingAccount.value = true;
  try {
    await addChannelAccount(id.value, { externalAccountId: accountId.value, displayName: accountName.value || undefined });
    accountId.value = ''; accountName.value = '';
    channel.value = await getChannel(id.value);
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Não foi possível adicionar a conta.';
  } finally {
    addingAccount.value = false;
  }
}

async function removeAccount(account: ChannelAccount) {
  if (!id.value || !confirm(`Remover a conta "${account.displayName ?? account.externalAccountId}"?`)) return;
  await removeChannelAccount(id.value, account.id);
  channel.value = await getChannel(id.value);
}

onMounted(load);
</script>
<template>
  <div>
    <PageHeader :title="readonly ? 'Visualizar canal' : editing ? 'Editar canal' : 'Novo canal'" back-to="/settings/channels" />
    <v-alert v-if="error" type="error" density="compact" class="mb-4">{{ error }}</v-alert>
    <v-alert v-if="newSecret" type="success" variant="tonal" density="compact" class="mb-4" closable @click:close="newSecret = ''">
      Novo webhook secret gerado — copie agora, ele não será mostrado novamente: <strong>{{ newSecret }}</strong>
    </v-alert>

    <v-card :loading="loading">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.name" label="Nome" :readonly="readonly" />
            <v-select v-model="form.provider" :items="providerOptions" label="Provedor" :readonly="readonly" />
            <v-text-field v-model="form.type" label="Tipo" placeholder="Ex.: whatsapp, email, chat" :readonly="readonly" />
            <v-switch v-if="editing" v-model="form.status" :readonly="readonly" true-value="active" false-value="inactive" color="primary" :label="form.status === 'active' ? 'Ativo' : 'Inativo'" hide-details />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="form.configText"
              label="Configuração (JSON)"
              :placeholder="channel?.hasConfig ? 'Configuração já definida — preencha só para substituí-la' : '{\n  \&quot;token\&quot;: \&quot;...\&quot;\n}'"
              rows="6"
              :readonly="readonly"
              :hint="channel?.hasConfig ? 'Já existe uma configuração salva (criptografada). Deixe em branco para mantê-la.' : 'Credenciais e parâmetros específicos do provedor — armazenados criptografados.'"
              persistent-hint
            />
          </v-col>

          <v-col v-if="editing" cols="12">
            <v-divider class="mb-4" />
            <div class="d-flex align-center mb-2">
              <div class="text-subtitle-1">Webhook secret</div>
              <v-chip class="ml-2" size="small" :color="channel?.hasWebhookSecret ? 'success' : 'default'" variant="tonal">{{ channel?.hasWebhookSecret ? 'Configurado' : 'Não configurado' }}</v-chip>
              <v-spacer />
              <v-btn v-if="!readonly" variant="outlined" size="small" :loading="rotating" @click="rotateSecret">Gerar novo secret</v-btn>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">Usado para validar as chamadas de webhook recebidas deste canal.</p>
          </v-col>

          <v-col v-if="editing" cols="12">
            <v-divider class="mb-4" />
            <div class="text-subtitle-1 mb-2">Contas vinculadas</div>
            <v-list v-if="channel?.accounts?.length" density="compact" class="mb-3">
              <v-list-item v-for="account in channel.accounts" :key="account.id" :title="account.displayName || account.externalAccountId" :subtitle="account.externalAccountId">
                <template #append>
                  <v-btn v-if="!readonly" icon="mdi-delete-outline" variant="text" size="small" color="error" @click="removeAccount(account)" />
                </template>
              </v-list-item>
            </v-list>
            <p v-else class="text-body-2 text-medium-emphasis mb-3">Nenhuma conta vinculada.</p>
            <v-row v-if="!readonly" dense>
              <v-col cols="12" md="4"><v-text-field v-model="accountId" label="Identificador externo" density="compact" hide-details /></v-col>
              <v-col cols="12" md="5"><v-text-field v-model="accountName" label="Nome de exibição (opcional)" density="compact" hide-details /></v-col>
              <v-col cols="12" md="3"><v-btn block variant="outlined" :disabled="!accountId" :loading="addingAccount" @click="addAccount">Adicionar conta</v-btn></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="router.push('/settings/channels')">{{ readonly ? 'Voltar' : 'Cancelar' }}</v-btn>
        <v-btn v-if="!readonly" color="primary" variant="outlined" :loading="saving" :disabled="!form.name" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
