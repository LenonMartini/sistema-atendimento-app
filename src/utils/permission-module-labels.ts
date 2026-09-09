/**
 * Tradução do `module` de uma permission (prefixo técnico do `code`, ex.:
 * "stock.exit.manual" -> module "stock") pro português, só pra exibição —
 * o código em si (`code`, `module`) continua em inglês no banco e nas
 * checagens de `hasPermission(...)` no front/back.
 */
const MODULE_LABELS: Record<string, string> = {
  tickets: 'Tickets',
  conversations: 'Conversas',
  notes: 'Notas internas',
  departments: 'Setores e equipes',
  channels: 'Canais',
  sla: 'SLA',
  automations: 'Automações de atendimento',
  automation: 'Automação (n8n)',
  api_clients: 'Clientes de API',
  webhooks: 'Webhooks',
  integration_logs: 'Logs de integração',
  analyses: 'Análises',
  dashboards: 'Dashboards',
  widgets: 'Widgets',
  audit: 'Auditoria',
  stock: 'Estoque',
  api_docs: 'Documentação da API',
  tenants: 'Tenants (plataforma)',
  users: 'Usuários',
  roles: 'Níveis de acesso',
};

export function translatePermissionModule(module: string): string {
  return MODULE_LABELS[module] ?? module;
}
