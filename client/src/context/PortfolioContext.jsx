import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { publicApi } from '../services/api';
import { useTheme } from './ThemeContext';

const PortfolioContext = createContext(null);
const CACHE_KEY = 'portfolio_bootstrap_cache';

const getCachedBootstrap = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const PortfolioProvider = ({ children }) => {
  const cached = getCachedBootstrap();
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [coldStart, setColdStart] = useState(false);
  const { setAccentColor, setTheme } = useTheme();
  const coldTimerRef = useRef(null);
  const dataRef = useRef(cached);

  const applySettings = useCallback(
    (settings) => {
      if (!settings) return;
      if (settings.siteTitle) document.title = settings.siteTitle;
      if (settings.accentColor) setAccentColor(settings.accentColor);

      if (!localStorage.getItem('portfolio_theme') && settings.defaultTheme) {
        setTheme(settings.defaultTheme);
      }

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && settings.metaDescription) {
        metaDesc.setAttribute('content', settings.metaDescription);
      }

      if (settings.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settings.faviconUrl;
      }
    },
    [setAccentColor, setTheme]
  );

  useEffect(() => {
    if (cached?.settings) {
      applySettings(cached.settings);
    }
  }, []);

  const fetchPortfolio = useCallback(
    async (bustCache = false) => {
      try {
        setError(null);
        if (bustCache || !dataRef.current) {
          setColdStart(false);
          coldTimerRef.current = setTimeout(() => setColdStart(true), 4000);
        }

        const res = await publicApi.getBootstrap();
        if (coldTimerRef.current) clearTimeout(coldTimerRef.current);
        setColdStart(false);

        const payload = res.data.data;
        dataRef.current = payload;
        setData(payload);

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        } catch {}

        if (payload?.settings) {
          applySettings(payload.settings);
        }
        return payload;
      } catch (err) {
        if (coldTimerRef.current) clearTimeout(coldTimerRef.current);
        const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');

        if (!dataRef.current) {
          setError(
            isTimeout
              ? 'Server is starting up (free-tier cold start). Please wait 15–30 seconds and retry.'
              : err.response?.data?.message || 'Unable to load portfolio. Please verify backend connection.'
          );
        }
      } finally {
        setLoading(false);
        setColdStart(false);
      }
    },
    [applySettings]
  );

  useEffect(() => {
    fetchPortfolio();

    const handlePortfolioUpdated = () => {
      fetchPortfolio(true);
    };

    const handleStorage = (e) => {
      if (e.key === 'portfolio_cache_bust') {
        fetchPortfolio(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const bustTime = localStorage.getItem('portfolio_cache_bust');
        if (bustTime) {
          fetchPortfolio(true);
        }
      }
    };

    window.addEventListener('portfolio_updated', handlePortfolioUpdated);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('portfolio_updated', handlePortfolioUpdated);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPortfolio]);

  const refreshPortfolio = useCallback(
    async (bust = true) => {
      try {
        if (bust) {
          localStorage.removeItem(CACHE_KEY);
          localStorage.setItem('portfolio_cache_bust', Date.now().toString());
          window.dispatchEvent(new Event('portfolio_updated'));
        }
      } catch {}
      return fetchPortfolio(bust);
    },
    [fetchPortfolio]
  );

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
        error,
        coldStart,
        refreshPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
};
