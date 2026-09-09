export interface NavItem {
  title: string;
  icon: string;
  to?: string;
  children?: NavItem[];
  /** Quando definido, o item só aparece pra quem tem essa permissão (ver auth.hasPermission). */
  permission?: string;
}

// Reflete os módulos da seção 6 da documentação funcional.
export const navItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Inbox', icon: 'mdi-forum-outline', to: '/inbox' },
  { title: 'Tickets', icon: 'mdi-ticket-confirmation-outline', to: '/tickets' },
  {
    title: 'Cadastros gerais',
    icon: 'mdi-folder-account-outline',
    children: [
      { title: 'Contatos', icon: 'mdi-account-multiple-outline', to: '/contacts' },
      { title: 'Setores e equipes', icon: 'mdi-office-building-outline', to: '/settings/departments' },
    ],
  },
  {
    title: 'Estoque',
    icon: 'mdi-package-variant-closed',
    children: [
      { title: 'Produtos', icon: 'mdi-cube-outline', to: '/stock/products' },
      { title: 'Depósitos', icon: 'mdi-warehouse', to: '/stock/warehouses' },
      { title: 'Saldo', icon: 'mdi-clipboard-list-outline', to: '/stock/balances' },
      { title: 'Entradas (NFe/manual)', icon: 'mdi-tray-arrow-down', to: '/stock/entries' },
      { title: 'Saídas (ticket/manual)', icon: 'mdi-tray-arrow-up', to: '/stock/exits' },
      { title: 'Inventário', icon: 'mdi-clipboard-check-outline', to: '/stock/counts' },
    ],
  },
  { title: 'Análises', icon: 'mdi-chart-box-outline', to: '/analytics' },
  {
    title: 'Integrações',
    icon: 'mdi-swap-horizontal-circle-outline',
    children: [
      { title: 'API keys', icon: 'mdi-key-outline', to: '/integrations/api-clients' },
      { title: 'Webhooks / n8n', icon: 'mdi-transit-connection-variant', to: '/integrations/webhooks' },
      { title: 'Documentação (Swagger)', icon: 'mdi-file-document-outline', to: '/integrations/docs' },
    ],
  },
  {
    title: 'Configurações',
    icon: 'mdi-cog-outline',
    children: [
      { title: 'Canais', icon: 'mdi-whatsapp', to: '/settings/channels' },
      { title: 'Usuários', icon: 'mdi-account-key-outline', to: '/settings/users', permission: 'users.read' },
      { title: 'Níveis de acesso', icon: 'mdi-shield-account-outline', to: '/settings/access-levels', permission: 'roles.read' },
      { title: 'Tenants', icon: 'mdi-office-building-cog-outline', to: '/platform/tenants', permission: 'tenants.read' },
      { title: 'SLA', icon: 'mdi-timer-alert-outline', to: '/settings/sla' },
    ],
  },
];
