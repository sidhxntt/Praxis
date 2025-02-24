import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    preserveSymlinks: true
  },
  build: {
    chunkSizeWarningLimit: 6000, // Increase the chunk size limit to 6000 KB
  },
})
