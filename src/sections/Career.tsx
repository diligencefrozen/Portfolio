import { SectionHeading } from '../components/SectionHeading';
import { careerItemsByLocale } from '../data/career';
import { useLocale } from '../lib/locale';

const careerText = {
  en: {
    kicker: 'Experience',
    title: 'Project-Based Experience',
    description:
      'Although I am an entry-level developer, I focus on building real products that solve practical user-facing problems.',
  },
  ko: {
    kicker: '경험',
    title: '프로젝트 기반 경험',
    description:
      '신입 개발자이지만 실제 사용자 문제를 해결하는 제품을 직접 만들고 개선하는 데 집중하고 있습니다.',
  },
};

export function Career() {
  const { locale } = useLocale();
  const careerItems = careerItemsByLocale[locale];
  const text = careerText[locale];

  return (
    <section id="career" className="section-shell">
      <SectionHeading kicker={text.kicker} title={text.title} description={text.description} />

      <div className="mt-12 space-y-6">
        {careerItems.map((item) => (
          <article key={`${item.company}-${item.period}`} className="card">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-950">{item.role}</h3>
                <p className="mt-1 font-bold text-blue-700">{item.company}</p>
              </div>
              <div className="text-left text-sm font-semibold text-slate-500 md:text-right">
                <p>{item.period}</p>
                <p>{item.location}</p>
              </div>
            </div>
            <p className="mt-5 leading-8 text-slate-700">{item.summary}</p>
            <ul className="mt-5 grid gap-3 text-slate-700 md:grid-cols-3">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-7">
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
