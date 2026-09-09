import type { RouteRecordRaw } from 'vue-router';

// Rotas protegidas da plataforma, servidas pelo DefaultLayout (menu lateral
// + top bar). Todas exigem sessão autenticada (meta.requiresAuth).
const dashboardRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Dashboard' } },
      { path: 'inbox', name: 'inbox', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Inbox' } },
      { path: 'tickets', name: 'tickets', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Tickets' } },
      { path: 'contacts', name: 'contacts', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Contatos' } },
      { path: 'stock/products', name: 'stock-products', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Produtos' } },
      { path: 'stock/warehouses', name: 'stock-warehouses', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Depósitos' } },
      { path: 'stock/balances', name: 'stock-balances', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Saldo de estoque' } },
      { path: 'stock/entries', name: 'stock-entries', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Entradas de produto' } },
      { path: 'stock/exits', name: 'stock-exits', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Saídas de produto' } },
      { path: 'stock/counts', name: 'stock-counts', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Inventário' } },
      { path: 'analytics', name: 'analytics', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Análises' } },
      {
        path: 'platform/tenants',
        name: 'platform-tenants',
        component: () => import('../views/tenants/TenantsView.vue'),
        meta: { title: 'Tenants', permission: 'tenants.read' },
      },
      {
        path: 'platform/tenants/new',
        name: 'platform-tenants-new',
        component: () => import('../views/tenants/TenantFormView.vue'),
        meta: { title: 'Novo tenant', permission: 'tenants.manage' },
      },
      {
        path: 'platform/tenants/:id/edit',
        name: 'platform-tenants-edit',
        component: () => import('../views/tenants/TenantFormView.vue'),
        meta: { title: 'Editar tenant', permission: 'tenants.manage' },
      },
      {
        path: 'platform/tenants/:id/view',
        name: 'platform-tenants-view',
        component: () => import('../views/tenants/TenantFormView.vue'),
        meta: { title: 'Visualizar tenant', permission: 'tenants.read', mode: 'view' },
      },
      { path: 'integrations/api-clients', name: 'integrations-api-clients', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'API keys' } },
      { path: 'integrations/webhooks', name: 'integrations-webhooks', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Webhooks / n8n' } },
      { path: 'integrations/docs', name: 'integrations-docs', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Documentação da API' } },
      { path: 'settings/departments', name: 'settings-departments', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Setores e equipes' } },
      { path: 'settings/channels', name: 'settings-channels', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Canais' } },
      {
        path: 'settings/users',
        name: 'settings-users',
        component: () => import('../views/users/UsersView.vue'),
        meta: { title: 'Usuários e papéis', permission: 'users.read' },
      },
      {
        path: 'settings/users/new',
        name: 'settings-users-new',
        component: () => import('../views/users/UserFormView.vue'),
        meta: { title: 'Novo usuário', permission: 'users.manage' },
      },
      {
        path: 'settings/users/:id/edit',
        name: 'settings-users-edit',
        component: () => import('../views/users/UserFormView.vue'),
        meta: { title: 'Editar usuário', permission: 'users.manage' },
      },
      {
        path: 'settings/users/:id/view',
        name: 'settings-users-view',
        component: () => import('../views/users/UserFormView.vue'),
        meta: { title: 'Visualizar usuário', permission: 'users.read', mode: 'view' },
      },
      {
        path: 'settings/access-levels',
        name: 'settings-access-levels',
        component: () => import('../views/access-levels/AccessLevelsView.vue'),
        meta: { title: 'Níveis de acesso', permission: 'roles.read' },
      },
      {
        path: 'settings/access-levels/new',
        name: 'settings-access-levels-new',
        component: () => import('../views/access-levels/AccessLevelFormView.vue'),
        meta: { title: 'Novo grupo de acesso', permission: 'roles.manage' },
      },
      {
        path: 'settings/access-levels/:id/edit',
        name: 'settings-access-levels-edit',
        component: () => import('../views/access-levels/AccessLevelFormView.vue'),
        meta: { title: 'Editar grupo de acesso', permission: 'roles.manage' },
      },
      { path: 'settings/sla', name: 'settings-sla', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'SLA' } },
      { path: 'profile', name: 'profile', component: () => import('../views/ComingSoonView.vue'), meta: { title: 'Meu perfil' } },
    ],
  },
];

export default dashboardRouter;
