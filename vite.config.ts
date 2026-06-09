import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DEFAULT_API_TARGET = 'http://10.10.7.28:5000'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = (env.VITE_API_BASE_URL || DEFAULT_API_TARGET).replace(/\/$/, '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: 3005,
      open: true,
      allowedHosts: [
        '193.46.198.251',
        "10.10.7.30",
      ],
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '^/[^/?#]+\\.(png|jpe?g|gif|webp|svg|pdf)$': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      port: 5177,
      proxy: {
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
      allowedHosts: [
        '193.46.198.251',
        "10.10.7.30",
        'localhost',
      ],
    },
  }
})
