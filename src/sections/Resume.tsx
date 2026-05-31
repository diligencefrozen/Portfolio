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
              <li key={highlight} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700">
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
              download
            >
              Download PDF <Download size={18} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
            >
              View GitHub
            </a>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Personal details such as phone number and full address are excluded from this public portfolio.
          </p>
        </div>
      </div>
    </section>
  );
}
