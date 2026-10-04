import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Le socle ne contient pas encore de tests métier.
    passWithNoTests: true,
  },
}))
