export type Note = {
  title: string;
  category: string;
  date: string;
  summary: string;
  tags: string[];
  url?: string;
};

export const notes: Note[] = [
  {
    title: 'Handling Content Blocking in Dynamic DOM Environments',
    category: 'Browser Extension',
    date: '2026-05-31',
    summary:
      'Explored how to reliably hide galleries, posts, comments, users, images, and DCCon elements based on user settings in pages where the DOM changes dynamically.',
    tags: ['JavaScript', 'DOM', 'MutationObserver'],
  },
  {
    title: 'Chrome Extension Structure and Permission Design',
    category: 'Extension',
    date: '2026-05-31',
    summary:
      'Organized the extension into manifest, content scripts, popup/options pages, and local storage while keeping the permission scope focused and minimal.',
    tags: ['Chrome Extension', 'Manifest', 'Storage'],
  },
  {
    title: 'Java/Spring Web Application Flow',
    category: 'Backend',
    date: '2026-05-31',
    summary:
      'Studied the flow of a Spring-based web application through Controller, Service, Mapper, and Database layers, including MyBatis integration points.',
    tags: ['Java', 'Spring MVC', 'MyBatis'],
  },
  {
    title: 'SQL and Database Integration Notes',
    category: 'Database',
    date: '2026-05-31',
    summary:
      'Reviewed table design, CRUD operations, SQL query writing, and web application integration using MySQL and Oracle.',
    tags: ['MySQL', 'Oracle', 'SQL'],
  },
];
