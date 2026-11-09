import { useEffect, useState } from 'react';

const readTheme = () => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme || localStorage.getItem('portfolio-theme') || 'dark';
};

export default function usePortfolioTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    sync();
    return () => observer.disconnect();
  }, []);

  return theme;
}
