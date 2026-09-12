import { api } from '../plugins/axios';
import type { MenuItem } from '../types/menu.types';

export async function getMenuTree(): Promise<MenuItem[]> {
  const { data } = await api.get<MenuItem[]>('/menus');
  return data;
}
