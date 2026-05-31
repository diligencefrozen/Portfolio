import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
const OUTPUT_FILE = path.join(process.cwd(), 'public/project-live-metrics.json');

const DEFAULT_CHROME_WEB_STORE = {
  status: 'fallback',
  sourceUrl: `${STORE_URL}/reviews?hl=ko`,
  category: '확장 프로그램',
  subcategory: '도구',
  userCount: 448,
  rating: 4.7,
  ratingCount: 9,
  reviews: [],
};

const DEFAULT_GITHUB = {
  status: 'fallback',
  repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
  sourceUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
  commitCount: 449,
  latestCommitAt: '2026-05-31T00:00:00.000Z',
  latestCommitMessage: 'Active maintenance',
  latestCommitUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commits/main`,
};

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

function numberFromText(value) {
  if (!value) return null;
  const numeric = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(numeric) ? numeric : null;
}

function firstNumber(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = numberFromText(match?.[1]);
    if (value !== null) return value;
  }

  return null;
}

function removeUndefinedEntries(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined));
}

function normalizePreviousMetrics(raw) {
  if (!raw || typeof raw !== 'object') {
    return { schemaVersion: 1, fetchedAt: null, projects: {} };
  }

  if (raw.projects && typeof raw.projects === 'object') {
    return {
      schemaVersion: raw.schemaVersion ?? 1,
      fetchedAt: raw.fetchedAt ?? null,
      projects: raw.projects,
    };
  }

  // Backward compatibility for the old script shape: { [PROJECT_ID]: { ... } }.
  return {
    schemaVersion: 1,
    fetchedAt: raw.updatedAt ?? null,
    projects: {
      [PROJECT_ID]: raw[PROJECT_ID] ?? {},
    },
  };
}

async function readPreviousMetrics() {
  try {
    const raw = await readFile(OUTPUT_FILE, 'utf8');
    return normalizePreviousMetrics(JSON.parse(raw));
  } catch {
    return { schemaVersion: 1, fetchedAt: null, projects: {} };
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'user-agent': 'Mozilla/5.0 (compatible; PortfolioStatsBot/1.0; +https://github.com/diligencefrozen/Portfolio)',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function parseChromeStorePage(html) {
  const text = cleanText(html);
  const userCount = firstNumber(text, [
    /([0-9][0-9,]*)\s*사용자/i,
    /([0-9][0-9,]*)\s*users/i,
  ]);
  const rating = firstNumber(text, [
    /평균 평점은 별점 5점 중\s*([0-9.]+)점입니다/i,
    /5점 만점에\s*([0-9.]+)점/i,
    /Average rating\s*([0-9.]+)\s*out of 5/i,
  ]);
  const ratingCount = firstNumber(text, [
    /평점\s*([0-9][0-9,]*)개/i,
    /([0-9][0-9,]*)\s*ratings/i,
  ]);

  return removeUndefinedEntries({
    category: text.includes('확장 프로그램') ? '확장 프로그램' : undefined,
    subcategory: text.includes('도구') || /Tools/i.test(text) ? '도구' : undefined,
    userCount: userCount ?? undefined,
    rating: rating ?? undefined,
    ratingCount: ratingCount ?? undefined,
  });
}

function parseReviewSignals(html, previousReviews = []) {
  const text = cleanText(html);
  const preservedReviews = Array.isArray(previousReviews) ? previousReviews : [];

  // Chrome Web Store review markup changes often. Preserve cached review objects,
  // and only mark them as recently seen when recognizable phrases are still present.
  return preservedReviews.map((review) => {
    if (!review?.text) return review;

    const recognizableSnippet = review.text.slice(0, 24);
    if (recognizableSnippet && text.includes(recognizableSnippet)) {
      return { ...review, lastSeenOnStore: new Date().toISOString() };
    }

    return review;
  });
}

async function fetchChromeStoreSnapshot(previousProject = {}) {
  const previousStore = previousProject.chromeWebStore ?? {};
  const fallback = {
    ...DEFAULT_CHROME_WEB_STORE,
    ...previousStore,
    status: 'fallback',
    reviews: Array.isArray(previousStore.reviews) ? previousStore.reviews : DEFAULT_CHROME_WEB_STORE.reviews,
  };

  try {
    const html = await fetchText(`${STORE_URL}?hl=ko`);
    const parsed = parseChromeStorePage(html);
    let reviews = fallback.reviews;

    for (const url of STORE_REVIEWS_URLS) {
      try {
        const reviewHtml = await fetchText(url);
        reviews = parseReviewSignals(reviewHtml, fallback.reviews);
        break;
      } catch {
        // Chrome Web Store routes change often. Keep cached reviews if route fetching fails.
      }
    }

    const hasParsedMetric = ['userCount', 'rating', 'ratingCount'].some((key) => typeof parsed[key] === 'number');

    return removeUndefinedEntries({
      ...fallback,
      ...parsed,
      status: hasParsedMetric ? 'ok' : 'fallback',
      sourceUrl: `${STORE_URL}/reviews?hl=ko`,
      reviews,
      error: hasParsedMetric ? undefined : 'Chrome Web Store metrics were not found in the fetched page HTML.',
    });
  } catch (error) {
    return {
      ...fallback,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function parseLastPageFromLinkHeader(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
  return match?.[1] ? Number(match[1]) : null;
}

async function fetchGithubSnapshot(previousProject = {}) {
  const previousGithub = previousProject.github ?? {};
  const fallback = {
    ...DEFAULT_GITHUB,
    ...previousGithub,
    status: 'fallback',
  };

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`;
    const headers = {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'PortfolioStatsBot/1.0',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const commits = await response.json();
    const latestCommit = Array.isArray(commits) ? commits[0] : null;
    const commitCount = parseLastPageFromLinkHeader(response.headers.get('link')) ?? fallback.commitCount;

    return removeUndefinedEntries({
      ...fallback,
      status: 'ok',
      repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      sourceUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
      commitCount,
      latestCommitAt: latestCommit?.commit?.committer?.date ?? fallback.latestCommitAt,
      latestCommitMessage: latestCommit?.commit?.message?.split('\n')[0] ?? fallback.latestCommitMessage,
      latestCommitUrl: latestCommit?.html_url ?? fallback.latestCommitUrl,
      error: undefined,
    });
  } catch (error) {
    return {
      ...fallback,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const previous = await readPreviousMetrics();
  const previousProject = previous.projects?.[PROJECT_ID] ?? {};

  const nextProject = {
    ...previousProject,
    chromeWebStore: await fetchChromeStoreSnapshot(previousProject),
    github: await fetchGithubSnapshot(previousProject),
  };

  const next = {
    schemaVersion: 1,
    fetchedAt: new Date().toISOString(),
    projects: {
      ...previous.projects,
      [PROJECT_ID]: nextProject,
    },
  };

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`[sync-project-stats] Wrote ${OUTPUT_FILE}`);
}

await main();
