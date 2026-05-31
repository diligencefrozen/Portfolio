import type { Locale } from '../lib/locale';

export type ResumeContent = {
  title: string;
  intro: string;
  highlights: string[];
  fileName: string;
};

export const resumeByLocale: Record<Locale, ResumeContent> = {
  en: {
    title: 'Resume',
    intro:
      'A concise overview of my developer profile, project experience, technical skills, and areas of interest.',
    highlights: [
      'Target Role: Entry-Level Software Developer',
      'Main Project: DCinside Gallery Blocker - Chrome extension development and maintenance',
      'Core Experience: Dynamic DOM handling, content filtering, Chrome Extension architecture, browser storage, and user-facing problem solving',
      'Interests: Product usability, browser automation, content-control tools, and practical software development',
      'Skills: JavaScript, HTML5, CSS3, Python, Java, Spring Framework, Spring MVC, MyBatis, Oracle, MySQL',
    ],
    fileName: 'resume.pdf',
  },
  ko: {
    title: '이력서',
    intro: '개발자 프로필, 프로젝트 경험, 기술 스택, 관심 분야를 간결하게 정리한 섹션입니다.',
    highlights: [
      '희망 직무: 신입 개발자',
      '대표 프로젝트: DCinside Gallery Blocker - Chrome 확장 프로그램 개발 및 유지보수',
      '핵심 경험: 동적 DOM 처리, 콘텐츠 필터링, Chrome Extension 구조, 브라우저 저장소, 사용자 문제 해결',
      '관심 분야: 제품 사용성, 브라우저 자동화, 콘텐츠 제어 도구, 실용적인 소프트웨어 개발',
      '기술 스택: JavaScript, HTML5, CSS3, Python, Java, Spring Framework, Spring MVC, MyBatis, Oracle, MySQL',
    ],
    fileName: 'resume.pdf',
  },
};

export const resume = resumeByLocale.en;
