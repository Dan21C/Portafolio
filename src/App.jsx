import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import Products from './sections/Products';
import {
  CompanyContext, Ecosystem, Workflow, Lab, LandingFaq, LandingFooter,
} from './sections/landing/Landing';
import Stack from './sections/Stack';
import AIAutomationPage from './pages/AIAutomationPage';
import AutomatizarPage from './pages/AutomatizarPage';
import ActivarMarcaPage from './pages/ActivarMarcaPage';
import ProducirEventoPage from './pages/ProducirEventoPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import Seo from './seo/Seo';
import { servicePages, staticPages } from './seo/pages';

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
      <Seo {...staticPages.home} />
      <main>
        <Hero theme={theme} onThemeChange={onThemeChange} />
        <Ticker />
        <CompanyContext />
        <Ecosystem />
        <Products />
        <Workflow />
        <Lab />
        <LandingFaq />
        <Stack />
      </main>
      <LandingFooter />
    </div>
  );
}

function StandalonePage({ component: Component, theme, onThemeChange, seo }) {
  return (
    <div className="app-shell" data-theme={theme}>
      {seo && <Seo {...seo} />}
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
            seo={servicePages['ia-automatizacion']}
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
            seo={servicePages['automatizar']}
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
            seo={servicePages['activar-marca']}
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
            seo={servicePages['producir-evento']}
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
        element={<PrivacyPolicyPage />}
      />
      <Route
        path="/terminos-y-condiciones"
        element={<TermsPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
