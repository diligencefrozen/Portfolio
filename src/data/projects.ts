import type { Locale } from '../lib/locale';

export type Project = {
  title: string;
  description: string;
  impact: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

const stack = [
  'JavaScript',
  'Chrome Extension',
  'DOM',
  'MutationObserver',
  'Content Script',
  'Browser Storage',
  'HTML5',
  'CSS3',
];

export const projectsByLocale: Record<Locale, Project[]> = {
  en: [
    {
      title: 'DCinside Gallery Blocker',
      description:
        'A Chrome extension that helps DCinside users reduce unwanted exposure to galleries, posts, comments, users, images, and DCCon content. The project focuses on giving users more control over what they see while browsing.',
      impact:
        'Published and maintained as a Chrome extension. It includes gallery blocking, Real-Time Best hiding, post filtering, comment filtering, user blocking, image filtering, DCCon filtering, and automatic cleanup features.',
      stack,
      githubUrl: 'https://github.com/diligencefrozen/DCinside-Gallery-Blocker',
      liveUrl: 'https://chromewebstore.google.com/detail/fnfmdbldnhadkadklplhcjcojjiaopgg',
    },
  ],
  ko: [
    {
      title: 'DCinside Gallery Blocker',
      description:
        '디시인사이드 사용자가 탐색 중 원하지 않는 갤러리, 게시글, 댓글, 유저, 이미지, 디시콘 노출을 줄일 수 있도록 만든 Chrome 확장 프로그램입니다. 사용자가 직접 보는 콘텐츠를 제어할 수 있게 하는 데 초점을 맞췄습니다.',
      impact:
        'Chrome 확장 프로그램으로 배포 및 유지보수 중입니다. 갤러리 차단, 실시간 베스트 숨김, 게시글 필터링, 댓글 필터링, 유저 차단, 이미지 필터링, 디시콘 필터링, 자동 정리 기능을 포함합니다.',
      stack,
      githubUrl: 'https://github.com/diligencefrozen/DCinside-Gallery-Blocker',
      liveUrl: 'https://chromewebstore.google.com/detail/fnfmdbldnhadkadklplhcjcojjiaopgg',
    },
  ],
};

export const projects = projectsByLocale.en;
