import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path is switched at build time so the app can be hosted either at the
// site root (local dev, `/`) or under a sub-path (Azure static website,
// `/permits001/`). Set VITE_BASE=/permits001/ when building for that host.
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173, open: true },
});

