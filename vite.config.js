import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));

// Multi-page site: every .html file must be listed here so it ends up in the build.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: page('index.html'),
        collections: page('collections.html'),
        product: page('product.html'),
        blog: page('blog.html'),
        article: page('article.html'),
      },
    },
  },
});
