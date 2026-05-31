import { Menu } from 'lucide-react';
import { profile } from '../data/profile';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#career' },
  { label: 'Projects', href: '#projects' },
  { label: 'Notes', href: '#notes' },
  { label: 'Resume', href: '#resume' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#home" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 font-black text-white shadow-sm transition group-hover:scale-105 group-hover:bg-blue-700">
            {profile.name.slice(0, 1)}
          </span>
          <span>
            <span className="block text-sm font-extrabold text-slate-950">{profile.name}</span>
            <span className="block text-xs font-medium text-slate-500">{profile.role}</span>
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-600 transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
        >
          <Menu size={18} />
        </button>
      </nav>
    </header>
  );
}
