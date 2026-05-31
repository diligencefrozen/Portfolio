import { Download } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { profile } from '../data/profile';
import { resume } from '../data/resume';

export function Resume() {
  return (
    <section id="resume" className="section-shell">
      <div className="card grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading kicker="Resume" title="Resume" description={resume.intro} />

        <div>
          <ul className="space-y-3">
            {resume.highlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl bg-white/[0.04] p-4 text-slate-300">
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5"
              download
            >
              Download PDF <Download size={18} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-sky-300/60"
            >
              View GitHub
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Personal details such as phone number and full address are excluded from this public portfolio.
          </p>
        </div>
      </div>
    </section>
  );
}
