import type { Locale } from '../lib/locale';
import note20260304Content from './noteContents/2026-03-04.md?raw';
import note20260304Content from './noteContents/2026-03-05.md?raw';
import note20260304Content from './noteContents/2026-03-06.md?raw';

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

type StudyNoteInput = {
  date: string;
  month: string;
  category?: string;
  location?: string;
  summary?: string;
  tags?: string[];
  content?: string;
  important?: boolean;
  suffix?: string;
};

const monthKoMap: Record<string, string> = {
  'March 2026': '2026년 3월',
  'April 2026': '2026년 4월',
  'May 2026': '2026년 5월',
  'June 2026': '2026년 6월',
};

function getCompactDateTitle(date: string) {
  const [year, month, day] = date.split('-');
  return `${month}${day}${year}`;
}

function createStudyNote({
  date,
  month,
  category = 'Study Note',
  suffix,
  ...note
}: StudyNoteInput): RawNote {
  const title = suffix ? `${getCompactDateTitle(date)}_${suffix}` : getCompactDateTitle(date);

  return {
    id: suffix ? `${date}-${suffix}` : date,
    title,
    date,
    month,
    category,
    ...note,
  };
}



function getLocalizedMonth(month: string, locale: Locale) {
  return locale === 'ko' ? monthKoMap[month] ?? month : month;
}

function getLocalizedCategory(category: string, locale: Locale) {
  if (locale === 'en') {
    return category;
  }

  if (category === 'Study Note') {
    return '학습 노트';
  }

  return category;
}

function buildDefaultContent(note: RawNote, locale: Locale) {
  if (locale === 'ko') {
    return `# ${note.title}

## 학습 체크리스트

- 이 날짜에 학습한 핵심 개념을 다시 확인합니다.
- 기존 Notion 필기 내용을 이 Markdown 필드로 옮깁니다.
- 필요한 경우 소스 코드, 명령어, 스크린샷, 오류 해결 기록을 추가합니다.

## 핵심 정리

> 이 페이지는 Markdown 필기 이전을 위해 준비된 템플릿입니다. 기존 수업 필기 내용으로 교체하면 됩니다.

### Markdown 예시

- 중요한 개념은 **굵게 표시**합니다.
- 짧은 명령어나 식별자는 \`inline code\`로 표시합니다.
- Java, SQL, JavaScript, shell 명령어는 코드블럭으로 정리합니다.

\`\`\`java
// 기존 코드 예제를 여기에 붙여넣으세요.
public class Example {
  public static void main(String[] args) {
    System.out.println("${note.title}");
  }
}
\`\`\`
`;
  }

  return `# ${note.title}

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
    System.out.println("${note.title}");
  }
}
\`\`\`
`;
}

function localizeProvidedContent(note: RawNote, locale: Locale) {
  if (locale === 'ko' && note.id === '2026-05-28') {
    return `# 05282026

## 예제

### HomeController.java

C:\\Users\\sedu01\\Desktop\\Test\\20260518_eGov\\May28_1_AJAXServer\\src\\main\\java\\com\\beaver\\may281\\HomeController.java

\`\`\`java
package com.beaver.may281;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class HomeController {
  private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

  // 원본 Notion 코드블럭 전체를 여기에 옮기면 됩니다.
}
\`\`\`

## 이전 메모

- 이 페이지는 기존 Notion 날짜별 필기와 연결되어 있습니다.
- Markdown export 파일이 준비되면 placeholder 코드를 실제 수업 코드로 교체하세요.
`;
  }

  return note.content;
}

function buildNote(note: RawNote, locale: Locale): Note {
  const month = getLocalizedMonth(note.month, locale);
  const category = getLocalizedCategory(note.category, locale);
  const providedContent = localizeProvidedContent(note, locale);

  return {
    ...note,
    month,
    category,
    summary:
      note.summary ??
      (locale === 'ko'
        ? `${note.title} 학습 노트입니다. 기존 Notion 필기 내용을 Markdown으로 옮겨 정리할 수 있습니다.`
        : `${note.title} study note. Markdown content can be migrated from the original Notion page.`),
    content: providedContent ?? buildDefaultContent(note, locale),
    tags: note.tags ?? [category, locale === 'ko' ? month.replace('2026년 ', '').replace('월', '월') : month.replace(' 2026', '')],
  };
}

