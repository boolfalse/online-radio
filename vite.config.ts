
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
    const envVars = loadEnv(mode, process.cwd());

    return defineConfig({
        build: {
            minify: 'esbuild',
            cssMinify: true,
        },
        plugins: [react()],
        server: {
            port: parseInt(envVars.VITE_SERVER_PORT),
            proxy: {
                '/api': {
                    target: `http://localhost:${envVars.VITE_BACKEND_PORT}`,
                    changeOrigin: true,
                    secure: false,
                    // rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
    });
}
