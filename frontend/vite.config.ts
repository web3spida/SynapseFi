import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin as EsbuildPlugin } from 'esbuild'
import fs from 'fs'

// Esbuild plugin to strip unsupported JSON import attributes from a specific dependency
const jsonImportFixPlugin: EsbuildPlugin = {
  name: 'json-import-with-fix',
  setup(build) {
    build.onLoad({ filter: /node_modules\/@base-org\/account\/dist\/core\/constants\.js$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, 'utf8')
      const fixed = contents.replace(/ with\s*\{\s*type:\s*['"]json['"]\s*\}/g, '')
      return { contents: fixed, loader: 'js' }
    })
  }
}

// Vite transform plugin to ensure build stage also strips unsupported import attributes
const fixImportAttrRollup = {
  name: 'fix-import-attributes-rollup',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (id.includes('node_modules/@base-org/account/dist/core/constants.js')) {
      return {
        code: code.replace(/ with\s*\{\s*type:\s*['"]json['"]\s*\}/g, ''),
        map: null,
      }
    }
    return null
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [fixImportAttrRollup, react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [jsonImportFixPlugin],
    },
    exclude: ['@base-org/account'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['framer-motion', 'lucide-react'],
          'web3': ['wagmi', 'viem', '@rainbow-me/rainbowkit']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})