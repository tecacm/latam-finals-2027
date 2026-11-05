import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Footer from './components/Footer';
import SiteHeader from './components/SiteHeader';
import Wordmark from './components/Wordmark';
import { event } from './content/event';
import { footer } from './content/footer';
import { navItems, sectionIds } from './content/nav';
import { useActiveSection } from './hooks/useActiveSection';
import HomePage from './pages/HomePage';
import { theme } from './theme/theme';

export default function App() {
  const activeId = useActiveSection(sectionIds);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SiteHeader
        brand={<Wordmark prefix={event.wordmark.prefix} accent={event.wordmark.accent} suffix={event.wordmark.suffix} />}
        items={navItems}
        activeId={activeId}
      />
      <HomePage />
      <Footer copyright={footer.copyright} links={footer.links} />
    </ThemeProvider>
  );
}
