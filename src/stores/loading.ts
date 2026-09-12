import { defineStore } from 'pinia';

interface LoadingState {
  /**
   * Contador de operações em andamento (requisições HTTP + navegações de
   * rota). Usa contador em vez de booleano pra suportar chamadas
   * concorrentes: só esconde o spinner quando a ÚLTIMA operação termina.
   */
  activeCount: number;
}

/**
 * Estado global do spinner de carregamento — usado pelo GlobalLoader.vue.
 * Alimentado automaticamente por:
 * - toda requisição feita pelo axios (`plugins/axios.ts`, via interceptors);
 * - toda troca de tela (`router/index.ts`, via beforeEach/afterEach).
 * Também pode ser usado manualmente (`loading.start()` / `loading.stop()`)
 * pra uma operação pontual que não passe por nenhum dos dois casos acima.
 */
export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    activeCount: 0,
  }),

  getters: {
    isLoading: (state) => state.activeCount > 0,
  },

  actions: {
    start() {
      this.activeCount += 1;
    },
    stop() {
      this.activeCount = Math.max(0, this.activeCount - 1);
    },
    /** Reseta o contador — usado em casos extremos (ex.: navegação abortada) pra evitar spinner "preso". */
    reset() {
      this.activeCount = 0;
    },
  },
});
