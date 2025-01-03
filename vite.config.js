import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const isLib = process.argv.includes('--lib');

  return {
    plugins: [react()],
    build: isLib ? {
      outDir: 'lib',
      lib: {
        entry: './src/export.jsx', // Your entry point
        name: 'MyLibJFrogReact', // Global variable for UMD
        fileName: (format) => `my-lib-jfrog-react.${format}.js`, // Output file names
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      }
    } : {
      rollupOptions: {
        output: {
          format: "iife",
          entryFileNames: "app.js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
      cssCodeSplit: false,
      chunkSizeWarningLimit: 3000,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})
