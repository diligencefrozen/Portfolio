import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, FileText, Layers3, Search, Star } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SectionHeading } from '../components/SectionHeading';
import { notesByLocale } from '../data/notes';
import { useLocale, type Locale } from '../lib/locale';

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

const notesText: Record<
  Locale,
  {
    all: string;
    unsorted: string;
    defaultCategory: string;
    sectionKicker: string;
    sectionTitle: string;
    sectionDescription: string;
    searchPlaceholder: string;
    library: string;
    libraryHint: string;
    notesSuffix: string;
    activeNote: string;
    important: string;
    totalNotes: string;
    visibleNotes: string;
    selectedMonth: string;
    emptyState: string;
    defaultSummary: (title: string) => string;
    defaultTitle: (index: number) => string;
  }
> = {
  en: {
    all: 'All',
    unsorted: 'Unsorted',
    defaultCategory: 'Study Note',
    sectionKicker: 'Study Library',
    sectionTitle: 'Clean, Date-Based Learning Notes',
    sectionDescription:
      'A fast, readable knowledge library for daily study notes. Pick a month, search by topic, and open each Markdown note without unnecessary checklist UI.',
    searchPlaceholder: 'Search date, title, category, tag, or topic...',
    library: 'Note Library',
    libraryHint: 'Choose a date to open the full note.',
    notesSuffix: 'notes',
    activeNote: 'Active Note',
    important: 'Important',
    totalNotes: 'Total notes',
    visibleNotes: 'Visible notes',
    selectedMonth: 'Selected month',
    emptyState: 'No notes match this filter.',
    defaultSummary: (title) => `${title} study note. Markdown content can be migrated from the original Notion page.`,
    defaultTitle: (index) => `Study Note ${index + 1}`,
  },
  ko: {
    all: '전체',
    unsorted: '미분류',
    defaultCategory: '학습 노트',
    sectionKicker: '학습 라이브러리',
    sectionTitle: '깔끔한 날짜별 학습 노트',
    sectionDescription:
      '매일 쌓이는 수업 필기를 빠르게 찾고 읽기 위한 지식 라이브러리입니다. 불필요한 체크박스 없이 월별 필터, 검색, Markdown 본문 읽기에 집중합니다.',
    searchPlaceholder: '날짜, 제목, 카테고리, 태그, 주제로 검색...',
    library: '노트 라이브러리',
    libraryHint: '날짜를 선택하면 전체 필기본을 볼 수 있습니다.',
    notesSuffix: '개 노트',
    activeNote: '현재 노트',
    important: '중요',
    totalNotes: '전체 노트',
    visibleNotes: '현재 표시',
    selectedMonth: '선택 월',
    emptyState: '조건에 맞는 노트가 없습니다.',
    defaultSummary: (title) => `${title} 학습 노트입니다. 기존 Notion 필기 내용을 Markdown으로 옮겨 정리할 수 있습니다.`,
    defaultTitle: (index) => `학습 노트 ${index + 1}`,
  },
};

