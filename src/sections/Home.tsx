import { ArrowUpRight, Github, Mail } from 'lucide-react';
import { coreStrengthsByLocale, profiles, skillsByLocale } from '../data/profile';
import { useLocale } from '../lib/locale';

const homeText = {
  en: {
    kicker: 'Portfolio',
    viewProjects: 'View Project',
    contactMe: 'Contact Me',
    viewGithub: 'View GitHub',
    currently: 'Currently',
    email: 'Email',
    coreStrengths: 'Core Strengths',
  },
  ko: {
    kicker: '포트폴리오',
    viewProjects: '프로젝트 보기',
    contactMe: '연락하기',
    viewGithub: 'GitHub 보기',
    currently: '현재',
    email: '이메일',
    coreStrengths: '핵심 강점',
  },
};

export function Home() {
  const { locale } = useLocale();
  const profile = profiles[locale];
  const skills = skillsByLocale[locale];
  const coreStrengths = coreStrengthsByLocale[locale];
  const text = homeText[locale];
  const contactHref = profile.email ? `mailto:${profile.email}` : profile.github;
  const contactLabel = profile.email ? text.contactMe : text.viewGithub;

  return (
    <section id="home" className="section-shell grid min-h-[calc(100vh-72px)] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="section-kicker">{text.kicker}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          {profile.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span key={skill} className="badge">{skill}</span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {text.viewProjects} <ArrowUpRight size={18} />
          </a>
          <a
            href={contactHref}
            target={profile.email ? undefined : '_blank'}
            rel={profile.email ? undefined : 'noreferrer'}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
          >
            {contactLabel} <Mail size={18} />
          </a>
        </div>
      </div>

      <aside className="card">
        <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-blue-600">{text.currently}</p>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-950">{profile.role}</h2>
        <p className="mt-3 font-medium text-slate-600">{profile.location}</p>

        <div className="mt-8 space-y-3">
          <a
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            <span className="inline-flex items-center gap-3"><Github size={18} /> GitHub</span>
            <ArrowUpRight size={16} />
          </a>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">{text.email}</p>
            <p className="mt-1 text-sm font-semibold">{profile.email || profile.emailDisplay}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm font-extrabold text-slate-950">{text.coreStrengths}</p>
          {coreStrengths.map((strength) => (
            <p key={strength} className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
              {strength}
            </p>
          ))}
        </div>
      </aside>
    </section>
  );
}
