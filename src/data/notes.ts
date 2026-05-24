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
    title: 'React 컴포넌트 설계 원칙',
    category: 'Frontend',
    date: '2026-05-25',
    summary: '재사용 가능한 컴포넌트 구조, props 설계, 상태 분리 기준을 정리한 노트입니다.',
    tags: ['React', 'Architecture', 'Components'],
  },
  {
    title: 'Tailwind CSS 디자인 시스템 메모',
    category: 'UI',
    date: '2026-05-25',
    summary: '색상, 간격, 타이포그래피를 일관되게 운영하기 위한 Tailwind 사용 패턴을 정리했습니다.',
    tags: ['Tailwind CSS', 'Design System'],
  },
  {
    title: 'GitHub Pages 배포 체크리스트',
    category: 'Deployment',
    date: '2026-05-25',
    summary: 'Vite 프로젝트를 GitHub Pages에 올릴 때 확인해야 할 base path와 Actions 설정을 정리했습니다.',
    tags: ['Vite', 'GitHub Pages', 'CI/CD'],
  },
];
