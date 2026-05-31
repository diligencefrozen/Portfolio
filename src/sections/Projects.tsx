import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { projects } from '../data/projects';

export function Projects() {
  return (
    <section id="projects" className="section-shell">
      <SectionHeading
        kicker="Project"
        title="Featured Project"
        description="The portfolio now focuses on one representative project: DCinside Gallery Blocker. The goal is to make the main product clear instead of spreading attention across unrelated items."
      />

      <div className="mt-12 grid gap-6">
        {projects.map((project) => (
          <article key={project.title} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white">{project.title}</h3>
              <p className="mt-4 max-w-4xl leading-8 text-slate-300">{project.description}</p>
              <p className="mt-5 rounded-2xl bg-sky-300/10 p-5 text-sm leading-7 text-sky-100">
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

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              {project.githubUrl && (
                <a
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-white/30 hover:text-white"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Code <ArrowUpRight size={15} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  className="inline-flex items-center gap-1 rounded-full bg-sky-400 px-4 py-2 text-slate-950 transition hover:bg-sky-300"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chrome Web Store <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
