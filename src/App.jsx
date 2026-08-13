import { useEffect, useState } from 'react';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Process from './sections/Process';
import Products from './sections/Products';
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

  useEffect(() => {
    if (StandalonePage) return undefined;

    const sectionId = window.location.hash.slice(1);
    if (!sectionId) return undefined;

    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
    };

    const frame = window.requestAnimationFrame(scrollToSection);
    const timeout = window.setTimeout(scrollToSection, 500);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [StandalonePage]);

  return (
    <div className="app-shell" data-theme={theme}>
      {StandalonePage && <Navbar theme={theme} onThemeChange={setTheme} />}
      {StandalonePage ? (
        <StandalonePage theme={theme} onThemeChange={setTheme} />
      ) : (
        <main>
          <Hero theme={theme} onThemeChange={setTheme} />
          <Ticker />
          <About />
          <Services theme={theme} onThemeChange={setTheme} />
          <Process />
          <Products />
          <Stack />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
