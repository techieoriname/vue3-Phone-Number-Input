import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            name: 'Vue3PhoneInput',
            entry: './src/js/index.ts',
            formats: ['es', 'umd'],
            fileName: (format) => {
                let suffix: string = format;

                if (format === 'es') {
                    suffix = 'esm';
                }
                return `js/vue3-phone-input.${suffix}.js`;
            }
        },
        emptyOutDir: false,
        // watch: {
        //     include: 'src/**'
        // },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                exports: 'named',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css')
                        return 'css/vue3-phone-input.css';
                    return assetInfo.name;
                },
            }
        },
        minify: false
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '~/': `${path.resolve(__dirname, 'src')}/`,
            '@': path.resolve(__dirname, '/src')
        }
    }
});
