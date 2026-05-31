import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ID = 'dcinside-gallery-blocker';
const EXTENSION_ID = 'fnfmdbldnhadkadklplhcjcojjiaopgg';
const STORE_URL = `https://chromewebstore.google.com/detail/${EXTENSION_ID}`;
const STORE_REVIEWS_URLS = [
  `https://chromewebstore.google.com/detail/${EXTENSION_ID}/reviews?hl=ko`,
  `https://chromewebstore.google.com/detail/%EB%94%94%EC%8B%9C%EA%B0%A4-%EC%B0%A8%EB%8B%A8%EA%B8%B0/${EXTENSION_ID}/reviews?hl=ko`,
  `https://chromewebstore.google.com/detail/%EB%94%94%EC%8B%9C%EA%B0%A4-%EC%B0%A8%EB%8B%A8%EA%B8%B0/${EXTENSION_ID}?hl=ko`,
];
const GITHUB_OWNER = 'diligencefrozen';
const GITHUB_REPO = 'DCinside-Gallery-Blocker';
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/projectLiveSnapshots.json');

function cleanText(value = '') {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function formatNumber(value) {
  if (!value) return '';
  return value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function readPreviousSnapshot() {
  try {
    const raw = await readFile(OUTPUT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'user-agent': 'Mozilla/5.0 (compatible; PortfolioStatsBot/1.0; +https://github.com/diligencefrozen/Portfolio)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function parseChromeStorePage(html, previous = {}) {
  const text = cleanText(html);
  const rating = firstMatch(text, [
    /평균 평점은 별점 5점 중\s*([0-9.]+)점입니다/i,
    /5점 만점에\s*([0-9.]+)점/i,
    /Average rating\s*([0-9.]+)\s*out of 5/i,
  ]);
  const ratingCount = firstMatch(text, [
    /평점\s*([0-9,]+)개/i,
    /([0-9,]+)\s*ratings/i,
  ]);
  const users = firstMatch(text, [
    /([0-9,]+)\s*사용자/i,
    /([0-9,]+)\s*users/i,
  ]);
  const isKoreanCategory = text.includes('확장 프로그램');
  const isToolCategory = text.includes('도구') || /Tools/i.test(text);

  return {
    users: users ? `${formatNumber(users)} users` : previous.users ?? 'Unknown users',
    usersKo: users ? `${formatNumber(users)} 사용자` : previous.usersKo ?? '사용자 수 확인 중',
    rating: rating ? `${rating} / 5.0` : previous.rating ?? 'Rating pending',
    ratingCount: ratingCount ? `${formatNumber(ratingCount)} ratings` : previous.ratingCount ?? 'Ratings pending',
    ratingCountKo: ratingCount ? `평점 ${formatNumber(ratingCount)}개` : previous.ratingCountKo ?? '평점 확인 중',
    category: isKoreanCategory ? 'Extensions' : previous.category ?? 'Extensions',
    categoryKo: isKoreanCategory ? '확장 프로그램' : previous.categoryKo ?? '확장 프로그램',
    subcategory: isToolCategory ? 'Productivity / Tools' : previous.subcategory ?? 'Productivity / Tools',
    subcategoryKo: isToolCategory ? '생산성 / 도구' : previous.subcategoryKo ?? '생산성 / 도구',
    sourceUrl: STORE_URL,
  };
}

function parseReviewSignals(html, previousReviews = []) {
  const text = cleanText(html);
  const signals = [];

  const knownSignals = [
    {
      id: 'keyword-hide-mode',
      keywords: ['키워드', '숨기기', '7.3.14.2026'],
      fallback: previousReviews.find((review) => review.id === 'keyword-hide-mode'),
    },
    {
      id: 'right-click-blocking',
      keywords: ['우클릭', '7.3.11.2026'],
      fallback: previousReviews.find((review) => review.id === 'right-click-blocking'),
    },
    {
      id: 'popup-trigger-fix',
      keywords: ['닉네임', '팝업', '7.3.12.2026'],
      fallback: previousReviews.find((review) => review.id === 'popup-trigger-fix'),
    },
  ];

  for (const signal of knownSignals) {
    const found = signal.keywords.some((keyword) => text.includes(keyword));
    if (found && signal.fallback) {
      signals.push({ ...signal.fallback, lastSeenOnStore: new Date().toISOString() });
    }
  }

  if (signals.length > 0) {
    return signals;
  }

  return previousReviews;
}

async function fetchChromeStoreSnapshot(previous = {}) {
  const html = await fetchText(`${STORE_URL}?hl=ko`);
  let reviewHtml = html;

  for (const url of STORE_REVIEWS_URLS) {
    try {
      reviewHtml = await fetchText(url);
      break;
    } catch {
      // Chrome Web Store routes change often, so keep trying known route shapes.
    }
  }

  return {
    chromeWebStore: parseChromeStorePage(html, previous.chromeWebStore),
    reviews: parseReviewSignals(reviewHtml, previous.reviews ?? []),
  };
}

function parseLastPageFromLinkHeader(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
  return match?.[1] ? Number(match[1]) : null;
}

async function fetchGithubSnapshot(previous = {}) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`;
  const response = await fetch(apiUrl, {
    headers: {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'PortfolioStatsBot/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub commits: ${response.status}`);
  }

  const commits = await response.json();
  const latestCommit = Array.isArray(commits) ? commits[0] : null;
  const latestCommitDate = latestCommit?.commit?.committer?.date
    ? latestCommit.commit.committer.date.slice(0, 10)
    : previous.latestCommitDate ?? 'Unknown';
  const commitCount = parseLastPageFromLinkHeader(response.headers.get('link')) ?? previous.commits?.match(/[0-9,]+/)?.[0] ?? 'Unknown';
  const formattedCommits = typeof commitCount === 'number' ? formatNumber(String(commitCount)) : commitCount;

  return {
    commits: `${formattedCommits} commits`,
    commitsKo: `${formattedCommits} Commits`,
    latestCommitDate,
    latestSignal: 'Active maintenance',
    latestSignalKo: '지속 유지보수 중',
    sourceUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
  };
}

async function main() {
  const previous = await readPreviousSnapshot();
  const previousProject = previous[PROJECT_ID] ?? {};

  const nextProject = {
    ...previousProject,
  };
  let didSync = false;

  try {
    const chromeSnapshot = await fetchChromeStoreSnapshot(previousProject);
    Object.assign(nextProject, chromeSnapshot);
    didSync = true;
  } catch (error) {
    console.warn(`[sync-project-stats] Chrome Web Store sync skipped: ${error.message}`);
  }

  try {
    nextProject.github = await fetchGithubSnapshot(previousProject.github);
    didSync = true;
  } catch (error) {
    console.warn(`[sync-project-stats] GitHub sync skipped: ${error.message}`);
  }

  if (didSync) {
    nextProject.updatedAt = new Date().toISOString();
  }

  const next = {
    ...previous,
    [PROJECT_ID]: nextProject,
  };

  await writeFile(OUTPUT_FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`[sync-project-stats] Wrote ${OUTPUT_FILE}`);
}

await main();
