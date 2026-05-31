import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { projectsByLocale } from '../data/projects';
import { useLocale } from '../lib/locale';

const projectsText = {
  en: {
    kicker: 'Project',
    title: 'Featured Project',
    description:
      'The portfolio focuses on one representative project: DCinside Gallery Blocker. The goal is to make the main product clear instead of spreading attention across unrelated items.',
    sourceCode: 'Source Code',
    chromeWebStore: 'Chrome Web Store',
  },
  ko: {
    kicker: '프로젝트',
    title: '대표 프로젝트',
    description:
      '포트폴리오의 핵심은 DCinside Gallery Blocker 한 가지 대표 프로젝트에 집중하는 것입니다. 여러 항목을 나열하기보다 실제로 만든 제품과 해결한 문제를 명확하게 보여줍니다.',
    sourceCode: '소스 코드',
    chromeWebStore: 'Chrome Web Store',
  },
};

export function Projects() {
  const { locale } = useLocale();
  const projects = projectsByLocale[locale];
  const text = projectsText[locale];

  return (
    <section id="projects" className="section-shell">
      <SectionHeading kicker={text.kicker} title={text.title} description={text.description} />

      <div className="mt-12 grid gap-6">
        {projects.map((project) => (
          <article key={project.title} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-950">{project.title}</h3>
              <p className="mt-4 max-w-4xl leading-8 text-slate-700">{project.description}</p>
              <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm font-medium leading-7 text-blue-950">
                {project.impact}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
              {project.githubUrl && (
                <a
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.sourceCode} <ArrowUpRight size={15} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.chromeWebStore} <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
