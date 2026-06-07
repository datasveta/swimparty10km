// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://swimparty10km.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
