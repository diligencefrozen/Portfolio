export type CareerItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
};

export const careerItems: CareerItem[] = [
  {
    company: 'Personal Project',
    role: 'Built and Maintained DCinside Gallery Blocker',
    period: '2026',
    location: 'Chrome Extension',
    summary:
      'Developed a lightweight Chrome extension that gives DCinside users more control over unwanted galleries, posts, comments, users, images, and DCCon content.',
    achievements: [
      'Implemented content-blocking logic that reacts to dynamic DOM changes in SPA-like browsing environments.',
      'Built filtering features for gallery access, Real-Time Best sections, posts, comments, users, images, and DCCon content.',
      'Designed a local-first architecture that runs only on DCinside pages and does not depend on external servers.',
    ],
  },
];
