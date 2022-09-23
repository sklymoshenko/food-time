import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['android-chrome-192x192.png', 'android-chrome-512x512.png'],
      manifest: {
        name: 'Food Time',
        short_name: 'FoodTime',
        description: 'App to control your food expriration date',
        theme_color: '#000000',
        icons: [
          {
            src: 'android-chrome-192x192',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
