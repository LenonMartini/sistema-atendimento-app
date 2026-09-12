import type { NavigationGuardWithThis } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

/**
 * Guard global de autenticação, registrado em router/index.ts via
 * `router.beforeEach(authGuard)`. Roda antes de qualquer navegação:
 * - bloqueia rotas com `meta.requiresAuth` sem sessão, redirecionando pro
 *   login (guardando a rota de destino em `redirect`);
 * - com sessão ativa, revalida o usuário (GET /v1/auth/me via
 *   auth.fetchMe()) antes de liberar a rota — se o token não for mais
 *   válido, também redireciona pro login;
 * - evita que um usuário já autenticado acesse a tela de login de novo;
 * - bloqueia rotas com `meta.permission` quando o usuário autenticado não
 *   tem essa permissão (ex.: /platform/tenants exige `tenants.read`).
 */
export const authGuard: NavigationGuardWithThis<undefined> = async (to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAuth && auth.isAuthenticated) {
    await auth.fetchMe();
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  if (!to.meta.requiresAuth && auth.isAuthenticated && to.name === 'login') {
    return { path: '/' };
  }

  const requiredPermission = to.meta.permission as string | undefined;
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    return { path: '/' };
  }

  return true;
};
