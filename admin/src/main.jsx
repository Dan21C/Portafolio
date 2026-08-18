import { StrictMode } from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; import './styles.css';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import ErrorBoundary from '../../src/ErrorBoundary';
createRoot(document.getElementById('root')).render(<StrictMode><ErrorBoundary><BrowserRouter basename="/admin"><AdminAuthProvider><App/></AdminAuthProvider></BrowserRouter></ErrorBoundary></StrictMode>);
