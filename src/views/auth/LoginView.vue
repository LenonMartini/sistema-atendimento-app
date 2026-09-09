<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAuthStore } from '../../stores/auth';
import { loginSchema } from '../../schemas/auth.schema';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const showPassword = ref(false);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { remember: true },
});

const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: password, errorMessage: passwordError } = useField<string>('password');
const { value: remember } = useField<boolean>('remember');

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.login(values.email, values.password);
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } catch {
    
  }
});
</script>

<template>
  <v-card-text class="pa-6">
    <h2 class="text-h6 font-weight-bold mb-1">Entrar na plataforma</h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Acesse com o e-mail e a senha cadastrados.
    </p>

    <v-alert v-if="auth.error" type="error" variant="tonal" density="comfortable" class="mb-4">
      {{ auth.error }}
    </v-alert>

    <form novalidate @submit.prevent="onSubmit">
      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        autocomplete="username"
        prepend-inner-icon="mdi-email-outline"
        :error-messages="emailError ? [emailError] : []"
        class="mb-2"
      />

      <v-text-field
        v-model="password"
        label="Senha"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :error-messages="passwordError ? [passwordError] : []"
        @click:append-inner="showPassword = !showPassword"
      />

      <div class="d-flex align-center justify-space-between mb-4">
        <v-checkbox v-model="remember" label="Lembrar de mim" density="compact" hide-details />
        <RouterLink to="/forgot-password" class="text-caption text-decoration-none text-primary">
          Esqueci minha senha
        </RouterLink>
      </div>

      <v-btn type="submit" color="primary" size="large" block :loading="isSubmitting || auth.loading">
        Entrar
      </v-btn>
    </form>

    <v-divider class="my-6" />

    <p class="text-caption text-medium-emphasis text-center mb-0">
      Integração via API? Consulte a
      <a href="http://localhost:3000/api/docs" target="_blank" class="text-primary text-decoration-none">documentação Swagger</a>.
    </p>
  </v-card-text>
</template>
