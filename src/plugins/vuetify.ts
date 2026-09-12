import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Paleta alinhada à seção 7 da documentação: tema dark como padrão para a
// operação diária (reduz fadiga em filas extensas) e tema light para
// análises, leitura e ambientes muito iluminados. Ambos compartilham os
// mesmos tokens de espaçamento/contraste mínimo AA.
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    'surface-variant': '#2a2a2e',
    primary: '#6C63FF',
    'primary-darken-1': '#5449e6',
    secondary: '#03DAC6',
    success: '#43A047',
    warning: '#FB8C00',
    error: '#EF5350',
    info: '#29B6F6',
  },
};

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F5F6FA',
    surface: '#FFFFFF',
    'surface-variant': '#ECEFF6',
    primary: '#5449E6',
    'primary-darken-1': '#4038c2',
    secondary: '#00A896',
    success: '#2E7D32',
    warning: '#EF6C00',
    error: '#D32F2F',
    info: '#0288D1',
  },
};

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
      light: lightTheme,
    },
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
});
