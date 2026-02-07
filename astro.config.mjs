import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server', // REQUIRED for API routes
  adapter: vercel(), 
  integrations: [tailwind()],
});