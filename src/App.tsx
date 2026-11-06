import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import { routerBasename } from './lib/withBase';

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <AppShell />
    </BrowserRouter>
  );
}
