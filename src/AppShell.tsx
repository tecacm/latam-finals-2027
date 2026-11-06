import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import SiteHeader from './components/SiteHeader';
import Wordmark from './components/Wordmark';
import { event } from './content/event';
import { footer } from './content/footer';
import { navItems, sectionIds } from './content/nav';
import { useActiveSection } from './hooks/useActiveSection';
import HomePage from './pages/HomePage';
import { theme } from './theme/theme';

/** Layout + routes. Needs router context: App provides BrowserRouter, tests MemoryRouter. */
export default function AppShell() {
  const { pathname } = useLocation();
  const page = pathname.replace(/\/+$/, '') || '/';
  const activeId = useActiveSection(sectionIds, page);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToHash />
      <SiteHeader
        brand={<Wordmark prefix={event.wordmark.prefix} accent={event.wordmark.accent} suffix={event.wordmark.suffix} />}
        items={navItems}
        activeId={activeId}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer copyright={footer.copyright} links={footer.links} />
    </ThemeProvider>
  );
}
