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
    title: 'Portfolio Website',
    description: 'TypeScript, React, Vite, Tailwind CSS로 만든 개인 포트폴리오 사이트입니다.',
    impact: 'GitHub Pages에 자동 배포되는 정적 사이트 구조를 구현했습니다.',
    stack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'GitHub Actions'],
    githubUrl: 'https://github.com/your-id/portfolio',
    liveUrl: 'https://your-id.github.io/portfolio',
  },
  {
    title: 'Business Landing Page',
    description: '미국 고객을 타깃으로 한 제품/서비스 소개 랜딩 페이지입니다.',
    impact: '명확한 CTA와 섹션 흐름으로 문의 전환을 목표로 설계했습니다.',
    stack: ['React', 'Copywriting', 'Responsive UI'],
  },
];
