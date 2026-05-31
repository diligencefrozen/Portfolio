# Jisung Kang Portfolio

A clean entry-level software developer portfolio built with TypeScript, React, Vite, and Tailwind CSS.

## Project Structure

```txt
src/
  components/        # Shared UI components
  data/              # Profile, project, notes, and resume data
  sections/          # Home, Experience, Projects, Notes, Resume sections
  App.tsx
  main.tsx
  styles.css
public/
  resume.pdf         # Public resume PDF
.github/workflows/
  deploy.yml         # GitHub Pages deployment workflow
```

## Getting Started

```bash
npm install
npm run dev
```

## Main Editable Files

1. `src/data/profile.ts` - name, role, email display, GitHub URL, strengths, and skills
2. `src/data/career.ts` - project-based experience
3. `src/data/projects.ts` - selected projects
4. `src/data/notes.ts` - technical notes
5. `src/data/resume.ts` - resume section highlights
6. `public/resume.pdf` - public resume PDF

## Build Check

```bash
npm run build
npm run lint
npm run preview
```

## GitHub Pages Deployment

1. Create a GitHub repository.
2. Upload or push this project.
3. Go to Settings -> Pages.
4. Set Source to `GitHub Actions`.
5. Push to the `main` branch.

`vite.config.ts` automatically sets the base path from the GitHub repository name. Normal repositories deploy under `/repository-name/`, while `username.github.io` repositories deploy from `/`.
