import { useEffect, useState } from 'react';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Process from './sections/Process';
import Stack from './sections/Stack';
import AIAutomationPage from './pages/AIAutomationPage';
import AutomatizarPage from './pages/AutomatizarPage';
import ActivarMarcaPage from './pages/ActivarMarcaPage';
import ProducirEventoPage from './pages/ProducirEventoPage';

const standalonePages = {
  '/servicios/ia-automatizacion': AIAutomationPage,
  '/servicios/automatizar': AutomatizarPage,
  '/servicios/activar-marca': ActivarMarcaPage,
  '/servicios/producir-evento': ProducirEventoPage,
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('apx-theme') || 'dark');
  const StandalonePage = standalonePages[window.location.pathname];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('apx-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell" data-theme={theme}>
      {StandalonePage && <Navbar theme={theme} onThemeChange={setTheme} />}
      {StandalonePage ? (
        <StandalonePage theme={theme} onThemeChange={setTheme} />
      ) : (
        <main>
          <Hero theme={theme} onThemeChange={setTheme} />
          <Ticker />
          <Services theme={theme} onThemeChange={setTheme} />
          <Process />
          <Stack />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
