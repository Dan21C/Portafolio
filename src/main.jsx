import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Las etiquetas pre-renderizadas en el build se quitan: desde aquí <Seo> controla el <head>.
document.head.querySelectorAll('[data-prerender]').forEach((node) => node.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary><BrowserRouter><App /></BrowserRouter></ErrorBoundary>
  </StrictMode>,
)
