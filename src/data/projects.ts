import type { Locale } from '../lib/locale';

export type ProjectStoreSnapshot = {
  category: string;
  subcategory: string;
  users: string;
  rating: string;
  reviews: string;
  sourceLabel: string;
  snapshotDate: string;
};

export type ProjectActivitySnapshot = {
  commits: string;
  latestSignal: string;
  sourceLabel: string;
  snapshotDate: string;
  note: string;
};

export type ProjectFeedbackLoop = {
  date: string;
  version: string;
  title: string;
  userSignal: string;
  developerResponse: string;
  result: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  impact: string;
  stack: string[];
  highlights: string[];
  store: ProjectStoreSnapshot;
  activity: ProjectActivitySnapshot;
  feedbackLoops: ProjectFeedbackLoop[];
  githubUrl?: string;
  liveUrl?: string;
};

const chromeExtensionStack = [
  'JavaScript',
  'Chrome Extension',
  'DOM',
  'MutationObserver',
  'Content Script',
  'Browser Storage',
  'HTML5',
  'CSS3',
];

const projectLinks = {
  githubUrl: 'https://github.com/diligencefrozen/DCinside-Gallery-Blocker',
  liveUrl: 'https://chromewebstore.google.com/detail/fnfmdbldnhadkadklplhcjcojjiaopgg',
};

