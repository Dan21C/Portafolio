import { useEffect, useState } from 'react';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Process from './sections/Process';
import Cases from './sections/Cases';
import About from './sections/About';
import Stack from './sections/Stack';
import AIAutomationPage from './pages/AIAutomationPage';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('apx-theme') || 'dark');
  const isAIAutomationPage = window.location.pathname === '/servicios/ia-automatizacion';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('apx-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar theme={theme} onThemeChange={setTheme} />
      {isAIAutomationPage ? (
        <AIAutomationPage theme={theme} onThemeChange={setTheme} />
      ) : (
        <main>
          <Hero />
          <Ticker />
          <Services theme={theme} onThemeChange={setTheme} />
          <Process />
          <Cases />
          <About />
          <Stack />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;
