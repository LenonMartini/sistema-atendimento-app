// Espelha `MenuItemDto` do backend (api/src/modules/menus/dto/menu-item.dto.ts).
// `permission` não vem pro front: a filtragem por permissão já acontece no
// backend (MenusService.getMenuTree), então o item que chega aqui já é
// exatamente o que o usuário logado pode ver.
export interface MenuItem {
  title: string;
  icon?: string;
  to?: string;
  children?: MenuItem[];
}
