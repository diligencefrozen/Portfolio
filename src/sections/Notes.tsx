import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, FileText, Search, Star } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SectionHeading } from '../components/SectionHeading';
import { notes as importedNotes } from '../data/notes';

const CHECKED_NOTES_STORAGE_KEY = 'portfolio:checked-notes';
const ALL_MONTHS = 'All';

type RawImportedNote = {
  id?: string;
  title?: string;
  date?: string;
  month?: string;
  category?: string;
  location?: string;
  summary?: string;
  tags?: string[];
  content?: string;
  important?: boolean;
  url?: string;
};

type NormalizedNote = {
  id: string;
  title: string;
  date: string;
  month: string;
  category: string;
  location?: string;
  summary: string;
  tags: string[];
  content: string;
  important: boolean;
};

function formatMonthFromDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unsorted';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function createNoteId(note: RawImportedNote, index: number) {
  const source = `${note.date ?? 'note'}-${note.title ?? index}`;

  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createDefaultMarkdown(note: RawImportedNote, title: string) {
  return `# ${title}

## Study Checklist

- Review the main concept from this date.
- Move the original Notion note into this Markdown field.
- Add source code, command snippets, screenshots, and troubleshooting notes if needed.

## Key Takeaways

> This page is ready for Markdown migration. Replace this template with the original class note.

### Markdown examples

- **Bold text** for important ideas
- \`inline code\` for short commands or identifiers
- Code fences for Java, SQL, JavaScript, or shell commands

\`\`\`java
// Paste the original code example here.
public class Example {
  public static void main(String[] args) {
    System.out.println("${title}");
  }
}
\`\`\`

${note.url ? `[Original note link](${note.url})` : ''}`;
}

function normalizeNotes(notes: readonly RawImportedNote[]): NormalizedNote[] {
  return notes.map((note, index) => {
    const title = note.title ?? `Study Note ${index + 1}`;
    const date = note.date ?? 'Undated';
    const month = note.month ?? formatMonthFromDate(date);
    const category = note.category ?? 'Study Note';
    const summary =
      note.summary ?? `${title} study note. Markdown content can be migrated from the original Notion page.`;
    const tags = note.tags && note.tags.length > 0 ? note.tags : [category, month.replace(' 2026', '')];

    return {
      id: note.id ?? createNoteId(note, index),
      title,
      date,
      month,
      category,
      location: note.location,
      summary,
      tags,
      content: note.content ?? createDefaultMarkdown(note, title),
      important: note.important ?? false,
    };
  });
}

const notes = normalizeNotes(importedNotes as readonly RawImportedNote[]);

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
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            activeMonth === ALL_MONTHS
              ? 'bg-slate-950 text-white shadow-sm'
              : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
          }`}
        >
          All
        </button>

        {months.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setActiveMonth(month)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeMonth === month
                ? 'bg-slate-950 text-white shadow-sm'
                : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.45fr]">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by date, title, category, tag..."
            className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-600" />
            Checked
          </span>
          <strong className="text-slate-950">
            {validCheckedCount} / {notes.length}
          </strong>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3 px-2 pb-4">
            <div>
              <p className="text-sm font-extrabold text-slate-950">Board</p>
              <p className="text-xs font-medium text-slate-500">Select a date card to read the note.</p>
            </div>
            <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {filteredNotes.length} notes
            </p>
          </div>

          <div className="grid max-h-[42rem] gap-4 overflow-y-auto pr-1 lg:grid-cols-3">
            {groupedNotes.map((group) => (
              <div key={group.month} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-extrabold text-slate-700 shadow-sm">
                      {group.month.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{group.notes.length}</span>
                  </div>
                  <CalendarDays size={15} className="text-slate-400" />
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
                            ? 'border-blue-300 bg-blue-50 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            aria-label={`Mark ${note.title} as checked`}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleCheckedNote(note.id)}
                            className="mt-1 size-4 rounded border-slate-300 accent-blue-600"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <FileText size={15} className="shrink-0 text-slate-400" />
                              <p
                                className={`truncate text-sm font-bold ${
                                  isChecked ? 'text-slate-400 line-through' : 'text-slate-900'
                                }`}
                              >
                                {note.title}
                              </p>
                              {note.important && <Star size={13} className="shrink-0 fill-blue-500 text-blue-500" />}
                            </div>
                            <p className="mt-1 text-xs font-medium text-slate-500">{note.date}</p>
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
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start">
              <div>
                <p className="section-kicker">Selected Note</p>
                <h3 className="mt-3 text-3xl font-black text-slate-950">{selectedNote.title}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">{selectedNote.date}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleCheckedNote(selectedNote.id)}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedNoteIsChecked
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
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

            <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {selectedNote.summary}
            </p>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <MarkdownRenderer content={selectedNote.content} />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
