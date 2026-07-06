import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Clock3,
  FileText,
  Hash,
  Layers3,
  Search,
  Sparkles,
  Star,
  Tags,
} from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SectionHeading } from '../components/SectionHeading';
import { notesByLocale, type Note } from '../data/notes';
import { useLocale, type Locale } from '../lib/locale';

type TocHeading = {
  id: string;
  level: number;
  title: string;
};

const notesText: Record<
  Locale,
  {
    all: string;
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
    categories: string;
    allCategories: string;
    readTime: string;
    tableOfContents: string;
    noToc: string;
    markdownNote: string;
    emptyState: string;
  }
> = {
  en: {
    all: 'All',
    sectionKicker: 'Engineering Notes',
    sectionTitle: 'A modern knowledge base for daily engineering study',
    sectionDescription:
      'Markdown notes are loaded into a clean, Notion-inspired reading system with search, filters, topic cards, reading time, and a table of contents.',
    searchPlaceholder: 'Search title, date, category, tag, or topic...',
    library: 'Knowledge Library',
    libraryHint: 'Filter, scan, and open each Markdown note like a living technical document.',
    notesSuffix: 'notes',
    activeNote: 'Active Document',
    important: 'Priority Note',
    totalNotes: 'Total notes',
    visibleNotes: 'Visible notes',
    selectedMonth: 'Selected month',
    categories: 'Categories',
    allCategories: 'All categories',
    readTime: 'min read',
    tableOfContents: 'On this page',
    noToc: 'Short note — no sections yet.',
    markdownNote: 'Markdown Document',
    emptyState: 'No notes match this filter.',
  },
  ko: {
    all: '전체',
    sectionKicker: 'Engineering Notes',
    sectionTitle: '현대적인 엔지니어링 지식 베이스',
    sectionDescription:
      'Markdown 필기를 Notion스럽고 직관적인 문서 시스템으로 불러옵니다. 검색, 월별 필터, 카테고리, 읽는 시간, 목차를 한 화면에서 확인할 수 있습니다.',
    searchPlaceholder: '제목, 날짜, 카테고리, 태그, 주제로 검색...',
    library: 'Knowledge Library',
    libraryHint: '필기를 파일 목록이 아니라 살아있는 기술 문서처럼 탐색합니다.',
    notesSuffix: '개 노트',
    activeNote: '현재 문서',
    important: '중요 노트',
    totalNotes: '전체 노트',
    visibleNotes: '현재 표시',
    selectedMonth: '선택 월',
    categories: '카테고리',
    allCategories: '전체 카테고리',
    readTime: '분 읽기',
    tableOfContents: '문서 목차',
    noToc: '짧은 노트라 목차가 없습니다.',
    markdownNote: 'Markdown 문서',
    emptyState: '조건에 맞는 노트가 없습니다.',
  },
};

function formatDateLabel(date: string, locale: Locale) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return { eyebrow: 'Note', value: date };
  }

  const month = parsedDate.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { month: 'short' });
  const day = parsedDate.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { day: 'numeric' });

  return { eyebrow: month, value: day };
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

