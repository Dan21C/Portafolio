import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Navbar from './components/Navbar'; import Footer from './components/Footer'; import Ticker from './components/Ticker';
import Hero from './sections/Hero'; import About from './sections/About'; import Services from './sections/Services'; import Process from './sections/Process'; import Products from './sections/Products'; import Stack from './sections/Stack';
import AIAutomationPage from './pages/AIAutomationPage'; import AutomatizarPage from './pages/AutomatizarPage'; import ActivarMarcaPage from './pages/ActivarMarcaPage'; import ProducirEventoPage from './pages/ProducirEventoPage';

const CatalogPage = lazy(() => import('./modules/catalog/pages/CatalogPage')); const CategoryPage = lazy(() => import('./modules/catalog/pages/CategoryPage')); const SolutionPage = lazy(() => import('./modules/catalog/pages/SolutionPage')); const ProposalPage = lazy(() => import('./modules/catalog/pages/ProposalPage'));
const CatalogProvider = lazy(() => import('./modules/catalog/hooks/CatalogContext').then((module) => ({ default: module.CatalogProvider })));
const loading = <div style={{ minHeight: '100vh', background: '#f7f7f5' }} aria-label="Cargando catálogo"/>;

function HomePage({ theme, onThemeChange }) { const { hash } = useLocation(); useEffect(() => { if (!hash) return undefined; const scroll = () => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }); const frame = requestAnimationFrame(scroll); const timeout = setTimeout(scroll, 500); return () => { cancelAnimationFrame(frame); clearTimeout(timeout); }; }, [hash]); return <div className="app-shell" data-theme={theme}><main><Hero theme={theme} onThemeChange={onThemeChange}/><Ticker/><About/><Services theme={theme} onThemeChange={onThemeChange}/><Process/><Products/><Stack/></main><Footer/></div>; }
function StandalonePage({ component: Component, theme, onThemeChange }) { return <div className="app-shell" data-theme={theme}><Navbar theme={theme} onThemeChange={onThemeChange}/><Component theme={theme} onThemeChange={onThemeChange}/><Footer/></div>; }
function CatalogRoute({ children }) { return <Suspense fallback={loading}><CatalogProvider>{children}</CatalogProvider></Suspense>; }
function NotFoundPage() { return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}><div><p>404</p><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></div></main>; }

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('apx-theme') || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('apx-theme', theme); }, [theme]);
  return <Routes>
    <Route path="/" element={<HomePage theme={theme} onThemeChange={setTheme}/>}/>
    <Route path="/servicios/ia-automatizacion" element={<StandalonePage component={AIAutomationPage} theme={theme} onThemeChange={setTheme}/>}/>
    <Route path="/servicios/automatizar" element={<StandalonePage component={AutomatizarPage} theme={theme} onThemeChange={setTheme}/>}/>
    <Route path="/servicios/activar-marca" element={<StandalonePage component={ActivarMarcaPage} theme={theme} onThemeChange={setTheme}/>}/>
    <Route path="/servicios/producir-evento" element={<StandalonePage component={ProducirEventoPage} theme={theme} onThemeChange={setTheme}/>}/>
    <Route path="/productos" element={<CatalogRoute><CatalogPage/></CatalogRoute>}/>
    <Route path="/productos/categoria/:slug" element={<CatalogRoute><CategoryPage/></CatalogRoute>}/>
    <Route path="/productos/:slug" element={<CatalogRoute><SolutionPage/></CatalogRoute>}/>
    <Route path="/solicitar-propuesta" element={<CatalogRoute><ProposalPage/></CatalogRoute>}/>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>;
}
