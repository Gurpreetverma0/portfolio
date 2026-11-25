import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { publicApi } from '../services/api';
import { useTheme } from './ThemeContext';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setAccentColor, setTheme } = useTheme();

  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null);
      const res = await publicApi.getBootstrap();
      const payload = res.data.data;
      setData(payload);

      if (payload?.settings) {
        const s = payload.settings;
        if (s.siteTitle) document.title = s.siteTitle;
        if (s.accentColor) setAccentColor(s.accentColor);

        if (!localStorage.getItem('portfolio_theme') && s.defaultTheme) {
          setTheme(s.defaultTheme);
        }

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && s.metaDescription) {
          metaDesc.setAttribute('content', s.metaDescription);
        }

        if (s.faviconUrl) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = s.faviconUrl;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load portfolio data. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [setAccentColor, setTheme]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refreshPortfolio: fetchPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
};