// To add another project later:
// 1. Copy one project object inside both `en` and `ko` arrays.
// 2. Keep a unique `id` value.
// 3. Update `store`, `activity`, `feedbackLoops`, `stack`, and links.
// 4. The Projects section will render the new project automatically.
export const projectsByLocale: Record<Locale, Project[]> = {
  en: [
    {
      id: 'dcinside-gallery-blocker',
      title: 'DCinside Gallery Blocker',
      subtitle: 'Chrome extension for user-controlled content filtering',
      description:
        'A Chrome extension that helps DCinside users reduce unwanted exposure to galleries, posts, comments, users, images, and DCCon content. The project focuses on giving users direct control over what appears while browsing.',
      impact:
        'The product is not just a demo. It is published, used by real users, and actively improved through Chrome Web Store reviews, bug reports, and feature requests.',
      stack: chromeExtensionStack,
      highlights: [
        'Built filtering logic for dynamic DOM updates in real browsing environments.',
        'Designed local-first settings and blocking behavior without relying on an external server.',
        'Converted user reviews into release improvements such as hide mode, compact mode, and targeted bug fixes.',
      ],
      store: {
        category: 'Extensions',
        subcategory: 'Productivity / Tools',
        users: '448 users',
        rating: '4.7 / 5.0',
        reviews: '9 ratings',
        sourceLabel: 'Chrome Web Store snapshot',
        snapshotDate: '2026-05-31',
      },
      activity: {
        commits: '449 commits',
        latestSignal: 'Active maintenance',
        sourceLabel: 'GitHub repository snapshot',
        snapshotDate: '2026-05-31',
        note: 'Frequent commits and release responses show that the project is maintained as a real product rather than a static portfolio item.',
      },
      feedbackLoops: [
        {
          date: '2026-05-23',
          version: '7.3.14.2026',
          title: 'Keyword hide mode',
          userSignal:
            'A user said full post blocking was inconvenient because a single blocked keyword could hide the entire post or comment.',
          developerResponse:
            'Added a keyword “hide” mode so blocked content can be hidden first instead of being permanently removed from the user flow.',
          result:
            'Users gained a softer filtering option that preserves control and allows hidden content to be checked again when needed.',
        },
        {
          date: '2026-05-17',
          version: '7.3.11.2026',
          title: 'Faster right-click blocking',
          userSignal:
            'A user requested direct right-click blocking without opening an extra settings step, plus more granular keyword controls.',
          developerResponse:
            'Improved the interaction so hovering over a nickname and right-clicking can block the user more quickly, and reviewed keyword scope controls for title, body, and comments.',
          result:
            'The blocking flow became closer to the user’s natural browsing behavior and reduced unnecessary friction.',
        },
        {
          date: '2026-05-18',
          version: '7.3.12.2026',
          title: 'Bug fix from review feedback',
          userSignal:
            'After an update, a user reported that the right-click blocking popup appeared even when hovering over areas outside the nickname.',
          developerResponse:
            'Reproduced the issue and adjusted the trigger so the popup appears only when the nickname area is targeted.',
          result:
            'A user-reported regression was identified, fixed, and turned into a more precise interaction rule.',
        },
        {
          date: '2026-04-19',
          version: '7.3.9.2026',
          title: 'Compact mode',
          userSignal:
            'A user suggested reducing vertical spacing between gallery posts to improve scanability.',
          developerResponse:
            'Added an optional compact mode instead of forcing the layout change on every user.',
          result:
            'The product gained a preference-based UX improvement while keeping the default experience stable.',
        },
        {
          date: '2026-03-22',
          version: '7.3.4.2026',
          title: 'Auto-refresh behavior fix',
          userSignal:
            'A user reported that auto-refresh interrupted long-form reading on post view pages.',
          developerResponse:
            'Fixed the behavior so auto-refresh does not unexpectedly run inside post view pages.',
          result:
            'The extension became safer for real reading sessions and better aligned with user intent.',
        },
      ],
      ...projectLinks,
    },
  ],
  ko: [
    {
      id: 'dcinside-gallery-blocker',
      title: 'DCinside Gallery Blocker',
      subtitle: '사용자가 직접 콘텐츠 노출을 제어하는 Chrome 확장 프로그램',
      description:
        '디시인사이드 사용자가 탐색 중 원하지 않는 갤러리, 게시글, 댓글, 유저, 이미지, 디시콘 노출을 줄일 수 있도록 만든 Chrome 확장 프로그램입니다. 사용자가 실제로 보는 콘텐츠를 직접 제어할 수 있게 하는 데 초점을 맞췄습니다.',
      impact:
        '단순 데모가 아니라 Chrome Web Store에 배포되어 실제 사용자가 쓰고 있으며, 리뷰·버그 리포트·기능 요청을 바탕으로 계속 개선하고 있는 제품입니다.',
      stack: chromeExtensionStack,
      highlights: [
        '실제 브라우징 환경의 동적 DOM 변화에 대응하는 필터링 로직을 구현했습니다.',
        '외부 서버 의존 없이 로컬 설정 중심으로 빠르게 동작하는 차단 구조를 설계했습니다.',
        '사용자 리뷰를 숨기기 모드, 컴팩트 모드, 버그 수정 같은 실제 릴리즈 개선으로 연결했습니다.',
      ],
      store: {
        category: '확장 프로그램',
        subcategory: '생산성 / 도구',
        users: '448 사용자',
        rating: '4.7 / 5.0',
        reviews: '평점 9개',
        sourceLabel: 'Chrome Web Store 스냅샷',
        snapshotDate: '2026-05-31',
      },
      activity: {
        commits: '449 Commits',
        latestSignal: '지속 유지보수 중',
        sourceLabel: 'GitHub 저장소 스냅샷',
        snapshotDate: '2026-05-31',
        note: '커밋과 릴리즈 대응 기록을 통해 정적인 포트폴리오용 예제가 아니라 실제 제품처럼 운영 중인 프로젝트임을 보여줍니다.',
      },
      feedbackLoops: [
        {
          date: '2026-05-23',
          version: '7.3.14.2026',
          title: '키워드 숨기기 모드',
          userSignal:
            '사용자가 차단 키워드 하나 때문에 게시글이나 댓글 전체가 가려지는 흐름이 불편하다고 피드백했습니다.',
          developerResponse:
            '키워드가 포함된 콘텐츠를 무조건 차단하기보다 먼저 숨기고, 필요할 때 다시 확인할 수 있는 숨기기 모드를 추가했습니다.',
          result:
            '사용자가 차단 강도를 더 유연하게 선택할 수 있게 되었고, 실제 탐색 흐름의 부담을 줄였습니다.',
        },
        {
          date: '2026-05-17',
          version: '7.3.11.2026',
          title: '우클릭 즉시 차단 개선',
          userSignal:
            '사용자가 설정 열기 과정을 거치지 않고 우클릭으로 바로 차단하고 싶다는 의견과 키워드 범위 세분화 요청을 남겼습니다.',
          developerResponse:
            '닉네임 위에 마우스를 올린 상태에서 우클릭하면 더 빠르게 사용자를 차단할 수 있도록 흐름을 개선하고, 제목·본문·댓글 단위 키워드 제어도 함께 검토했습니다.',
          result:
            '차단 동작이 사용자의 실제 브라우징 습관에 더 가까워졌고, 불필요한 조작 단계를 줄였습니다.',
        },
        {
          date: '2026-05-18',
          version: '7.3.12.2026',
          title: '리뷰 기반 버그 수정',
          userSignal:
            '업데이트 이후 닉네임이 아닌 댓글창 다른 영역에서도 우클릭 차단 팝업이 뜬다는 제보가 있었습니다.',
          developerResponse:
            '문제를 재현하고 원인을 확인한 뒤, 닉네임 영역을 대상으로 할 때만 팝업이 표시되도록 트리거 조건을 수정했습니다.',
          result:
            '사용자가 남긴 회귀 버그를 빠르게 수정했고, 상호작용 조건을 더 정확하게 다듬었습니다.',
        },
        {
          date: '2026-04-19',
          version: '7.3.9.2026',
          title: '컴팩트 모드 추가',
          userSignal:
            '갤러리 게시물 사이의 위아래 간격을 줄이면 가시성이 좋아질 것 같다는 제안이 있었습니다.',
          developerResponse:
            '모든 사용자에게 강제 적용하지 않고, 원하는 사용자만 켤 수 있는 선택형 컴팩트 모드를 추가했습니다.',
          result:
            '기본 경험은 유지하면서도 선호에 따라 더 촘촘한 화면을 사용할 수 있게 되었습니다.',
        },
        {
          date: '2026-03-22',
          version: '7.3.4.2026',
          title: '자동 새로고침 동작 수정',
          userSignal:
            '긴 글을 읽는 도중 자동 새로고침이 발생해 흐름이 끊긴다는 피드백이 있었습니다.',
          developerResponse:
            '게시글 상세 페이지에서는 자동 새로고침이 예기치 않게 동작하지 않도록 수정했습니다.',
          result:
            '읽기 흐름을 방해하지 않는 방향으로 기능 안정성을 개선했습니다.',
        },
      ],
      ...projectLinks,
    },
  ],
};

export const projects = projectsByLocale.en;