// -----------------------------------------------------------------------------
// March 2026
// -----------------------------------------------------------------------------

// 2026-03-04 / 03042026
const note20260304 = createStudyNote({
  date: '2026-03-04',
  month: 'March 2026',
  category: 'Java / Basic',
  location: 'Java basics / JDK / Eclipse / Console output',
  summary: 'Java fundamentals note covering JDK, JVM, Eclipse setup, comments, output methods, escape sequences, and printf formatting.',
  tags: ['Java', 'JDK', 'JVM', 'Eclipse', 'Console', 'printf'],
  important: true,
  content: note20260304Content,
});

// 2026-03-05 / 03052026
const note20260305 = createStudyNote({
  date: '2026-03-05',
  month: 'March 2026',
  category: 'Java / Basic',
  location: '',
  summary: 'Java fundamentals note covering JDK, JVM, Eclipse setup, comments, output methods, escape sequences, and printf formatting.',
  tags: ['Java', 'JDK', 'JVM', 'Eclipse', 'Console', 'printf'],
  important: true,
  content: note20260305Content,
});

// 2026-03-06 / 03062026
const note20260306 = createStudyNote({
  date: '2026-03-06',
  month: 'March 2026',
  category: 'Java / Basic',
  location: '',
  summary: 'Java fundamentals note covering JDK, JVM, Eclipse setup, comments, output methods, escape sequences, and printf formatting.',
  tags: ['Java', 'JDK', 'JVM', 'Eclipse', 'Console', 'printf'],
  important: true,
  content: note20260306Content,
});

// 2026-03-09 / 03092026
const note20260309 = createStudyNote({
  date: '2026-03-09',
  month: 'March 2026',
});

// 2026-03-10 / 03102026
const note20260310 = createStudyNote({
  date: '2026-03-10',
  month: 'March 2026',
});

// 2026-03-11 / 03112026
const note20260311 = createStudyNote({
  date: '2026-03-11',
  month: 'March 2026',
  important: true,
});

// 2026-03-12 / 03122026
const note20260312 = createStudyNote({
  date: '2026-03-12',
  month: 'March 2026',
});

// 2026-03-13 / 03132026
const note20260313 = createStudyNote({
  date: '2026-03-13',
  month: 'March 2026',
  important: true,
});

// 2026-03-17 / 03172026
const note20260317 = createStudyNote({
  date: '2026-03-17',
  month: 'March 2026',
});

// 2026-03-18 / 03182026
const note20260318 = createStudyNote({
  date: '2026-03-18',
  month: 'March 2026',
  important: true,
});

// 2026-03-19 / 03192026
const note20260319 = createStudyNote({
  date: '2026-03-19',
  month: 'March 2026',
});

// 2026-03-20 / 03202026
const note20260320 = createStudyNote({
  date: '2026-03-20',
  month: 'March 2026',
});

// 2026-03-23 / 03232026
const note20260323 = createStudyNote({
  date: '2026-03-23',
  month: 'March 2026',
  important: true,
});

// 2026-03-24 / 03242026
const note20260324 = createStudyNote({
  date: '2026-03-24',
  month: 'March 2026',
});

// 2026-03-25 / 03252026
const note20260325 = createStudyNote({
  date: '2026-03-25',
  month: 'March 2026',
  important: true,
});

// 2026-03-26 / 03262026
const note20260326 = createStudyNote({
  date: '2026-03-26',
  month: 'March 2026',
  important: true,
});

// 2026-03-27 / 03272026
const note20260327 = createStudyNote({
  date: '2026-03-27',
  month: 'March 2026',
  important: true,
});

// 2026-03-30 / 03302026
const note20260330 = createStudyNote({
  date: '2026-03-30',
  month: 'March 2026',
});

