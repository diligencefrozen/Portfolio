import { profiles } from '../data/profile';
import { useLocale } from '../lib/locale';

const footerText = {
  en: 'Built with TypeScript, React, Vite, Tailwind CSS.',
  ko: 'TypeScript, React, Vite, Tailwind CSS로 제작했습니다.',
};

export function Footer() {
  const { locale } = useLocale();
  const profile = profiles[locale];

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 px-6 py-10 text-center text-sm font-medium text-slate-500">
      <p>
        © {new Date().getFullYear()} {profile.name}. {footerText[locale]}
      </p>
    </footer>
  );
}
