import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { projects } from '../data/projects';

export function Projects() {
  return (
    <section id="projects" className="section-shell">
      <SectionHeading
        kicker="Projects"
        title="Selected Projects"
        description="Each project is presented around the problem, solution, technical approach, and practical outcome."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.title} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{project.description}</p>
              <p className="mt-4 rounded-2xl bg-sky-300/10 p-4 text-sm leading-6 text-sky-100">
                {project.impact}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge">{tech}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4 text-sm font-semibold">
              {project.githubUrl && (
                <a className="inline-flex items-center gap-1 text-slate-200 hover:text-white" href={project.githubUrl} target="_blank" rel="noreferrer">
                  Code <ArrowUpRight size={15} />
                </a>
              )}
              {project.liveUrl && (
                <a className="inline-flex items-center gap-1 text-sky-200 hover:text-sky-100" href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
