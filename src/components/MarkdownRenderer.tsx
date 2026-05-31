import type { ReactNode } from 'react';

type MarkdownRendererProps = {
  content: string;
};

type ListItem = {
  text: string;
  ordered: boolean;
};

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
        <strong key={`strong-${key}`} className="font-semibold text-white">
          {match[2]}
        </strong>,
      );
    } else if (match[4]) {
      elements.push(
        <code key={`code-${key}`} className="rounded bg-slate-900 px-1.5 py-0.5 text-sky-200">
          {match[4]}
        </code>,
      );
    } else if (match[6] && match[7]) {
      elements.push(
        <a
          key={`link-${key}`}
          className="text-sky-200 underline decoration-sky-300/40 underline-offset-4 transition hover:text-sky-100"
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
  let paragraphLines: string[] = [];
  let listItems: ListItem[] = [];
  let blockIndex = 0;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push(
      <p key={`paragraph-${blockIndex}`} className="leading-8 text-slate-300">
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
        className={`space-y-2 pl-5 text-slate-300 ${isOrdered ? 'list-decimal' : 'list-disc'}`}
      >
        {listItems.map((item) => (
          <li key={`${blockIndex}-${item.text}`}>{renderInline(item.text)}</li>
        ))}
      </ListTag>,
    );
    listItems = [];
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
        <div key={`code-${blockIndex}`} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
          {language && (
            <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              {language}
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-sm leading-7 text-slate-200">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={`h3-${blockIndex}`} className="pt-2 text-lg font-semibold text-white">
          {renderInline(trimmed.slice(4))}
        </h4>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={`h2-${blockIndex}`} className="pt-3 text-2xl font-bold text-white">
          {renderInline(trimmed.slice(3))}
        </h3>,
      );
      blockIndex += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={`h1-${blockIndex}`} className="text-3xl font-black tracking-tight text-white">
          {renderInline(trimmed.slice(2))}
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
          className="border-l-4 border-sky-300/60 bg-sky-300/10 py-3 pl-4 text-sky-100"
        >
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

  return <div className="space-y-5">{blocks}</div>;
}
