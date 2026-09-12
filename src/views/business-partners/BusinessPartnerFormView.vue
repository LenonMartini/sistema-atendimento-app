<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute, useRouter } from 'vue-router';
import { createBusinessPartner, getBusinessPartner, updateBusinessPartner } from '../../services/business-partners.service';
import { lookupAddressByCep } from '../../services/address.service';
import PageHeader from '../../components/common/PageHeader.vue';
import type { BusinessPartnerPayload, BusinessPartnerRole } from '../../types/business-partner.types';
import { businessPartnerSchema } from '../../schemas/business-partner.schema';

const route = useRoute(); const router = useRouter(); const id = computed(() => route.params.id as string | undefined); const editing = computed(() => !!id.value); const readonly = computed(() => route.meta.mode === 'view'); const loading = ref(false); const saving = ref(false); const lookingUpCep = ref(false); const error = ref('');
const { setValues, validate } = useForm({ validationSchema: toTypedSchema(businessPartnerSchema) });

const roleOptions: Array<{ title: string; value: BusinessPartnerRole }> = [
  { title: 'Cliente', value: 'customer' },
  { title: 'Fornecedor', value: 'supplier' },
  { title: 'Transportadora', value: 'carrier' },
  { title: 'Parceiro', value: 'partner' },
];

const empty = (): BusinessPartnerPayload => ({
  personType: 'organization', name: '', legalName: '', document: '', stateRegistration: '', municipalRegistration: '', taxRegime: '', cnae: '', email: '', phone: '',
  street: '', number: '', complement: '', neighborhood: '', city: '', cityCode: '', state: '', zipCode: '', countryCode: '1058', countryName: 'Brasil',
  roles: [], customerDetail: {}, supplierDetail: {},
});
const form = ref<BusinessPartnerPayload>(empty());

const isCustomer = computed(() => form.value.roles?.includes('customer'));
const isSupplier = computed(() => form.value.roles?.includes('supplier'));

