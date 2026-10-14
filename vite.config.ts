import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: './',
          name: 'HSC Tracker',
          short_name: 'HSC Tracker',
          description: 'তোমার HSC প্রস্তুতির স্মার্ট সঙ্গী',
          theme_color: '#0f172a',
          background_color: '#f8f9fa',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          categories: ['education', 'productivity'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'স্টাডি টাইমার',
              short_name: 'টাইমার',
              description: 'স্টাডি টাইমার সরাসরি চালু করুন',
              url: './',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'আজকের রুটিন',
              short_name: 'রুটিন',
              description: 'আজকের পড়ার রুটিন দেখুন',
              url: './',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          importScripts: ['/sw-alarm-handler.js'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio per environment guidelines
      hmr: false,
      watch: null,
    },
  };
});
