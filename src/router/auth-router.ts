import type { RouteRecordRaw } from 'vue-router';

// Rotas públicas de autenticação (login, recuperação de senha), servidas
// pelo AuthLayout.
const authRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      { path: 'login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('../views/auth/ForgotPasswordView.vue') },
    ],
  },
];

export default authRouter;
