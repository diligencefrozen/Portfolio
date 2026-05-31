import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, RefreshCw, Star } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { projectsByLocale, type Project } from '../data/projects';
import { useLocale, type Locale } from '../lib/locale';

type LiveReview = {
  author: string;
  rating: number | null;
  date: string | null;
  text: string;
  helpfulText: string | null;
  developerReply: {
    author: string;
    date: string | null;
    text: string;
  } | null;
};

type LiveProjectMetric = {
  chromeWebStore?: {
    status?: string;
    sourceUrl?: string;
    category?: string | null;
    subcategory?: string | null;
    userCount?: number | null;
    rating?: number | null;
    ratingCount?: number | null;
    reviews?: LiveReview[];
  };
  github?: {
    status?: string;
    repo?: string;
    sourceUrl?: string;
    commitCount?: number | null;
    latestCommitAt?: string | null;
    latestCommitMessage?: string | null;
    latestCommitUrl?: string | null;
  };
};

type LiveMetricsPayload = {
  schemaVersion: number;
  fetchedAt: string;
  projects: Record<string, LiveProjectMetric>;
};

const projectsText: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    sourceCode: string;
    chromeWebStore: string;
    developmentActivity: string;
    techStack: string;
    highlights: string;
    feedbackTitle: string;
    feedbackDescription: string;
    userSignal: string;
    developerResponse: string;
    result: string;
    liveSync: string;
    lastSynced: string;
    users: string;
    rating: string;
    commits: string;
    updated: string;
    storeSource: string;
    githubSource: string;
    liveReviewsTitle: string;
    liveReviewsDescription: string;
    developerReply: string;
    helpful: string;
    noLiveReviews: string;
    fallbackNotice: string;
  }
> = {
  en: {
    kicker: 'Case Study',
    title: 'Product-Driven Project',
    description:
      'A focused project section that shows product adoption, development activity, and real feedback loops instead of only listing source code.',
    sourceCode: 'Source Code',
    chromeWebStore: 'Chrome Web Store',
    developmentActivity: 'Development activity',
    techStack: 'Tech stack',
    highlights: 'Implementation highlights',
    feedbackTitle: 'User feedback → release improvements',
    feedbackDescription:
      'These records show how real user reviews were converted into concrete product changes.',
    userSignal: 'User signal',
    developerResponse: 'Developer response',
    result: 'Result',
    liveSync: 'Live synced',
    lastSynced: 'Last synced',
    users: 'Users',
    rating: 'Rating',
    commits: 'Commits',
    updated: 'Updated',
    storeSource: 'Chrome Web Store data',
    githubSource: 'GitHub repository data',
    liveReviewsTitle: 'Live Chrome Web Store feedback',
    liveReviewsDescription:
      'The portfolio reads a generated JSON feed that is refreshed automatically by GitHub Actions, so user count, rating, reviews, and replies do not need manual edits.',
    developerReply: 'Developer reply',
    helpful: 'Helpful signal',
    noLiveReviews: 'Live reviews are temporarily unavailable. Static release notes are shown below as a fallback.',
    fallbackNotice: 'Showing the latest cached data while the next automatic sync runs.',
  },
  ko: {
    kicker: '사례 연구',
    title: '제품 중심 프로젝트',
    description:
      '단순히 소스 코드만 나열하지 않고, 실제 사용자 수·개발 활동·사용자 피드백 반영 기록까지 함께 보여주는 프로젝트 섹션입니다.',
    sourceCode: '소스 코드',
    chromeWebStore: 'Chrome Web Store',
    developmentActivity: '개발 활동',
    techStack: '기술 스택',
    highlights: '구현 포인트',
    feedbackTitle: '사용자 피드백 → 릴리즈 개선',
    feedbackDescription:
      '실제 사용자의 리뷰와 제안을 구체적인 제품 개선으로 연결한 기록입니다.',
    userSignal: '사용자 피드백',
    developerResponse: '개발 대응',
    result: '결과',
    liveSync: '자동 동기화',
    lastSynced: '마지막 동기화',
    users: '사용자',
    rating: '평점',
    commits: '커밋',
    updated: '최근 업데이트',
    storeSource: 'Chrome Web Store 데이터',
    githubSource: 'GitHub 저장소 데이터',
    liveReviewsTitle: 'Chrome Web Store 실사용자 피드백',
    liveReviewsDescription:
      '포트폴리오가 GitHub Actions로 자동 갱신되는 JSON 피드를 읽기 때문에 사용자 수, 평점, 리뷰, 개발자 답변을 매번 직접 수정할 필요가 없습니다.',
    developerReply: '개발자 답변',
    helpful: '유용함 표시',
    noLiveReviews: '실시간 리뷰 데이터를 잠시 불러올 수 없어 아래 정리된 릴리즈 개선 기록을 대신 표시합니다.',
    fallbackNotice: '다음 자동 동기화 전까지 최신 캐시 데이터를 표시합니다.',
  },
};

function formatNumber(value: number | null | undefined, locale: Locale) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : 'en-US').format(value);
}

function formatDate(value: string | null | undefined, locale: Locale) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatRating(value: number | null | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return `${value.toFixed(1)} / 5.0`;
}

function truncateText(value: string, maxLength = 360) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}…`;
}

function useProjectLiveMetrics() {
  const [payload, setPayload] = useState<LiveMetricsPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMetrics() {
      try {
        const response = await fetch(`/project-live-metrics.json?ts=${Date.now()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as LiveMetricsPayload;
        setPayload(data);
      } catch {
        // The project still renders with curated fallback data when the live feed is unavailable.
      }
    }

    loadMetrics();

    return () => controller.abort();
  }, []);

  return payload;
}

function ProjectMetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function LiveReviewCard({ review, text }: { review: LiveReview; text: (typeof projectsText)['en'] }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-base font-black text-slate-950">{review.author}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
            {typeof review.rating === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                <Star size={14} fill="currentColor" /> {review.rating.toFixed(1)}
              </span>
            )}
            {review.date && <span>{review.date}</span>}
          </div>
        </div>
        {review.helpfulText && (
          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {text.helpful}: {review.helpfulText}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{truncateText(review.text)}</p>

      {review.developerReply && (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{text.developerReply}</p>
          <p className="mt-2 text-sm font-bold text-slate-950">
            {review.developerReply.author}
            {review.developerReply.date ? ` · ${review.developerReply.date}` : ''}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{truncateText(review.developerReply.text)}</p>
        </div>
      )}
    </article>
  );
}

function ProjectCard({
  project,
  text,
  locale,
  liveMetrics,
  metricsFetchedAt,
}: {
  project: Project;
  text: (typeof projectsText)['en'];
  locale: Locale;
  liveMetrics?: LiveProjectMetric;
  metricsFetchedAt?: string;
}) {
  const chromeWebStore = liveMetrics?.chromeWebStore;
  const github = liveMetrics?.github;

  const category = chromeWebStore?.category ?? project.store.category;
  const subcategory = chromeWebStore?.subcategory ?? project.store.subcategory;
  const users = chromeWebStore?.userCount
    ? `${formatNumber(chromeWebStore.userCount, locale)} ${locale === 'ko' ? '사용자' : 'users'}`
    : project.store.users;
  const rating = formatRating(chromeWebStore?.rating) ?? project.store.rating;
  const ratingCount = chromeWebStore?.ratingCount
    ? `${locale === 'ko' ? '평점 ' : ''}${formatNumber(chromeWebStore.ratingCount, locale)}${locale === 'ko' ? '개' : ' ratings'}`
    : project.store.reviews;
  const commits = github?.commitCount
    ? `${formatNumber(github.commitCount, locale)} ${locale === 'ko' ? '커밋' : 'commits'}`
    : project.activity.commits;
  const latestUpdate = formatDate(github?.latestCommitAt, locale) ?? project.activity.snapshotDate;
  const liveReviews = useMemo(() => chromeWebStore?.reviews?.filter((review) => review.text).slice(0, 6) ?? [], [chromeWebStore?.reviews]);
  const isLiveSynced = chromeWebStore?.status === 'ok' || github?.status === 'ok';

  return (
    <article className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/80 to-slate-50 p-7 sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {category}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                {subcategory}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                <RefreshCw size={13} /> {text.liveSync}
              </span>
            </div>

            <h3 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {project.title}
            </h3>
            <p className="mt-3 text-lg font-bold text-blue-700">{project.subtitle}</p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">{project.description}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm lg:w-80">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">
              {text.lastSynced}
            </p>
            <p className="mt-3 text-sm font-bold text-slate-950">{formatDate(metricsFetchedAt ?? project.store.snapshotDate, locale)}</p>
            <p className="mt-1 text-sm text-slate-500">
              {isLiveSynced ? `${text.storeSource} · ${text.githubSource}` : text.fallbackNotice}
            </p>
            <p className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold leading-6 text-white">
              {project.impact}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-black">
          {project.githubUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              {text.sourceCode} <ArrowUpRight size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              {text.chromeWebStore} <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-8 p-7 sm:p-9">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProjectMetricCard label={text.users} value={users} detail={subcategory} />
          <ProjectMetricCard label={text.rating} value={rating} detail={ratingCount} />
          <ProjectMetricCard label={text.commits} value={commits} detail={github?.latestCommitMessage ?? project.activity.latestSignal} />
          <ProjectMetricCard label={text.updated} value={latestUpdate} detail={text.githubSource} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-black text-slate-950">{text.developmentActivity}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{project.activity.note}</p>

            <div className="mt-6">
              <p className="text-sm font-black text-slate-950">{text.techStack}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6">
            <p className="text-sm font-black text-blue-950">{text.highlights}</p>
            <ul className="mt-4 grid gap-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-white p-4 text-sm font-medium leading-7 text-slate-700 shadow-sm">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black text-slate-950">{text.liveReviewsTitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{text.liveReviewsDescription}</p>
            </div>
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              {chromeWebStore?.status ?? 'fallback'}
            </span>
          </div>

          {liveReviews.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {liveReviews.map((review) => (
                <LiveReviewCard key={`${review.author}-${review.date}-${review.text.slice(0, 24)}`} review={review} text={text} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600 shadow-sm">{text.noLiveReviews}</p>
          )}
        </section>

        <section>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black text-slate-950">{text.feedbackTitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{text.feedbackDescription}</p>
            </div>
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Product loop
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {project.feedbackLoops.map((loop, index) => (
              <article key={`${project.id}-${loop.version}`} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-black text-slate-950">{loop.title}</h4>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {loop.version}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-500">{loop.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{text.userSignal}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.userSignal}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">{text.developerResponse}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.developerResponse}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">{text.result}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{loop.result}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export function Projects() {
  const { locale } = useLocale();
  const projects = projectsByLocale[locale];
  const text = projectsText[locale];
  const liveMetrics = useProjectLiveMetrics();

  return (
    <section id="projects" className="section-shell">
      <SectionHeading kicker={text.kicker} title={text.title} description={text.description} />

      <div className="mt-12 grid gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            text={text}
            locale={locale}
            liveMetrics={liveMetrics?.projects?.[project.id]}
            metricsFetchedAt={liveMetrics?.fetchedAt}
          />
        ))}
      </div>
    </section>
  );
}
