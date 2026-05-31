import type { Locale } from '../lib/locale';

export type Profile = {
  name: string;
  role: string;
  location: string;
  headline: string;
  summary: string;
  email: string;
  emailDisplay: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
};

export const profiles: Record<Locale, Profile> = {
  en: {
    name: 'Jeesung Kahng',
    role: 'Entry-Level Software Developer',
    location: 'Gyeonggi-do, South Korea',
    headline: 'I build practical software that gives users more control.',
    summary:
      'I am an entry-level software developer who enjoys finding real user-facing problems and turning them into working products. My main project experience comes from building and maintaining a Chrome extension that handles dynamic DOM changes, content filtering, browser storage, and practical usability issues.',
    email: '',
    emailDisplay: 'adg***********@gmail.com',
    github: 'https://github.com/diligencefrozen',
    linkedin: '',
    resumeUrl: '/resume.pdf',
  },
  ko: {
    name: '강지성',
    role: '신입 개발자',
    location: '경기, 대한민국',
    headline: '사용자가 더 직접적으로 통제할 수 있는 실용적인 소프트웨어를 만듭니다.',
    summary:
      '저는 사용자가 실제 서비스에서 겪는 불편함을 발견하고, 이를 작동하는 제품으로 구현하는 신입 개발자입니다. 대표 프로젝트로는 동적 DOM 변화, 콘텐츠 필터링, 브라우저 저장소, 실제 사용성 문제를 다룬 Chrome 확장 프로그램 DCinside Gallery Blocker를 개발하고 유지보수한 경험이 있습니다.',
    email: '',
    emailDisplay: 'adg***********@gmail.com',
    github: 'https://github.com/diligencefrozen',
    linkedin: '',
    resumeUrl: '/resume.pdf',
  },
};

export const skillsByLocale: Record<Locale, string[]> = {
  en: [
    'JavaScript',
    'HTML5',
    'CSS3',
    'DOM',
    'Chrome Extension',
    'Content Script',
    'Browser Storage',
    'GitHub',
    'jQuery',
    'Python',
    'Java',
    'Spring Framework',
    'Spring MVC',
    'MyBatis',
    'API',
    'Oracle',
    'MySQL',
  ],
  ko: [
    'JavaScript',
    'HTML5',
    'CSS3',
    'DOM',
    'Chrome Extension',
    'Content Script',
    'Browser Storage',
    'GitHub',
    'jQuery',
    'Python',
    'Java',
    'Spring Framework',
    'Spring MVC',
    'MyBatis',
    'API',
    'Oracle',
    'MySQL',
  ],
};

export const coreStrengthsByLocale: Record<Locale, string[]> = {
  en: [
    'I notice frustrating UI and content-exposure problems from a user perspective and turn them into working features.',
    'I analyze dynamic DOM structures and improve browser-based features so they work reliably in real usage environments.',
    'I combine front-end implementation experience with Java, Spring, and database fundamentals to understand broader service flows.',
  ],
  ko: [
    '사용자 관점에서 UI와 콘텐츠 노출 문제를 발견하고, 이를 실제 기능으로 구현합니다.',
    '동적으로 변하는 DOM 구조를 분석하고, 실제 사용 환경에서도 안정적으로 동작하는 브라우저 기능을 개선합니다.',
    '프론트엔드 구현 경험과 Java, Spring, 데이터베이스 기초를 함께 이해하여 서비스 흐름을 넓게 파악합니다.',
  ],
};

export const profile = profiles.en;
export const skills = skillsByLocale.en;
export const coreStrengths = coreStrengthsByLocale.en;
