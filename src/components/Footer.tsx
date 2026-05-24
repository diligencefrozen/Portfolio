import { profile } from '../data/profile';

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-slate-400">
      <p>© {new Date().getFullYear()} {profile.name}. Built with TypeScript, React, Vite, Tailwind CSS.</p>
    </footer>
  );
}
