import { SectionHeading } from '../components/SectionHeading';
import { notes } from '../data/notes';

export function Notes() {
  return (
    <section id="notes" className="section-shell">
      <SectionHeading
        kicker="Study Notes"
        title="공부한 필기노트"
        description="학습 기록은 개발 실력의 성장 과정을 보여주는 좋은 증거입니다. 짧은 요약과 태그 중심으로 정리했습니다."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {notes.map((note) => (
          <article key={note.title} className="card">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
              <span>{note.category}</span>
              <time dateTime={note.date}>{note.date}</time>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">{note.title}</h3>
            <p className="mt-4 leading-7 text-slate-300">{note.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
