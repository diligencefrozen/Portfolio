import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, FileText, Search, Star } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SectionHeading } from '../components/SectionHeading';
import { notes } from '../data/notes';

const CHECKED_NOTES_STORAGE_KEY = 'portfolio:checked-notes';
const ALL_MONTHS = 'All';

function readCheckedNoteIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(CHECKED_NOTES_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function Notes() {
  const months = useMemo(() => [...new Set(notes.map((note) => note.month))], []);
  const [activeMonth, setActiveMonth] = useState(ALL_MONTHS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id ?? '');
  const [checkedNoteIds, setCheckedNoteIds] = useState<string[]>(readCheckedNoteIds);

  useEffect(() => {
    window.localStorage.setItem(CHECKED_NOTES_STORAGE_KEY, JSON.stringify(checkedNoteIds));
  }, [checkedNoteIds]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesMonth = activeMonth === ALL_MONTHS || note.month === activeMonth;
      const searchableText = [
        note.title,
        note.date,
        note.month,
        note.category,
        note.location ?? '',
        note.summary,
        ...note.tags,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesMonth && matchesSearch;
    });
  }, [activeMonth, searchQuery]);

  const groupedNotes = useMemo(
    () =>
      months
        .map((month) => ({
          month,
          notes: filteredNotes.filter((note) => note.month === month),
        }))
        .filter((group) => group.notes.length > 0),
    [filteredNotes, months],
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0];
  const validCheckedCount = checkedNoteIds.filter((id) => notes.some((note) => note.id === id)).length;
  const selectedNoteIsChecked = selectedNote ? checkedNoteIds.includes(selectedNote.id) : false;

  const toggleCheckedNote = (noteId: string) => {
    setCheckedNoteIds((currentIds) =>
      currentIds.includes(noteId)
        ? currentIds.filter((currentId) => currentId !== noteId)
        : [...currentIds, noteId],
    );
  };

  return (
    <section id="notes" className="section-shell">
      <SectionHeading
        kicker="Study Notes"
        title="Date-Based Markdown Notes"
        description="A Notion-style study note board. Notes are grouped by month, selectable by date, rendered from Markdown, and can be checked off locally after review."
      />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveMonth(ALL_MONTHS)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeMonth === ALL_MONTHS
              ? 'bg-sky-400 text-slate-950'
              : 'border border-white/10 text-slate-300 hover:border-sky-300/40 hover:text-white'
          }`}
        >
          All
        </button>

        {months.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setActiveMonth(month)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeMonth === month
                ? 'bg-sky-400 text-slate-950'
                : 'border border-white/10 text-slate-300 hover:border-sky-300/40 hover:text-white'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.45fr]">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-300">
          <Search size={18} className="text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by date, title, category, tag..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </label>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={18} className="text-sky-300" />
            Checked
          </span>
          <strong className="text-white">
            {validCheckedCount} / {notes.length}
          </strong>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3 px-2 pb-4">
            <div>
              <p className="text-sm font-semibold text-white">Board</p>
              <p className="text-xs text-slate-500">Select a date card to read the note.</p>
            </div>
            <p className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-400">
              {filteredNotes.length} notes
            </p>
          </div>

          <div className="grid max-h-[42rem] gap-4 overflow-y-auto pr-1 lg:grid-cols-3">
            {groupedNotes.map((group) => (
              <div key={group.month} className="rounded-2xl bg-slate-950/50 p-3">
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-slate-300">
                      {group.month.split(' ')[0]}
                    </span>
                    <span className="text-xs text-slate-500">{group.notes.length}</span>
                  </div>
                  <CalendarDays size={15} className="text-slate-600" />
                </div>

                <div className="space-y-2">
                  {group.notes.map((note) => {
                    const isSelected = selectedNote?.id === note.id;
                    const isChecked = checkedNoteIds.includes(note.id);

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => setSelectedNoteId(note.id)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          isSelected
                            ? 'border-sky-300/70 bg-sky-300/10'
                            : 'border-white/10 bg-white/[0.04] hover:border-sky-300/40 hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            aria-label={`Mark ${note.title} as checked`}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleCheckedNote(note.id)}
                            className="mt-1 size-4 rounded border-slate-600 accent-sky-400"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <FileText size={15} className="shrink-0 text-slate-500" />
                              <p className={`truncate text-sm font-semibold ${isChecked ? 'text-slate-500 line-through' : 'text-white'}`}>
                                {note.title}
                              </p>
                              {note.important && <Star size={13} className="shrink-0 fill-sky-300 text-sky-300" />}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{note.date}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedNote && (
          <article className="card xl:sticky xl:top-28 xl:max-h-[48rem] xl:overflow-y-auto">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start">
              <div>
                <p className="section-kicker">Selected Note</p>
                <h3 className="mt-3 text-3xl font-black text-white">{selectedNote.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{selectedNote.date}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleCheckedNote(selectedNote.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedNoteIsChecked
                    ? 'bg-sky-400 text-slate-950'
                    : 'border border-white/10 text-slate-300 hover:border-sky-300/40 hover:text-white'
                }`}
              >
                <CheckCircle2 size={17} />
                {selectedNoteIsChecked ? 'Checked' : 'Mark Checked'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge">{selectedNote.category}</span>
              {selectedNote.location && <span className="badge">{selectedNote.location}</span>}
              {selectedNote.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
              {selectedNote.summary}
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <MarkdownRenderer content={selectedNote.content} />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
