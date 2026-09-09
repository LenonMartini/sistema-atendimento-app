<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useUiStore } from '../../stores/ui';
import { useAuthStore } from '../../stores/auth';
import { useMenuStore } from '../../stores/menu';
import type { MenuItem } from '../../types/menu.types';

const ui = useUiStore();
const auth = useAuthStore();
const menu = useMenuStore();
const search = ref('');

// Estado de "aberto/fechado" mantido manualmente pelo usuário (clique no
// grupo) — só é usado quando não há busca ativa. Enquanto a busca está
// ativa, os grupos com resultado abrem sozinhos (ver `openGroups` abaixo).
const manualOpenGroups = ref<string[]>([]);

// A árvore que vem de GET /menus já chega filtrada pelas permissões do
// usuário logado (ver MenusService.getMenuTree no backend) — aqui só resta
// buscar ela e mantê-la atualizada quando o usuário loga/desloga.
onMounted(() => {
  if (auth.isAuthenticated && !menu.loaded) menu.fetch();
});

watch(
  () => auth.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) menu.fetch();
    else menu.clear();
  },
);

function matchesSearch(title: string, query: string): boolean {
  return title.toLowerCase().includes(query);
}

// Com busca ativa: um item sem filhos aparece se o título bater; um grupo
// aparece se o título dele bater (mostra todos os filhos) ou se pelo menos
// um filho bater (mostra só os filhos que baterem).
const visibleNavItems = computed<MenuItem[]>(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return menu.items;

  const result: MenuItem[] = [];
  for (const item of menu.items) {
    if (!item.children) {
      if (matchesSearch(item.title, query)) result.push(item);
      continue;
    }

    const groupMatches = matchesSearch(item.title, query);
    const matchingChildren = groupMatches ? item.children : item.children.filter((child) => matchesSearch(child.title, query));
    if (groupMatches || matchingChildren.length > 0) {
      result.push({ ...item, children: matchingChildren });
    }
  }
  return result;
});

// Grupos que devem estar abertos: durante a busca, todos os que sobraram no
// resultado (senão o usuário veria só o título do grupo, sem o item que
// procurou); fora da busca, só os que o usuário abriu manualmente.
const openGroups = computed<string[]>({
  get: () => (search.value.trim() ? visibleNavItems.value.filter((item) => item.children).map((item) => item.title) : manualOpenGroups.value),
  set: (value) => {
    if (!search.value.trim()) manualOpenGroups.value = value;
  },
});
</script>

<template>
  <v-navigation-drawer v-model="ui.drawer" :rail="ui.rail" permanent color="surface" class="border-e">
    <div class="d-flex align-center pa-3" style="height: 64px">
      <v-avatar color="primary" size="32" class="mr-2">
        <v-icon icon="mdi-headset" size="18" color="white" />
      </v-avatar>
      <span v-if="!ui.rail" class="text-subtitle-1 font-weight-bold">Atendimento</span>
      <v-spacer />
      <v-btn v-if="!ui.rail" icon="mdi-chevron-left" variant="text" size="small" @click="ui.toggleRail()" />
    </div>

    <div v-if="!ui.rail" class="px-3 pb-2">
      <v-text-field
        v-model="search"
        placeholder="Buscar no menu"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="solo-filled"
        flat
        hide-details
        clearable
        single-line
      />
    </div>

    <v-divider />

    <v-list v-model:opened="openGroups" density="comfortable" nav>
      <template v-for="item in visibleNavItems" :key="item.title">
        <v-list-group v-if="item.children" :value="item.title">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
          </template>
          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.to"
            :prepend-icon="child.icon"
            :title="child.title"
            class="pl-8"
          />
        </v-list-group>

        <v-list-item v-else :to="item.to" :prepend-icon="item.icon" :title="item.title" />
      </template>

      <v-list-item v-if="search.trim() && visibleNavItems.length === 0" disabled title="Nenhum item encontrado" />
    </v-list>

    <template #append>
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-file-document-outline" title="Documentação da API" href="http://localhost:3000/api/docs" target="_blank" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
