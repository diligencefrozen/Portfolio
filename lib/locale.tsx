/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'en' | 'ko';

type LocaleSource = 'ip' | 'manual' | 'fallback';

type LocaleContextValue = {
  locale: Locale;
  localeSource: LocaleSource;
  setLocale: (nextLocale: Locale) => void;
  resetLocaleDetection: () => void;
};

const LOCALE_STORAGE_KEY = 'portfolio:locale-preference';
const GEOLOCATION_ENDPOINT = 'https://ipapi.co/json/';

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'ko';
}

function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(storedLocale) ? storedLocale : null;
}

function getBrowserFallbackLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const languages = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((language) => language.toLowerCase());

  if (languages.some((language) => language.startsWith('ko'))) {
    return 'ko';
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone === 'Asia/Seoul') {
      return 'ko';
    }
  } catch {
    return 'en';
  }

  return 'en';
}

function readCountryCode(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const record = payload as Record<string, unknown>;
  const value = record.country_code ?? record.country;

  return typeof value === 'string' ? value.toUpperCase() : '';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const storedLocale = readStoredLocale();
  const [locale, setLocaleState] = useState<Locale>(storedLocale ?? getBrowserFallbackLocale);
  const [localeSource, setLocaleSource] = useState<LocaleSource>(storedLocale ? 'manual' : 'fallback');

  useEffect(() => {
    document.documentElement.lang = locale === 'ko' ? 'ko' : 'en';
  }, [locale]);

  useEffect(() => {
    if (readStoredLocale()) {
      return undefined;
    }

    const controller = new AbortController();

    async function detectCountry() {
      try {
        const response = await fetch(GEOLOCATION_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          return;
        }

        const payload: unknown = await response.json();
        const countryCode = readCountryCode(payload);

        if (countryCode === 'KR') {
          setLocaleState('ko');
          setLocaleSource('ip');
          return;
        }

        setLocaleState(getBrowserFallbackLocale());
        setLocaleSource('fallback');
      } catch {
        setLocaleState(getBrowserFallbackLocale());
        setLocaleSource('fallback');
      }
    }

    detectCountry();

    return () => controller.abort();
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    setLocaleSource('manual');
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const resetLocaleDetection = useCallback(() => {
    window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    const fallbackLocale = getBrowserFallbackLocale();
    setLocaleState(fallbackLocale);
    setLocaleSource('fallback');
  }, []);

  const value = useMemo(
    () => ({ locale, localeSource, setLocale, resetLocaleDetection }),
    [locale, localeSource, setLocale, resetLocaleDetection],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }

  return context;
}
