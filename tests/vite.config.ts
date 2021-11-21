import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

export default defineConfig({
    base: './',
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === ''
                }
            }
        })
    ],
    resolve: {
        alias: [{ find: 'vue', replacement: path.resolve('./node_modules/vue') }]
    }
});
