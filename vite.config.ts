
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config';

export default defineConfig({
    build: {
        minify: process.env.APP_ENV === 'production' ? 'esbuild' : false,
        cssMinify: process.env.APP_ENV === 'production',
    },
    plugins: [react()],
    server: {
        port: parseInt(process.env.VITE_SERVER_PORT),
        proxy: {
            '/api': {
                target: `http://localhost:${process.env.VITE_BACKEND_PORT}`,
                changeOrigin: true,
                secure: process.env.APP_ENV === 'production',
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
});
