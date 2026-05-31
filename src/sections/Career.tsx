import { SectionHeading } from '../components/SectionHeading';
import { careerItems } from '../data/career';

export function Career() {
  return (
    <section id="career" className="section-shell">
      <SectionHeading
        kicker="Experience"
        title="Project-Based Experience"
        description="Although I am an entry-level developer, I focus on building real products that solve practical user-facing problems."
      />

      <div className="mt-12 space-y-6">
        {careerItems.map((item) => (
          <article key={`${item.company}-${item.period}`} className="card">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="text-2xl font-bold text-white">{item.role}</h3>
                <p className="mt-1 text-sky-200">{item.company}</p>
              </div>
              <div className="text-left text-sm text-slate-400 md:text-right">
                <p>{item.period}</p>
                <p>{item.location}</p>
              </div>
            </div>
            <p className="mt-5 text-slate-300">{item.summary}</p>
            <ul className="mt-5 grid gap-3 text-slate-300 md:grid-cols-3">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="rounded-2xl bg-white/[0.04] p-4">
                  {achievement}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