function formatMonthFromDate(date: string, locale: Locale) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return notesText[locale].unsorted;
  }

  return parsedDate.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatDateLabel(date: string, locale: Locale) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatLongDate(date: string, locale: Locale) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function createNoteId(note: RawImportedNote, index: number) {
  const source = `${note.date ?? 'note'}-${note.title ?? index}`;

  return source
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createDefaultMarkdown(note: RawImportedNote, title: string, locale: Locale) {
  if (locale === 'ko') {
    return `# ${title}

## 핵심 정리

> 이 페이지는 Markdown 이전을 위해 준비된 템플릿입니다. 기존 수업 필기 내용으로 교체하면 됩니다.

### 작성 가이드

- 중요한 내용은 **굵게 표시**합니다.
- 짧은 명령어와 식별자는 \`inline code\`로 표시합니다.
- Java, SQL, JavaScript, shell 코드는 코드블럭으로 정리합니다.

\`\`\`java
// 기존 코드 예제를 여기에 붙여넣으세요.
public class Example {
  public static void main(String[] args) {
    System.out.println("${title}");
  }
}
\`\`\`

${note.url ? `[원본 노트 링크](${note.url})` : ''}`;
  }

  return `# ${title}

## Key Takeaways

> This page is ready for Markdown migration. Replace this template with the original class note.

### Writing Guide

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

function normalizeNotes(notes: readonly RawImportedNote[], locale: Locale): NormalizedNote[] {
  const text = notesText[locale];

  return notes.map((note, index) => {
    const title = note.title ?? text.defaultTitle(index);
    const date = note.date ?? (locale === 'ko' ? '날짜 없음' : 'Undated');
    const month = note.month ?? formatMonthFromDate(date, locale);
    const category = note.category ?? text.defaultCategory;
    const summary = note.summary ?? text.defaultSummary(title);
    const tags = note.tags && note.tags.length > 0 ? note.tags : [category, month.replace(' 2026', '').replace('2026년 ', '')];

    return {
      id: note.id ?? createNoteId(note, index),
      title,
      date,
      month,
      category,
      location: note.location,
      summary,
      tags,
      content: note.content ?? createDefaultMarkdown(note, title, locale),
      important: note.important ?? false,
    };
  });
}

export function Notes() {
  const { locale } = useLocale();
  const text = notesText[locale];
  const notes = useMemo(() => normalizeNotes(notesByLocale[locale], locale), [locale]);
  const months = useMemo(() => [...new Set(notes.map((note) => note.month))], [notes]);
  const [activeMonth, setActiveMonth] = useState(text.all);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id ?? '');

  useEffect(() => {
    if (activeMonth !== text.all && !months.includes(activeMonth)) {
      setActiveMonth(text.all);
    }
  }, [activeMonth, months, text.all]);

  useEffect(() => {
    if (notes.length > 0 && !notes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesMonth = activeMonth === text.all || note.month === activeMonth;
      const searchableText = [
        note.title,
        note.date,
        note.month,
        note.category,
        note.location ?? '',
        note.summary,
        note.content.slice(0, 800),
        ...note.tags,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesMonth && matchesSearch;
    });
  }, [activeMonth, notes, searchQuery, text.all]);

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

  useEffect(() => {
    if (filteredNotes.length > 0 && !filteredNotes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(filteredNotes[0].id);
    }
  }, [filteredNotes, selectedNoteId]);

  const selectedNote = filteredNotes.find((note) => note.id === selectedNoteId) ?? filteredNotes[0] ?? notes[0];
  const selectedMonthLabel = activeMonth === text.all ? text.all : activeMonth;

  return (
    <section id="notes" className="section-shell">
      <SectionHeading
        kicker={text.sectionKicker}
        title={text.sectionTitle}
        description={text.sectionDescription}
      />

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">{text.totalNotes}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{notes.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">{text.visibleNotes}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{filteredNotes.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">{text.selectedMonth}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-slate-950">{selectedMonthLabel}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveMonth(text.all)}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
            activeMonth === text.all
              ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-950'
          }`}
        >
          {text.all}
        </button>

        {months.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setActiveMonth(month)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
              activeMonth === month
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-950'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-slate-700 shadow-sm transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
        <Search size={19} className="text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={text.searchPlaceholder}
          className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-2 pb-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black text-slate-950">
                <Layers3 size={17} className="text-blue-600" />
                {text.library}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{text.libraryHint}</p>
            </div>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
              {filteredNotes.length} {text.notesSuffix}
            </span>
          </div>

          <div className="mt-4 max-h-[48rem] space-y-5 overflow-y-auto pr-1">
            {groupedNotes.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                {text.emptyState}
              </div>
            )}

            {groupedNotes.map((group) => (
              <div key={group.month}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{group.month}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                    {group.notes.length}
                  </span>
                </div>

                <div className="grid gap-2">
                  {group.notes.map((note) => {
                    const isSelected = selectedNote?.id === note.id;

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => setSelectedNoteId(note.id)}
                        className={`group w-full rounded-[1.35rem] border p-4 text-left transition ${
                          isSelected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-950/10'
                            : 'border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-950/5'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`grid min-w-16 place-items-center rounded-2xl px-3 py-2 text-center transition ${
                              isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700'
                            }`}
                          >
                            <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] opacity-70">
                              {formatDateLabel(note.date, locale).split(' ')[0]}
                            </span>
                            <span className="text-xl font-black leading-none tracking-tight">
                              {formatDateLabel(note.date, locale).split(' ').slice(1).join(' ') || formatDateLabel(note.date, locale)}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <h3 className={`text-base font-black leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-slate-950'}`}>
                                {note.title}
                              </h3>
                              {note.important && (
                                <Star size={15} className={`mt-0.5 shrink-0 ${isSelected ? 'fill-white text-white' : 'fill-blue-500 text-blue-500'}`} />
                              )}
                            </div>
                            <p className={`mt-1 text-xs font-bold ${isSelected ? 'text-white/60' : 'text-slate-500'}`}>
                              {note.category}
                            </p>
                            <p className={`mt-2 line-clamp-2 text-xs leading-5 ${isSelected ? 'text-white/72' : 'text-slate-500'}`}>
                              {note.summary}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {selectedNote && (
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:sticky xl:top-28 xl:max-h-[52rem] xl:overflow-y-auto">
            <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_55%,_#2563eb_100%)] p-6 text-white shadow-xl shadow-slate-950/10">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                    <BookOpen size={14} />
                    {text.activeNote}
                  </p>
                  <h3 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                    {selectedNote.title}
                  </h3>
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white/72">
                    <CalendarDays size={16} />
                    {formatLongDate(selectedNote.date, locale)}
                  </p>
                </div>

                {selectedNote.important && (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-950 shadow-sm">
                    <Star size={14} className="fill-blue-600 text-blue-600" />
                    {text.important}
                  </span>
                )}
              </div>
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

            <p className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-7 text-slate-700">
              {selectedNote.summary}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                <FileText size={15} />
                Markdown Note
              </div>
              <MarkdownRenderer content={selectedNote.content} />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
