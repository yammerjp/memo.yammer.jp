import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
  server: {
    allowedHosts: ['mm2020.meerkat-minor.ts.net'],
  },
})
