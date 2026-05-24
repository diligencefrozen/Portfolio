# Portfolio Starter

TypeScript + React + Vite + Tailwind CSS로 만든 개발자 포트폴리오 뼈대입니다.

## 구조

```txt
src/
  components/        # 공통 UI 컴포넌트
  data/              # 프로필, 경력, 프로젝트, 노트, 이력서 데이터
  sections/          # Home, Career, Projects, Notes, Resume 섹션
  App.tsx
  main.tsx
  styles.css
public/
  resume.pdf         # 실제 이력서 PDF로 교체
.github/workflows/
  deploy.yml         # GitHub Pages 자동 배포
```

## 시작하기

```bash
npm install
npm run dev
```

## 수정해야 할 파일

1. `src/data/profile.ts`에서 이름, 역할, 이메일, GitHub, LinkedIn 링크 수정
2. `src/data/career.ts`에서 경력 수정
3. `src/data/projects.ts`에서 프로젝트 수정
4. `src/data/notes.ts`에서 공부 노트 수정
5. `public/resume.pdf`를 실제 이력서 파일로 교체

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

1. GitHub에 새 저장소 생성
2. 이 프로젝트 파일 업로드
3. Settings → Pages → Source를 `GitHub Actions`로 설정
4. `main` 브랜치에 push하면 자동 배포

`vite.config.ts`는 GitHub 저장소 이름을 기준으로 base path를 자동 설정합니다.
일반 저장소는 `/repository-name/`, `username.github.io` 저장소는 `/`로 배포됩니다.
