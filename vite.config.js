import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        departments: resolve(__dirname, 'departments.html'),
        aboutUs: resolve(__dirname, 'about-us.html'),
        ourSurgeons: resolve(__dirname, 'our-surgeons.html'),
        secondOpinion: resolve(__dirname, 'second-opinion.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        consult: resolve(__dirname, 'consult.html'),
      }
    }
  }
});