function calculateReadMinutes(content: string) {
  const withoutCode = content.replace(/```[\s\S]*?```/g, ' ');
  const englishWords = withoutCode.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const koreanChars = withoutCode.match(/[가-힣]/g)?.length ?? 0;
  const estimatedWords = englishWords + koreanChars / 2.8;

  return Math.max(1, Math.ceil(estimatedWords / 220));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}:;,.!?/\\]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanHeadingText(text: string) {
  return text.replace(/^#+\s+/, '').replace(/^\d+(?:[-.)]|\.\s*)\s*/, '').trim();
}

function extractToc(content: string): TocHeading[] {
  const usedIds = new Map<string, number>();

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^#{2,3}\s+\S/.test(line))
    .map((line) => {
      const level = line.startsWith('###') ? 3 : 2;
      const title = cleanHeadingText(line);
      const baseId = slugify(title) || `section-${usedIds.size + 1}`;
      const seenCount = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, seenCount + 1);

      return {
        id: seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`,
        level,
        title,
      };
    })
    .filter((heading) => heading.title.length > 0)
    .slice(0, 12);
}

function getMonthValue(month: string) {
  const englishMonth = month.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (englishMonth) {
    const monthIndex = new Date(`${englishMonth[1]} 1, ${englishMonth[2]}`).getMonth();
    return Number(englishMonth[2]) * 100 + monthIndex + 1;
  }

  const koreanMonth = month.match(/(\d{4})년\s*(\d{1,2})월/);
  if (koreanMonth) {
    return Number(koreanMonth[1]) * 100 + Number(koreanMonth[2]);
  }

  return 0;
}

function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Notes() {
  const { locale } = useLocale();
  const text = notesText[locale];
  const notes = useMemo(
    () => [...notesByLocale[locale]].sort((a, b) => b.date.localeCompare(a.date)),
    [locale],
  );
  const months = useMemo(
    () => [...new Set(notes.map((note) => note.month))].sort((a, b) => getMonthValue(b) - getMonthValue(a)),
    [notes],
  );
  const categories = useMemo(
    () => [...new Set(notes.map((note) => note.category))].sort((a, b) => a.localeCompare(b)),
    [notes],
  );
  const [activeMonth, setActiveMonth] = useState(text.all);
  const [activeCategory, setActiveCategory] = useState(text.allCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id ?? '');

  useEffect(() => {
    if (activeMonth !== text.all && !months.includes(activeMonth)) {
      setActiveMonth(text.all);
    }
  }, [activeMonth, months, text.all]);

  useEffect(() => {
    if (activeCategory !== text.allCategories && !categories.includes(activeCategory)) {
      setActiveCategory(text.allCategories);
    }
  }, [activeCategory, categories, text.allCategories]);

  useEffect(() => {
    if (notes.length > 0 && !notes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesMonth = activeMonth === text.all || note.month === activeMonth;
      const matchesCategory = activeCategory === text.allCategories || note.category === activeCategory;
      const searchableText = [
        note.title,
        note.date,
        note.month,
        note.category,
        note.location ?? '',
        note.summary,
        note.content.slice(0, 1600),
        ...note.tags,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesMonth && matchesCategory && matchesSearch;
    });
  }, [activeCategory, activeMonth, notes, searchQuery, text.all, text.allCategories]);

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

  const selectedNote: Note | undefined = filteredNotes.find((note) => note.id === selectedNoteId) ?? filteredNotes[0] ?? notes[0];
  const selectedMonthLabel = activeMonth === text.all ? text.all : activeMonth;
  const toc = useMemo(() => (selectedNote ? extractToc(selectedNote.content) : []), [selectedNote]);
  const selectedReadMinutes = selectedNote ? calculateReadMinutes(selectedNote.content) : 0;

  return (
    <section id="notes" className="section-shell !max-w-[88rem]">
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

      <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur">
        <label className="flex items-center gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
          <Search size={19} className="text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={text.searchPlaceholder}
            className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
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

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            <Tags size={14} />
            {text.categories}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory(text.allCategories)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                activeCategory === text.allCategories
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              {text.allCategories}
            </button>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)] 2xl:grid-cols-[26rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur">
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

          <div className="mt-4 max-h-[52rem] space-y-5 overflow-y-auto pr-1">
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
                    const dateLabel = formatDateLabel(note.date, locale);
                    const readMinutes = calculateReadMinutes(note.content);

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
                              {dateLabel.eyebrow}
                            </span>
                            <span className="text-xl font-black leading-none tracking-tight">{dateLabel.value}</span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <h3 className={`break-words text-base font-black leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-slate-950'}`}>
                                {note.title}
                              </h3>
                              {note.important && (
                                <Star size={15} className={`mt-0.5 shrink-0 ${isSelected ? 'fill-white text-white' : 'fill-blue-500 text-blue-500'}`} />
                              )}
                            </div>
                            <p className={`mt-1 text-xs font-bold ${isSelected ? 'text-white/60' : 'text-slate-500'}`}>
                              {note.category} · {readMinutes} {text.readTime}
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
          <article className="min-w-0 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.55),_transparent_18rem),linear-gradient(135deg,_#0f172a_0%,_#1e293b_58%,_#111827_100%)] p-6 text-white shadow-xl shadow-slate-950/10">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                    <BookOpen size={14} />
                    {text.activeNote}
                  </p>
                  <h3 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                    {selectedNote.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-white/72">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatLongDate(selectedNote.date, locale)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={16} />
                      {selectedReadMinutes} {text.readTime}
                    </span>
                  </div>
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
              {selectedNote.tags.slice(0, 8).map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-7 text-slate-700">
              {selectedNote.summary}
            </p>

            <div className="mt-8 space-y-5">
              <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  <Hash size={14} />
                  {text.tableOfContents}
                </p>
                {toc.length > 0 ? (
                  <nav className="flex flex-wrap gap-2">
                    {toc.map((heading) => (
                      <button
                        key={heading.id}
                        type="button"
                        onClick={() => scrollToHeading(heading.id)}
                        className={`rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-bold leading-5 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 ${
                          heading.level === 3 ? 'opacity-80' : ''
                        }`}
                      >
                        {heading.title}
                      </button>
                    ))}
                  </nav>
                ) : (
                  <p className="rounded-xl bg-white p-3 text-xs font-semibold leading-5 text-slate-500">{text.noToc}</p>
                )}
              </aside>

              <div className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  <FileText size={15} />
                  {text.markdownNote}
                </div>
                <MarkdownRenderer content={selectedNote.content} />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-[1.5rem] border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700">
              <Sparkles size={15} />
              <span>{locale === 'ko' ? '새 md 파일을 noteContents에 넣으면 이 시스템에 자동으로 추가됩니다.' : 'Drop a new md file into noteContents and it joins this system automatically.'}</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
