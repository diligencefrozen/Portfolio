import type { Locale } from '../lib/locale';

export type CareerItem = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
};

export const careerItemsByLocale: Record<Locale, CareerItem[]> = {
  en: [
    {
      company: 'Personal Project',
      role: 'Built and Maintained DCinside Gallery Blocker',
      period: '2025-2026',
      location: 'Chrome Extension',
      summary:
        'Developed a lightweight Chrome extension that gives DCinside users more control over unwanted galleries, posts, comments, users, images, and DCCon content.',
      achievements: [
        'Implemented content-blocking logic that reacts to dynamic DOM changes in SPA-like browsing environments.',
        'Built filtering features for gallery access, Real-Time Best sections, posts, comments, users, images, and DCCon content.',
        'Designed a local-first architecture that runs only on DCinside pages and does not depend on external servers.',
      ],
    },
  ],
  ko: [
    {
      company: 'Personal Project',
      role: 'DCinside Gallery Blocker 개발 및 유지보수',
      period: '2025-2026',
      location: 'Chrome Extension',
      summary:
        '디시인사이드 사용자가 원하지 않는 갤러리, 게시글, 댓글, 유저, 이미지, 디시콘 노출을 직접 제어할 수 있도록 가벼운 Chrome 확장 프로그램을 개발했습니다.',
      achievements: [
        'SPA에 가까운 동적 탐색 환경에서 DOM 변화를 감지하고 사용자 설정을 반영하는 콘텐츠 차단 로직을 구현했습니다.',
        '갤러리 접근 차단, 실시간 베스트 숨김, 게시글,댓글,유저,이미지,디시콘 필터링 기능을 구성했습니다.',
        '외부 서버에 의존하지 않고 디시인사이드 페이지에서만 동작하는 로컬 중심 구조로 설계했습니다.',
      ],
    },
  ],
};

export const careerItems = careerItemsByLocale.en;
