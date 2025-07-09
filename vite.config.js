import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aurea: 'aurea.html',
        bot: 'bot.html'
      }
    }
  }
})