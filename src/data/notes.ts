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

function buildDefaultContent(note: RawNote) {
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

const rawNotes: RawNote[] = [
  { id: '2026-03-04', title: '03042026', date: '2026-03-04', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-05', title: '03052026', date: '2026-03-05', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-06', title: '03062026', date: '2026-03-06', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-09', title: '03092026', date: '2026-03-09', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-10', title: '03102026', date: '2026-03-10', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-11', title: '03112026', date: '2026-03-11', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-12', title: '03122026', date: '2026-03-12', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-13', title: '03132026', date: '2026-03-13', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-17', title: '03172026', date: '2026-03-17', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-18', title: '03182026', date: '2026-03-18', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-19', title: '03192026', date: '2026-03-19', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-20', title: '03202026', date: '2026-03-20', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-23', title: '03232026', date: '2026-03-23', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-24', title: '03242026', date: '2026-03-24', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-25', title: '03252026', date: '2026-03-25', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-26', title: '03262026', date: '2026-03-26', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-27', title: '03272026', date: '2026-03-27', month: 'March 2026', category: 'Study Note', important: true },
  { id: '2026-03-30', title: '03302026', date: '2026-03-30', month: 'March 2026', category: 'Study Note' },
  { id: '2026-03-31', title: '03312026', date: '2026-03-31', month: 'March 2026', category: 'Study Note' },
  { id: '2026-04-01', title: '04012026', date: '2026-04-01', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-02', title: '04022026', date: '2026-04-02', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-03', title: '04032026', date: '2026-04-03', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-06', title: '04062026', date: '2026-04-06', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-07', title: '04072026', date: '2026-04-07', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-08', title: '04082026', date: '2026-04-08', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-09', title: '04092026', date: '2026-04-09', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-10', title: '04102026', date: '2026-04-10', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-14', title: '04142026', date: '2026-04-14', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-15', title: '04152026', date: '2026-04-15', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-16', title: '04162026', date: '2026-04-16', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-17', title: '04172026', date: '2026-04-17', month: 'April 2026', category: 'Study Note', important: true },
  { id: '2026-04-17-02', title: '04172026_02', date: '2026-04-17', month: 'April 2026', category: 'Study Note', important: true },
  { id: '2026-04-20', title: '04202026', date: '2026-04-20', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-21', title: '04212026', date: '2026-04-21', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-22', title: '04222026', date: '2026-04-22', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-23', title: '04232026', date: '2026-04-23', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-24', title: '04242026', date: '2026-04-24', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-28', title: '04282026', date: '2026-04-28', month: 'April 2026', category: 'Study Note' },
  { id: '2026-04-29', title: '04292026', date: '2026-04-29', month: 'April 2026', category: 'Study Note', important: true },
  { id: '2026-04-30', title: '04302026', date: '2026-04-30', month: 'April 2026', category: 'Study Note' },
  { id: '2026-05-06', title: '05062026', date: '2026-05-06', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-07', title: '05072026', date: '2026-05-07', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-08', title: '05082026', date: '2026-05-08', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-11', title: '05112026', date: '2026-05-11', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-12', title: '05122026', date: '2026-05-12', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-13', title: '05132026', date: '2026-05-13', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-14', title: '05142026', date: '2026-05-14', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-15', title: '05152026', date: '2026-05-15', month: 'May 2026', category: 'Study Note', important: true },
  { id: '2026-05-18', title: '05182026', date: '2026-05-18', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-19', title: '05192026', date: '2026-05-19', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-20', title: '05202026', date: '2026-05-20', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-21', title: '05212026', date: '2026-05-21', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-22', title: '05222026', date: '2026-05-22', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-26', title: '05262026', date: '2026-05-26', month: 'May 2026', category: 'Study Note' },
  { id: '2026-05-27', title: '05272026', date: '2026-05-27', month: 'May 2026', category: 'Study Note' },
  {
    id: '2026-05-28',
    title: '05282026',
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
  },
  { id: '2026-05-29', title: '05292026', date: '2026-05-29', month: 'May 2026', category: 'Study Note' },
];

export const notes: Note[] = rawNotes.map((note) => ({
  summary: note.summary ?? `${note.title} study note. Markdown content can be migrated from the original Notion page.`,
  content: note.content ?? buildDefaultContent(note),
  tags: note.tags ?? [note.category, note.month.replace(' 2026', '')],
  ...note,
}));
