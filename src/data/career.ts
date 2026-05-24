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
    company: 'Your Company / Client',
    role: 'Frontend Developer',
    period: '2025 — Present',
    location: 'Remote',
    summary: 'React 기반 랜딩 페이지와 관리자 화면을 구축했습니다.',
    achievements: [
      '컴포넌트 단위로 UI를 분리해 유지보수성을 개선',
      'Tailwind CSS 디자인 토큰으로 일관된 스타일 시스템 구성',
      'GitHub Actions 기반 정적 배포 흐름 정리',
    ],
  },
  {
    company: 'Previous Experience',
    role: 'Business Operator / Product Builder',
    period: '2023 — 2025',
    location: 'Seoul',
    summary: '미국 고객을 타깃으로 한 비즈니스 운영과 웹사이트 개선을 담당했습니다.',
    achievements: [
      '고객 관점의 문구, 레이아웃, CTA 구조 개선',
      '시장 반응을 기반으로 페이지 콘텐츠 반복 개선',
      '제품 소개 페이지와 문의 흐름 최적화',
    ],
  },
];