// 2026-03-31 / 03312026
const note20260331 = createStudyNote({
  date: '2026-03-31',
  month: 'March 2026',
});

// -----------------------------------------------------------------------------
// April 2026
// -----------------------------------------------------------------------------

// 2026-04-01 / 04012026
const note20260401 = createStudyNote({
  date: '2026-04-01',
  month: 'April 2026',
});

// 2026-04-02 / 04022026
const note20260402 = createStudyNote({
  date: '2026-04-02',
  month: 'April 2026',
});

// 2026-04-03 / 04032026
const note20260403 = createStudyNote({
  date: '2026-04-03',
  month: 'April 2026',
});

// 2026-04-06 / 04062026
const note20260406 = createStudyNote({
  date: '2026-04-06',
  month: 'April 2026',
});

// 2026-04-07 / 04072026
const note20260407 = createStudyNote({
  date: '2026-04-07',
  month: 'April 2026',
});

// 2026-04-08 / 04082026
const note20260408 = createStudyNote({
  date: '2026-04-08',
  month: 'April 2026',
});

// 2026-04-09 / 04092026
const note20260409 = createStudyNote({
  date: '2026-04-09',
  month: 'April 2026',
});

// 2026-04-10 / 04102026
const note20260410 = createStudyNote({
  date: '2026-04-10',
  month: 'April 2026',
});

// 2026-04-14 / 04142026
const note20260414 = createStudyNote({
  date: '2026-04-14',
  month: 'April 2026',
});

// 2026-04-15 / 04152026
const note20260415 = createStudyNote({
  date: '2026-04-15',
  month: 'April 2026',
});

// 2026-04-16 / 04162026
const note20260416 = createStudyNote({
  date: '2026-04-16',
  month: 'April 2026',
});

// 2026-04-17 / 04172026
const note20260417 = createStudyNote({
  date: '2026-04-17',
  month: 'April 2026',
  important: true,
});

// 2026-04-17 / 04172026_02
const note20260417Part02 = createStudyNote({
  date: '2026-04-17',
  month: 'April 2026',
  suffix: '02',
  important: true,
});

// 2026-04-20 / 04202026
const note20260420 = createStudyNote({
  date: '2026-04-20',
  month: 'April 2026',
});

// 2026-04-21 / 04212026
const note20260421 = createStudyNote({
  date: '2026-04-21',
  month: 'April 2026',
});

// 2026-04-22 / 04222026
const note20260422 = createStudyNote({
  date: '2026-04-22',
  month: 'April 2026',
});

// 2026-04-23 / 04232026
const note20260423 = createStudyNote({
  date: '2026-04-23',
  month: 'April 2026',
});

// 2026-04-24 / 04242026
const note20260424 = createStudyNote({
  date: '2026-04-24',
  month: 'April 2026',
});

// 2026-04-28 / 04282026
const note20260428 = createStudyNote({
  date: '2026-04-28',
  month: 'April 2026',
});

// 2026-04-29 / 04292026
const note20260429 = createStudyNote({
  date: '2026-04-29',
  month: 'April 2026',
  important: true,
});

// 2026-04-30 / 04302026
const note20260430 = createStudyNote({
  date: '2026-04-30',
  month: 'April 2026',
});

// -----------------------------------------------------------------------------
// May 2026
// -----------------------------------------------------------------------------

// 2026-05-06 / 05062026
const note20260506 = createStudyNote({
  date: '2026-05-06',
  month: 'May 2026',
});

// 2026-05-07 / 05072026
const note20260507 = createStudyNote({
  date: '2026-05-07',
  month: 'May 2026',
});

// 2026-05-08 / 05082026
const note20260508 = createStudyNote({
  date: '2026-05-08',
  month: 'May 2026',
});

// 2026-05-11 / 05112026
const note20260511 = createStudyNote({
  date: '2026-05-11',
  month: 'May 2026',
});

// 2026-05-12 / 05122026
const note20260512 = createStudyNote({
  date: '2026-05-12',
  month: 'May 2026',
});

