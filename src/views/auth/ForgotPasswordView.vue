<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { forgotPasswordSchema } from '../../schemas/auth.schema';

const sent = ref(false);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
});

const { value: email, errorMessage: emailError } = useField<string>('email');

const onSubmit = handleSubmit(async () => {
  // TODO: chamar POST /v1/auth/forgot-password quando o endpoint existir.
  await new Promise((resolve) => setTimeout(resolve, 400));
  sent.value = true;
});
</script>

<template>
  <v-card-text class="pa-6">
    <h2 class="text-h6 font-weight-bold mb-1">Recuperar senha</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Informe seu e-mail cadastrado. Enviaremos um link para redefinir sua senha.
    </p>

    <v-alert v-if="sent" type="success" variant="tonal" density="comfortable" class="mb-4">
      Se este e-mail estiver cadastrado, você receberá as instruções em instantes.
    </v-alert>

    <form v-else novalidate @submit.prevent="onSubmit">
      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        :error-messages="emailError ? [emailError] : []"
        class="mb-4"
      />
      <v-btn type="submit" color="primary" size="large" block :loading="isSubmitting">
        Enviar link de recuperação
      </v-btn>
    </form>

    <div class="text-center mt-6">
      <RouterLink to="/login" class="text-caption text-decoration-none text-primary">
        Voltar para o login
      </RouterLink>
    </div>
  </v-card-text>
</template>
