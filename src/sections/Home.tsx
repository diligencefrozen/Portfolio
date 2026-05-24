import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { profile, skills } from '../data/profile';

export function Home() {
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
            프로젝트 보기 <ArrowUpRight size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-300/60"
          >
            연락하기 <Mail size={18} />
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
          <a className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-slate-200 transition hover:bg-white/[0.08]" href={profile.linkedin} target="_blank" rel="noreferrer">
            <span className="inline-flex items-center gap-3"><Linkedin size={18} /> LinkedIn</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>
    </section>
  );
}
