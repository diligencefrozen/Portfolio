import { Menu } from 'lucide-react';
import { profiles } from '../data/profile';
import { useLocale, type Locale } from '../lib/locale';

const navigation: Record<Locale, { label: string; href: string }[]> = {
  en: [
    { label: 'Home', href: '#home' },
    { label: 'Experience', href: '#career' },
    { label: 'Projects', href: '#projects' },
    { label: 'Notes', href: '#notes' },
    { label: 'Resume', href: '#resume' },
  ],
  ko: [
    { label: '홈', href: '#home' },
    { label: '경험', href: '#career' },
    { label: '프로젝트', href: '#projects' },
    { label: '노트', href: '#notes' },
    { label: '이력서', href: '#resume' },
  ],
};

const ariaText = {
  en: {
    menu: 'Open menu',
    language: 'Switch language',
  },
  ko: {
    menu: '메뉴 열기',
    language: '언어 전환',
  },
};

export function Header() {
  const { locale, setLocale } = useLocale();
  const profile = profiles[locale];
  const nextLocale = locale === 'ko' ? 'en' : 'ko';

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
          {navigation[locale].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-600 transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={ariaText[locale].language}
            onClick={() => setLocale(nextLocale)}
            className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            {locale === 'ko' ? 'EN' : '한국어'}
          </button>

          <button
            type="button"
            aria-label={ariaText[locale].menu}
            className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
