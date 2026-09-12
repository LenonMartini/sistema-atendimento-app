import { defineStore } from 'pinia';
import * as menusService from '../services/menus.service';
import type { MenuItem } from '../types/menu.types';

/**
 * Menu lateral vindo do banco (tabela `menus`, ver GET /menus). Já chega
 * filtrado pelas permissões do usuário logado — este store só busca e
 * guarda a árvore; a busca/filtro por texto continua no
 * AppNavigationDrawer.vue.
 */
export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [] as MenuItem[],
    loaded: false,
    loading: false,
  }),

  actions: {
    async fetch() {
      this.loading = true;
      try {
        this.items = await menusService.getMenuTree();
        this.loaded = true;
      } catch {
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.items = [];
      this.loaded = false;
    },
  },
});
