import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import About from './sections/About';
import Process from './sections/Process';
import Products from './sections/Products';
import BlogTeaser from './sections/BlogTeaser';
import Faq from './sections/Faq';
import Stack from './sections/Stack';
import AIAutomationPage from './pages/AIAutomationPage';
import AutomatizarPage from './pages/AutomatizarPage';
import ActivarMarcaPage from './pages/ActivarMarcaPage';
import ProducirEventoPage from './pages/ProducirEventoPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

const CatalogPage = lazy(() => import('./modules/catalog/pages/CatalogPage'));
const CategoryPage = lazy(() => import('./modules/catalog/pages/CategoryPage'));
const SolutionPage = lazy(() => import('./modules/catalog/pages/SolutionPage'));
const ProposalPage = lazy(() => import('./modules/catalog/pages/ProposalPage'));
const CatalogProvider = lazy(() =>
  import('./modules/catalog/hooks/CatalogContext').then((module) => ({
    default: module.CatalogProvider,
  })),
);

const catalogLoading = (
  <div
    style={{ minHeight: '100vh', background: '#f7f7f5' }}
    aria-label="Cargando catalogo"
  />
);

function HomePage({ theme, onThemeChange }) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const scrollToSection = () => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    };

    const frame = window.requestAnimationFrame(scrollToSection);
    const timeout = window.setTimeout(scrollToSection, 500);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [hash]);

  return (
    <div className="app-shell" data-theme={theme}>
      <main>
        <Hero theme={theme} onThemeChange={onThemeChange} />
        <Ticker />
        <About />
        <Process />
        <Products />
        <BlogTeaser />
        <Faq />
        <Stack />
      </main>
      <Footer />
    </div>
  );
}

function StandalonePage({ component: Component, theme, onThemeChange }) {
  return (
    <div className="app-shell" data-theme={theme}>
      <Navbar theme={theme} onThemeChange={onThemeChange} />
      <Component theme={theme} onThemeChange={onThemeChange} />
      <Footer />
    </div>
  );
}

function CatalogRoute({ children }) {
  return (
    <Suspense fallback={catalogLoading}>
      <CatalogProvider>{children}</CatalogProvider>
    </Suspense>
  );
}

function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <p>404</p>
        <h1>Pagina no encontrada</h1>
        <Link to="/">Volver al inicio</Link>
      </div>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('apx-theme') || 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('apx-theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage theme={theme} onThemeChange={setTheme} />}
      />
      <Route
        path="/servicios/ia-automatizacion"
        element={
          <StandalonePage
            component={AIAutomationPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route
        path="/servicios/automatizar"
        element={
          <StandalonePage
            component={AutomatizarPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route
        path="/servicios/activar-marca"
        element={
          <StandalonePage
            component={ActivarMarcaPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route
        path="/servicios/producir-evento"
        element={
          <StandalonePage
            component={ProducirEventoPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route
        path="/productos"
        element={
          <CatalogRoute>
            <CatalogPage />
          </CatalogRoute>
        }
      />
      <Route
        path="/productos/categoria/:slug"
        element={
          <CatalogRoute>
            <CategoryPage />
          </CatalogRoute>
        }
      />
      <Route
        path="/productos/:slug"
        element={
          <CatalogRoute>
            <SolutionPage />
          </CatalogRoute>
        }
      />
      <Route
        path="/solicitar-propuesta"
        element={
          <CatalogRoute>
            <ProposalPage />
          </CatalogRoute>
        }
      />
      <Route
        path="/politica-de-privacidad"
        element={
          <StandalonePage
            component={PrivacyPolicyPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route
        path="/terminos-y-condiciones"
        element={
          <StandalonePage
            component={TermsPage}
            theme={theme}
            onThemeChange={setTheme}
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
