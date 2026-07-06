import type { Locale } from '../lib/locale';

export type Note = {
  id: string;
  title: string;
  date: string;
  month: string;
  category: string;
  location?: string;
  summary: string;
  tags: string[];
  content: string;
  important?: boolean;
};

type RawNote = Omit<Note, 'summary' | 'content' | 'tags'> & {
  summary?: string;
  tags?: string[];
  content?: string;
};

const noteContentModules = import.meta.glob<string>('./noteContents/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const importantDates = new Set([
  '2026-03-04',
  '2026-03-11',
  '2026-03-13',
  '2026-03-18',
  '2026-03-23',
  '2026-03-25',
  '2026-03-26',
  '2026-03-27',
  '2026-04-17',
  '2026-04-29',
  '2026-05-15',
  '2026-06-02',
  '2026-07-01',
]);

const monthKoMap: Record<string, string> = {
  'January 2026': '2026년 1월',
  'February 2026': '2026년 2월',
  'March 2026': '2026년 3월',
  'April 2026': '2026년 4월',
  'May 2026': '2026년 5월',
  'June 2026': '2026년 6월',
  'July 2026': '2026년 7월',
  'August 2026': '2026년 8월',
  'September 2026': '2026년 9월',
  'October 2026': '2026년 10월',
  'November 2026': '2026년 11월',
  'December 2026': '2026년 12월',
};

const monthEnNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getCompactDateTitle(date: string) {
  const [year, month, day] = date.split('-');
  return `${month}${day}${year}`;
}

function getMonthFromDate(date: string) {
  const [year, month] = date.split('-');
  const monthIndex = Number(month) - 1;

  return `${monthEnNames[monthIndex] ?? 'Unsorted'} ${year}`;
}

function getLocalizedMonth(month: string, locale: Locale) {
  return locale === 'ko' ? monthKoMap[month] ?? month : month;
}

function getLocalizedCategory(category: string, locale: Locale) {
  if (locale === 'en') {
    return category;
  }

  const koCategoryMap: Record<string, string> = {
    'Java / Basic': 'Java / 기초',
    'Java / Spring': 'Java / Spring',
    'Database / SQL': 'Database / SQL',
    'Web / API': 'Web / API',
    'Python / AI': 'Python / AI',
    'Study Note': '학습 노트',
  };

  return koCategoryMap[category] ?? category;
}

function normalizeContent(content: string) {
  return content
    .replace(/<aside>\s*/g, '> ')
    .replace(/\s*<\/aside>/g, '')
    .replace(/^💡\s*$/gm, '')
    .trim();
}

function extractFirstHeading(content: string) {
  const heading = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /^#{1,3}\s+/.test(line));

  return heading?.replace(/^#{1,3}\s+/, '').trim();
}

function inferCategory(content: string) {
  const normalizedContent = content.toLowerCase();

  if (/tensorflow|placeholder|variable|python|keras|딥러닝/.test(normalizedContent)) {
    return 'Python / AI';
  }

  if (/spring|mybatis|ajax|controller|mapper|servlet|egov/.test(normalizedContent)) {
    return 'Java / Spring';
  }

  if (/oracle|sql|select|insert|update|delete|database|db\b/.test(normalizedContent)) {
    return 'Database / SQL';
  }

  if (/open api|xml|json|url|http|request|response|api/.test(normalizedContent)) {
    return 'Web / API';
  }

  if (/java|jdk|jvm|eclipse|class|public static void main/.test(normalizedContent)) {
    return 'Java / Basic';
  }

  return 'Study Note';
}

function buildTags(category: string, month: string, content: string) {
  const tags = new Set<string>([category, month.replace(' 2026', '')]);
  const keywordTags: Array<[RegExp, string]> = [
    [/java/i, 'Java'],
    [/spring/i, 'Spring'],
    [/mybatis/i, 'MyBatis'],
    [/ajax/i, 'AJAX'],
    [/oracle|sql/i, 'SQL'],
    [/xml/i, 'XML'],
    [/json/i, 'JSON'],
    [/api/i, 'API'],
    [/python/i, 'Python'],
    [/tensorflow/i, 'TensorFlow'],
  ];

  keywordTags.forEach(([pattern, tag]) => {
    if (pattern.test(content)) {
      tags.add(tag);
    }
  });

  return [...tags];
}

function createRawNotesFromMarkdown(): RawNote[] {
  return Object.entries(noteContentModules)
    .map(([path, content]): RawNote | null => {
      const date = path.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1];

      if (!date) {
        return null;
      }

      const normalizedContent = normalizeContent(content);
      const month = getMonthFromDate(date);
      const category = inferCategory(normalizedContent);
      const heading = extractFirstHeading(normalizedContent);
      const title = getCompactDateTitle(date);

      return {
        id: date,
        title,
        date,
        month,
        category,
        summary: heading
          ? `${title} — ${heading}`
          : `${title} study note imported from Markdown.`,
        tags: buildTags(category, month, normalizedContent),
        content: normalizedContent,
        important: importantDates.has(date),
      } satisfies RawNote;
    })
    .filter((note): note is RawNote => note !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildDefaultContent(note: RawNote, locale: Locale) {
  if (locale === 'ko') {
    return `# ${note.title}

## 핵심 정리

> 아직 연결된 Markdown 본문이 없습니다. \`src/data/noteContents/${note.date}.md\` 파일을 추가하면 자동으로 노트 탭에 표시됩니다.
`;
  }

  return `# ${note.title}

## Key Takeaways

> No Markdown body is connected yet. Add \`src/data/noteContents/${note.date}.md\` and it will show up automatically in the Notes tab.
`;
}

function buildNote(note: RawNote, locale: Locale): Note {
  const month = getLocalizedMonth(note.month, locale);
  const category = getLocalizedCategory(note.category, locale);

  return {
    ...note,
    month,
    category,
    summary:
      note.summary ??
      (locale === 'ko'
        ? `${note.title} 학습 노트입니다. Markdown 파일에서 자동으로 불러왔습니다.`
        : `${note.title} study note imported automatically from Markdown.`),
    content: note.content ?? buildDefaultContent(note, locale),
    tags: note.tags ?? [category, locale === 'ko' ? month.replace('2026년 ', '').replace('월', '월') : month.replace(' 2026', '')],
  };
}

const rawNotes: RawNote[] = createRawNotesFromMarkdown();

export const notesByLocale: Record<Locale, Note[]> = {
  en: rawNotes.map((note) => buildNote(note, 'en')),
  ko: rawNotes.map((note) => buildNote(note, 'ko')),
};

export const notes: Note[] = notesByLocale.en;
