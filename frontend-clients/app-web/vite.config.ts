// frontend-clients/app-web/vite.config.ts

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa' // <-- 1. Importa el plugin

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // 2. Añade el plugin con su configuración
    VitePWA({
      registerType: 'autoUpdate',
      // Opcional: para que se refresque automáticamente cuando hay una nueva versión
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // El manifiesto de tu aplicación
      manifest: {
        name: 'Cuadernos App',
        short_name: 'Cuadernos',
        description: 'La mejor app para gestionar tus notas y cuadernos.',
        theme_color: '#ffffff',
        // Añade aquí los iconos que crearás en el siguiente paso
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Un icono "maskable" es importante para una mejor integración con Android
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})