import { defineStore } from 'pinia';
import * as authService from '../services/auth.service';
import { useMenuStore } from './menu';
import type { AuthenticatedUser, AuthState } from '../types/auth.types';

/**
 * Autenticação do painel (seção 10 da documentação: RBAC + escopo).
 * Nesta fase inicial o backend de autenticação (JWT/refresh) ainda está
 * em construção — os métodos já estão preparados para chamar
 * /v1/auth/login, /v1/auth/logout e /v1/auth/me assim que os endpoints
 * existirem; enquanto isso, mantenha VITE_AUTH_MOCK=true no .env para
 * navegar pelo layout com um usuário fake.
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    // roles agora vem como grupos (ex.: Administrador, Estoque, Compras),
    // cada um com suas próprias permissions.
    hasRole: (state) => (role: string) => state.user?.roles.some((r) => r.name === role) ?? false,
    hasPermission: (state) => (permission: string) =>
      state.user?.roles.some((r) => r.permissions.includes(permission)) ?? false,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        if (import.meta.env.VITE_AUTH_MOCK === 'true') {
          await this.mockLogin(email);
          return;
        }

        const { accessToken, user } = await authService.login(email, password);
        this.applySession(accessToken, user);
      } catch (err: any) {
        this.error = err?.response?.data?.message ?? 'Não foi possível entrar. Verifique suas credenciais.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async mockLogin(email: string) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.applySession('mock-token', {
        id: 'usr-demo',
        name: 'Usuário Demo',
        email,
        tenantId: 'tenant-demo',
        tenantName: 'Empresa Demo',
        roles: [{ name: 'admin_tenant', permissions: ['contacts.read', 'contacts.manage', 'companies.read', 'companies.manage', 'departments.read', 'departments.manage'] }],
        themePreference: 'dark',
      });
    },

    async fetchMe() {
      if (import.meta.env.VITE_AUTH_MOCK === 'true') return;
      if (!this.accessToken) return;

      try {
        const user = await authService.me();
        this.user = user;
      } catch {
        this.logout();
      }
    },

    applySession(token: string, user: AuthenticatedUser) {
      this.accessToken = token;
      this.user = user;
      localStorage.setItem('pa_access_token', token);
      localStorage.setItem('pa_tenant_id', user.tenantId);
    },

    async logout() {
      if (import.meta.env.VITE_AUTH_MOCK !== 'true' && this.accessToken) {
        try {
          await authService.logout();
        } catch {
          // Mesmo se a chamada falhar (ex.: token já expirado), a sessão
          // local deve ser encerrada de qualquer forma.
        }
      }
      this.accessToken = null;
      this.user = null;
      localStorage.removeItem('pa_access_token');
      localStorage.removeItem('pa_tenant_id');
      useMenuStore().clear();
    },
  },

  persist: {
    pick: ['user', 'accessToken'],
  } as any,
});