async function load() {
  if (!id.value) return;
  loading.value = true;
  try {
    const partner = await getBusinessPartner(id.value);
    form.value = {
      ...partner,
      roles: partner.roles.map((r) => r.role),
      customerDetail: partner.customerDetail ? { creditLimit: partner.customerDetail.creditLimit, paymentTermsDays: partner.customerDetail.paymentTermsDays ?? undefined, salesRepUserId: partner.customerDetail.salesRepUserId ?? undefined, notes: partner.customerDetail.notes ?? undefined } : {},
      supplierDetail: partner.supplierDetail ? { paymentTermsDays: partner.supplierDetail.paymentTermsDays ?? undefined, leadTimeDays: partner.supplierDetail.leadTimeDays ?? undefined, defaultWarehouseId: partner.supplierDetail.defaultWarehouseId ?? undefined, notes: partner.supplierDetail.notes ?? undefined } : {},
    } as unknown as BusinessPartnerPayload;
  } catch {
    error.value = 'Não foi possível carregar o parceiro de negócio.';
  } finally {
    loading.value = false;
  }
}
function digits(value: unknown) { return String(value ?? '').replace(/\D/g, ''); }
function maskCep(value: unknown) { const d = digits(value).slice(0, 8); return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d; }
function maskCnpj(value: unknown) { const d = digits(value).slice(0, 14); return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4}\/\d{2})(\d)/, '$1-$2'); }
function maskCpf(value: unknown) { const d = digits(value).slice(0, 11); return d.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2'); }
function maskDocument(value: unknown) { return form.value.personType === 'individual' ? maskCpf(value) : maskCnpj(value); }
function maskPhone(value: unknown) { const d = digits(value).slice(0, 11); return d.length > 10 ? d.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') : d.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3'); }
function maskCepAndLookup(value: unknown) { form.value.zipCode = maskCep(value); if (form.value.zipCode.length === 9) lookupCep(); }
async function lookupCep() { if (readonly.value || !form.value.zipCode) return; lookingUpCep.value = true; error.value = ''; try { const address = await lookupAddressByCep(form.value.zipCode); form.value.street = address.logradouro; form.value.complement = form.value.complement || address.complemento; form.value.neighborhood = address.bairro; form.value.city = address.localidade; form.value.state = address.uf; form.value.cityCode = address.ibge; } catch (err: any) { error.value = err?.message ?? 'Não foi possível consultar o CEP.'; } finally { lookingUpCep.value = false; } }
async function save() {
  setValues(form.value as any);
  const result = await validate();
  if (!result.valid) { error.value = 'Revise os campos destacados antes de salvar.'; return; }
  saving.value = true;
  try {
    const { customerDetail, supplierDetail, roles, ...rest } = form.value;
    const payload = {
      ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v || undefined])),
      roles,
      customerDetail: isCustomer.value ? customerDetail : undefined,
      supplierDetail: isSupplier.value ? supplierDetail : undefined,
    } as unknown as BusinessPartnerPayload;
    if (editing.value) await updateBusinessPartner(id.value!, payload);
    else await createBusinessPartner(payload);
    router.push('/business-partners');
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Não foi possível salvar o parceiro de negócio.';
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>
<template>
  <div>
    <PageHeader :title="readonly ? 'Visualizar parceiro' : editing ? 'Editar parceiro' : 'Novo parceiro'" back-to="/business-partners" />
    <v-alert v-if="error" type="error" density="compact" class="mb-4">{{ error }}</v-alert>
    <v-card :loading="loading">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-select v-model="form.personType" :items="[{ title: 'Pessoa jurídica', value: 'organization' }, { title: 'Pessoa física', value: 'individual' }]" label="Tipo de pessoa" :readonly="readonly" />
            <v-text-field v-model="form.name" label="Nome" :readonly="readonly" />
            <v-text-field v-model="form.legalName" label="Razão social" :readonly="readonly" />
            <v-text-field v-model="form.document" :label="form.personType === 'individual' ? 'CPF' : 'CNPJ'" @update:model-value="form.document = maskDocument($event)" :readonly="readonly" />
            <v-text-field v-model="form.stateRegistration" label="Inscrição estadual" @update:model-value="form.stateRegistration = digits($event)" :readonly="readonly" />
            <v-text-field v-model="form.municipalRegistration" label="Inscrição municipal" @update:model-value="form.municipalRegistration = digits($event)" :readonly="readonly" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="form.taxRegime" :items="[{ title: 'Simples Nacional', value: '1' }, { title: 'Simples Nacional — excesso de sublimite', value: '2' }, { title: 'Regime Normal', value: '3' }]" label="Regime tributário (CRT)" :readonly="readonly" />
            <v-text-field v-model="form.cnae" label="CNAE principal" :readonly="readonly" />
            <v-text-field v-model="form.email" label="E-mail" :readonly="readonly" />
            <v-text-field v-model="form.phone" label="Telefone" @update:model-value="form.phone = maskPhone($event)" :readonly="readonly" />
            <v-select v-model="form.roles" :items="roleOptions" label="Papéis comerciais" multiple chips :readonly="readonly" />
          </v-col>

          <v-col cols="12" v-if="isCustomer">
            <v-divider class="mb-4" />
            <div class="text-subtitle-1 mb-2">Dados de cliente</div>
            <v-row>
              <v-col cols="12" md="3"><v-text-field v-model.number="form.customerDetail!.creditLimit" type="number" label="Limite de crédito" :readonly="readonly" /></v-col>
              <v-col cols="12" md="3"><v-text-field v-model.number="form.customerDetail!.paymentTermsDays" type="number" label="Prazo de pagamento (dias)" :readonly="readonly" /></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="form.customerDetail!.notes" label="Observações" :readonly="readonly" /></v-col>
            </v-row>
          </v-col>

          <v-col cols="12" v-if="isSupplier">
            <v-divider class="mb-4" />
            <div class="text-subtitle-1 mb-2">Dados de fornecedor</div>
            <v-row>
              <v-col cols="12" md="3"><v-text-field v-model.number="form.supplierDetail!.paymentTermsDays" type="number" label="Prazo de pagamento (dias)" :readonly="readonly" /></v-col>
              <v-col cols="12" md="3"><v-text-field v-model.number="form.supplierDetail!.leadTimeDays" type="number" label="Lead time (dias)" :readonly="readonly" /></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="form.supplierDetail!.notes" label="Observações" :readonly="readonly" /></v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-divider class="mb-4" />
            <div class="text-subtitle-1 mb-2">Endereço</div>
            <v-row>
              <v-col cols="12" md="4"><v-text-field v-model="form.zipCode" label="CEP" @update:model-value="maskCepAndLookup($event)" :readonly="readonly" :loading="lookingUpCep" hint="Ao sair do campo, o endereço será consultado automaticamente" persistent-hint @blur="lookupCep" /></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="form.street" label="Logradouro" :readonly="readonly" /></v-col>
              <v-col cols="12" md="2"><v-text-field v-model="form.number" label="Número" :readonly="readonly" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.complement" label="Complemento" :readonly="readonly" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.neighborhood" label="Bairro" :readonly="readonly" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.city" label="Município" :readonly="readonly" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.cityCode" label="Código IBGE do município" :readonly="readonly" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.state" label="UF" :readonly="readonly" maxlength="2" /></v-col>
              <v-col cols="12" md="4"><v-text-field v-model="form.countryCode" label="Código país" :readonly="readonly" /><v-text-field v-model="form.countryName" label="País" :readonly="readonly" /></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" @click="router.push('/business-partners')">{{ readonly ? 'Voltar' : 'Cancelar' }}</v-btn>
        <v-btn v-if="!readonly" color="primary" variant="outlined" :loading="saving" :disabled="!form.name" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
