import { profile } from '../data/profile';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 px-6 py-10 text-center text-sm font-medium text-slate-500">
      <p>© {new Date().getFullYear()} {profile.name}. Built with TypeScript, React, Vite, Tailwind CSS.</p>
    </footer>
  );
}
