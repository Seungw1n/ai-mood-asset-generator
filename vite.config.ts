import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // TODO: Replace 'your-repo-name' with your GitHub repository name.
  // For example, if your repository is https://github.com/user/my-app,
  // the base should be '/my-app/'.
  base: '/ai-mood-asset-generator',
})
