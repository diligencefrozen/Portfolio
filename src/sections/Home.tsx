import { ArrowUpRight, Github, Mail } from 'lucide-react';
import { coreStrengths, profile, skills } from '../data/profile';

export function Home() {
  const contactHref = profile.email ? `mailto:${profile.email}` : profile.github;
  const contactLabel = profile.email ? 'Contact Me' : 'View GitHub';

  return (
    <section id="home" className="section-shell grid min-h-[calc(100vh-72px)] items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="section-kicker">Portfolio</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          {profile.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">{profile.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span key={skill} className="badge">{skill}</span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-300"
          >
            View Projects <ArrowUpRight size={18} />
          </a>
          <a
            href={contactHref}
            target={profile.email ? undefined : '_blank'}
            rel={profile.email ? undefined : 'noreferrer'}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-300/60"
          >
            {contactLabel} <Mail size={18} />
          </a>
        </div>
      </div>

      <aside className="card">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Currently</p>
        <h2 className="mt-4 text-3xl font-bold text-white">{profile.role}</h2>
        <p className="mt-3 text-slate-300">{profile.location}</p>

        <div className="mt-8 space-y-3">
          <a className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-slate-200 transition hover:bg-white/[0.08]" href={profile.github} target="_blank" rel="noreferrer">
            <span className="inline-flex items-center gap-3"><Github size={18} /> GitHub</span>
            <ArrowUpRight size={16} />
          </a>
          <div className="rounded-2xl bg-white/[0.04] px-4 py-3 text-slate-300">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Email</p>
            <p className="mt-1 text-sm">{profile.email || profile.emailDisplay}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm font-semibold text-white">Core Strengths</p>
          {coreStrengths.map((strength) => (
            <p key={strength} className="rounded-2xl bg-sky-300/10 p-4 text-sm leading-6 text-sky-100">
              {strength}
            </p>
          ))}
        </div>
      </aside>
    </section>
  );
}
