import { Download } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { profile } from '../data/profile';
import { resume } from '../data/resume';

export function Resume() {
  return (
    <section id="resume" className="section-shell">
      <div className="card grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading kicker="Resume" title="이력서" description={resume.intro} />

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
              PDF 다운로드 <Download size={18} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-sky-300/60"
            >
              이메일 보내기
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            public 폴더에 {resume.fileName} 파일을 넣으면 다운로드 버튼이 작동합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
