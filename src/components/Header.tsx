import { Menu } from 'lucide-react';
import { profile } from '../data/profile';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Career', href: '#career' },
  { label: 'Projects', href: '#projects' },
  { label: 'Notes', href: '#notes' },
  { label: 'Resume', href: '#resume' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#home" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-sky-400 font-black text-slate-950 transition group-hover:scale-105">
            {profile.name.slice(0, 1)}
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">{profile.name}</span>
            <span className="block text-xs text-slate-400">{profile.role}</span>
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-2xl border border-white/10 text-slate-200 md:hidden"
        >
          <Menu size={18} />
        </button>
      </nav>
    </header>
  );
}