// 2026-05-13 / 05132026
const note20260513 = createStudyNote({
  date: '2026-05-13',
  month: 'May 2026',
});

// 2026-05-14 / 05142026
const note20260514 = createStudyNote({
  date: '2026-05-14',
  month: 'May 2026',
});

// 2026-05-15 / 05152026
const note20260515 = createStudyNote({
  date: '2026-05-15',
  month: 'May 2026',
  important: true,
});

// 2026-05-18 / 05182026
const note20260518 = createStudyNote({
  date: '2026-05-18',
  month: 'May 2026',
});

// 2026-05-19 / 05192026
const note20260519 = createStudyNote({
  date: '2026-05-19',
  month: 'May 2026',
});

// 2026-05-20 / 05202026
const note20260520 = createStudyNote({
  date: '2026-05-20',
  month: 'May 2026',
});

// 2026-05-21 / 05212026
const note20260521 = createStudyNote({
  date: '2026-05-21',
  month: 'May 2026',
});

// 2026-05-22 / 05222026
const note20260522 = createStudyNote({
  date: '2026-05-22',
  month: 'May 2026',
});

// 2026-05-26 / 05262026
const note20260526 = createStudyNote({
  date: '2026-05-26',
  month: 'May 2026',
});

// 2026-05-27 / 05272026
const note20260527 = createStudyNote({
  date: '2026-05-27',
  month: 'May 2026',
});

// 2026-05-28 / 05282026
const note20260528 = createStudyNote({
  date: '2026-05-28',
  month: 'May 2026',
  category: 'Java / Spring',
  location: 'AJAX Server / HomeController.java',
  summary: 'Spring controller note prepared for Java and AJAX server study content.',
  tags: ['Java', 'Spring MVC', 'Controller', 'AJAX'],
  content: `# 05282026

## Example

### HomeController.java

C:\\Users\\sedu01\\Desktop\\Test\\20260518_eGov\\May28_1_AJAXServer\\src\\main\\java\\com\\beaver\\may281\\HomeController.java

\`\`\`java
package com.beaver.may281;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class HomeController {
  private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

  // Move the full Notion code block here.
}
\`\`\`

## Migration note

- This page is connected to the original Notion-style date entry.
- Replace the placeholder code with the full class note when the Markdown export is available.
`,
});

// 2026-05-29 / 05292026
const note20260529 = createStudyNote({
  date: '2026-05-29',
  month: 'May 2026',
});

const march2026Notes: RawNote[] = [
  note20260304,
  note20260305,
  note20260306,
  note20260309,
  note20260310,
  note20260311,
  note20260312,
  note20260313,
  note20260317,
  note20260318,
  note20260319,
  note20260320,
  note20260323,
  note20260324,
  note20260325,
  note20260326,
  note20260327,
  note20260330,
  note20260331,
];

const april2026Notes: RawNote[] = [
  note20260401,
  note20260402,
  note20260403,
  note20260406,
  note20260407,
  note20260408,
  note20260409,
  note20260410,
  note20260414,
  note20260415,
  note20260416,
  note20260417,
  note20260417Part02,
  note20260420,
  note20260421,
  note20260422,
  note20260423,
  note20260424,
  note20260428,
  note20260429,
  note20260430,
];

const may2026Notes: RawNote[] = [
  note20260506,
  note20260507,
  note20260508,
  note20260511,
  note20260512,
  note20260513,
  note20260514,
  note20260515,
  note20260518,
  note20260519,
  note20260520,
  note20260521,
  note20260522,
  note20260526,
  note20260527,
  note20260528,
  note20260529,
];

const rawNotes: RawNote[] = [
  ...march2026Notes,
  ...april2026Notes,
  ...may2026Notes,
];

export const notesByLocale: Record<Locale, Note[]> = {
  en: rawNotes.map((note) => buildNote(note, 'en')),
  ko: rawNotes.map((note) => buildNote(note, 'ko')),
};

export const notes: Note[] = notesByLocale.en;
