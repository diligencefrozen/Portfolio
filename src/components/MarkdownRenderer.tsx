import type { ReactNode } from 'react';

type MarkdownRendererProps = {
  content: string;
};

type ListItem = {
  text: string;
  ordered: boolean;
};

type TableBlock = {
  headers: string[];
  rows: string[][];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}:;,.!?/\\]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripHeadingMarker(text: string) {
  return text.replace(/^#+\s+/, '').replace(/^\d+(?:[-.)]|\.\s*)\s*/, '').trim();
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableDivider(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function renderInline(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const pattern = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))/;

  while (remaining.length > 0) {
    const match = remaining.match(pattern);

    if (!match || match.index === undefined) {
      elements.push(remaining);
      break;
    }

    if (match.index > 0) {
      elements.push(remaining.slice(0, match.index));
    }

    if (match[2]) {
      elements.push(
        <strong key={`strong-${key}`} className="font-extrabold text-slate-950">
          {match[2]}
        </strong>,
      );
    } else if (match[4]) {
      elements.push(
        <code key={`code-${key}`} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.92em] font-semibold text-blue-700 ring-1 ring-slate-200">
          {match[4]}
        </code>,
      );
    } else if (match[6] && match[7]) {
      elements.push(
        <a
          key={`link-${key}`}
          className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900"
          href={match[7]}
          target="_blank"
          rel="noreferrer"
        >
          {match[6]}
        </a>,
      );
    }

    remaining = remaining.slice(match.index + match[0].length);
    key += 1;
  }

  return elements;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.trim().split('\n');
  const blocks: ReactNode[] = [];
  const headingCounts = new Map<string, number>();
  let paragraphLines: string[] = [];
  let listItems: ListItem[] = [];
  let blockIndex = 0;

  const buildHeadingId = (title: string) => {
    const baseId = slugify(title) || `section-${blockIndex}`;
    const seenCount = headingCounts.get(baseId) ?? 0;
    headingCounts.set(baseId, seenCount + 1);

    return seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`;
  };

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push(
      <p key={`paragraph-${blockIndex}`} className="leading-8 text-slate-700">
        {renderInline(paragraphLines.join(' '))}
      </p>,
    );
    paragraphLines = [];
    blockIndex += 1;
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    const isOrdered = listItems.every((item) => item.ordered);
    const ListTag = isOrdered ? 'ol' : 'ul';

    blocks.push(
      <ListTag
        key={`list-${blockIndex}`}
        className={`space-y-2 pl-5 leading-8 text-slate-700 ${isOrdered ? 'list-decimal' : 'list-disc'}`}
      >
        {listItems.map((item, itemIndex) => (
          <li key={`${blockIndex}-${itemIndex}-${item.text}`}>{renderInline(item.text)}</li>
        ))}
      </ListTag>,
    );
    listItems = [];
    blockIndex += 1;
  };

  const renderTable = (table: TableBlock) => {
    blocks.push(
      <div key={`table-${blockIndex}`} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              <tr>
                {table.headers.map((header, headerIndex) => (
                  <th key={`${header}-${headerIndex}`} className="border-b border-slate-200 px-4 py-3">
                    {renderInline(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {table.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="odd:bg-white even:bg-slate-50/60">
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top leading-7">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>,
    );
    blockIndex += 1;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      flushParagraph();
      flushList();
      blocks.push(<hr key={`divider-${blockIndex}`} className="border-slate-200" />);
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();

      const language = trimmed.replace('```', '').trim();
      const codeLines: string[] = [];
      lineIndex += 1;

      while (lineIndex < lines.length && !lines[lineIndex].trim().startsWith('```')) {
        codeLines.push(lines[lineIndex]);
        lineIndex += 1;
      }

      blocks.push(
        <div key={`code-${blockIndex}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {language || 'code'}
            </span>
            <span className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-500">snippet</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-7 text-slate-100">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.includes('|') && lineIndex + 1 < lines.length && isTableDivider(lines[lineIndex + 1])) {
      flushParagraph();
      flushList();

      const headers = splitTableRow(trimmed);
      const rows: string[][] = [];
      lineIndex += 2;

      while (lineIndex < lines.length && lines[lineIndex].trim().includes('|')) {
        rows.push(splitTableRow(lines[lineIndex]));
        lineIndex += 1;
      }

      lineIndex -= 1;
      renderTable({ headers, rows });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      const headingText = stripHeadingMarker(trimmed);

      if (headingText.length === 0) {
        continue;
      }

      blocks.push(
        <h4 id={buildHeadingId(headingText)} key={`h3-${blockIndex}`} className="scroll-mt-28 pt-2 text-lg font-extrabold text-slate-950">
          {renderInline(headingText)}
        </h4>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      const headingText = stripHeadingMarker(trimmed);

      if (headingText.length === 0) {
        continue;
      }

      blocks.push(
        <h3 id={buildHeadingId(headingText)} key={`h2-${blockIndex}`} className="scroll-mt-28 pt-4 text-2xl font-extrabold tracking-tight text-slate-950">
          {renderInline(headingText)}
        </h3>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      const headingText = stripHeadingMarker(trimmed);

      if (headingText.length === 0) {
        continue;
      }

      blocks.push(
        <h2 key={`h1-${blockIndex}`} className="text-3xl font-black tracking-tight text-slate-950">
          {renderInline(headingText)}
        </h2>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote
          key={`quote-${blockIndex}`}
          className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-7 text-blue-950 shadow-sm"
        >
          <span className="mr-2" aria-hidden="true">💡</span>
          {renderInline(trimmed.slice(2))}
        </blockquote>,
      );
      blockIndex += 1;
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)/);

    if (unorderedMatch) {
      flushParagraph();
      listItems.push({ text: unorderedMatch[1], ordered: false });
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      listItems.push({ text: orderedMatch[1], ordered: true });
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return <div className="space-y-5 text-[0.98rem]">{blocks}</div>;
}
