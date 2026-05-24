import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubUserPage = repoName?.endsWith('.github.io');
const base = process.env.NODE_ENV === 'production' && repoName && !isGitHubUserPage ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
