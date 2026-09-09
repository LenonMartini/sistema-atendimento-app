import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import authRouter from './auth-router';
import dashboardRouter from './dashboard-router';
import { authGuard } from './guards/auth.guard';
import { useLoadingStore } from '../stores/loading';

const routes: RouteRecordRaw[] = [
  ...dashboardRouter,
  ...authRouter,
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Liga o spinner global em toda troca de tela — cobre tanto o tempo de
// carregar o chunk da rota (import dinâmico) quanto o authGuard (que pode
// chamar GET /auth/me antes de liberar a navegação). Desligado em
// afterEach/onError, sempre, pra nunca ficar "preso" ligado.
router.beforeEach(() => {
  useLoadingStore().start();
  return true;
});

router.beforeEach(authGuard);

router.afterEach(() => {
  useLoadingStore().stop();
});

router.onError(() => {
  useLoadingStore().stop();
});

export default router;
