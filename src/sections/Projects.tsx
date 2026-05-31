import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { projectsByLocale, type Project } from '../data/projects';
import { useLocale } from '../lib/locale';

const projectsText = {
  en: {
    kicker: 'Case Study',
    title: 'Product-Driven Project',
    description:
      'A focused project section that shows product adoption, development activity, and real feedback loops instead of only listing source code.',
    sourceCode: 'Source Code',
    chromeWebStore: 'Chrome Web Store',
    storeSnapshot: 'Store snapshot',
    developmentActivity: 'Development activity',
    techStack: 'Tech stack',
    highlights: 'Implementation highlights',
    feedbackTitle: 'User feedback → release improvements',
    feedbackDescription:
      'These records show how real user reviews were converted into concrete product changes.',
    userSignal: 'User signal',
    developerResponse: 'Developer response',
    result: 'Result',
    snapshot: 'Snapshot',
  },
  ko: {
    kicker: '사례 연구',
    title: '제품 중심 프로젝트',
    description:
      '단순히 소스 코드만 나열하지 않고, 실제 사용자 수·개발 활동·사용자 피드백 반영 기록까지 함께 보여주는 프로젝트 섹션입니다.',
    sourceCode: '소스 코드',
    chromeWebStore: 'Chrome Web Store',
    storeSnapshot: '스토어 스냅샷',
    developmentActivity: '개발 활동',
    techStack: '기술 스택',
    highlights: '구현 포인트',
    feedbackTitle: '사용자 피드백 → 릴리즈 개선',
    feedbackDescription:
      '실제 사용자의 리뷰와 제안을 구체적인 제품 개선으로 연결한 기록입니다.',
    userSignal: '사용자 피드백',
    developerResponse: '개발 대응',
    result: '결과',
    snapshot: '스냅샷',
  },
};

function ProjectMetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function ProjectCard({ project, text }: { project: Project; text: (typeof projectsText)['en'] }) {
  return (
    <article className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/80 to-slate-50 p-7 sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {project.store.category}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                {project.store.subcategory}
              </span>
            </div>

            <h3 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {project.title}
            </h3>
            <p className="mt-3 text-lg font-bold text-blue-700">{project.subtitle}</p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">{project.description}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm lg:w-72">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">
              {text.snapshot}
            </p>
            <p className="mt-3 text-sm font-bold text-slate-950">{project.store.sourceLabel}</p>
            <p className="mt-1 text-sm text-slate-500">{project.store.snapshotDate}</p>
            <p className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold leading-6 text-white">
              {project.impact}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-black">
          {project.githubUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              {text.sourceCode} <ArrowUpRight size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              {text.chromeWebStore} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-8 p-7 sm:p-9">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProjectMetricCard label="Users" value={project.store.users} detail={project.store.subcategory} />
          <ProjectMetricCard label="Rating" value={project.store.rating} detail={project.store.reviews} />
          <ProjectMetricCard label="Commits" value={project.activity.commits} detail={project.activity.latestSignal} />
          <ProjectMetricCard label="Updated" value={project.activity.snapshotDate} detail={project.activity.sourceLabel} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-black text-slate-950">{text.developmentActivity}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{project.activity.note}</p>

            <div className="mt-6">
              <p className="text-sm font-black text-slate-950">{text.techStack}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6">
            <p className="text-sm font-black text-blue-950">{text.highlights}</p>
            <ul className="mt-4 grid gap-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-white p-4 text-sm font-medium leading-7 text-slate-700 shadow-sm">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black text-slate-950">{text.feedbackTitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{text.feedbackDescription}</p>
            </div>
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Product loop
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {project.feedbackLoops.map((loop, index) => (
              <article key={`${project.id}-${loop.version}`} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-black text-slate-950">{loop.title}</h4>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {loop.version}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-500">{loop.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{text.userSignal}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.userSignal}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">{text.developerResponse}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.developerResponse}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">{text.result}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.result}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export function Projects() {
  const { locale } = useLocale();
  const projects = projectsByLocale[locale];
  const text = projectsText[locale];

  return (
    <section id="projects" className="section-shell">
      <SectionHeading kicker={text.kicker} title={text.title} description={text.description} />

      <div className="mt-12 grid gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} text={text} />
        ))}
      </div>
    </section>
  );
}
