import { defineStore } from 'pinia';

interface UiState {
  drawer: boolean;
  rail: boolean;
  theme: 'dark' | 'light';
  density: 'comfortable' | 'compact';
}

/**
 * Preferências de interface (seção 7 da documentação): tema dark/light
 * salvo por usuário e modo de alta densidade para operação x modo
 * confortável para gestão.
 */
export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    drawer: true,
    rail: false,
    theme: 'dark',
    density: 'comfortable',
  }),

  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    toggleRail() {
      this.rail = !this.rail;
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },
    toggleDensity() {
      this.density = this.density === 'comfortable' ? 'compact' : 'comfortable';
    },
  },

  persist: true,
});
