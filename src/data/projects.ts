export type Project = {
  title: string;
  description: string;
  impact: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    title: 'DCinside Gallery Blocker',
    description:
      'A Chrome extension that helps DCinside users reduce unwanted exposure to galleries, posts, comments, users, images, and DCCon content. The project focuses on giving users more control over what they see while browsing.',
    impact:
      'Published and maintained as a Chrome extension. It includes gallery blocking, Real-Time Best hiding, post filtering, comment filtering, user blocking, image filtering, DCCon filtering, and automatic cleanup features.',
    stack: [
      'JavaScript',
      'Chrome Extension',
      'DOM',
      'MutationObserver',
      'Content Script',
      'Browser Storage',
      'HTML5',
      'CSS3',
    ],
    githubUrl: 'https://github.com/diligencefrozen/DCinside-Gallery-Blocker',
    liveUrl: 'https://chromewebstore.google.com/detail/fnfmdbldnhadkadklplhcjcojjiaopgg',
  },
];
