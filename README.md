<div align="center">

# APX

### Experiencias que conectan. Datos que impulsan.

Sitio web corporativo de **APX** — ingeniería, experiencias interactivas y automatización con IA,
construido como una composición editorial: sobrio, monocromático, sin plantillas.

[![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Lucide](https://img.shields.io/badge/Lucide--React-icons-1a1a1a?style=flat-square)](https://lucide.dev)
[![Motion](https://img.shields.io/badge/Motion-animations-000000?style=flat-square)](https://motion.dev)
[![ESLint](https://img.shields.io/badge/ESLint-flat--config-4B32C3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org)

</div>

---

## Qué es esto

No es una landing genérica. Es el sitio de una compañía que diseña y produce tecnología física y
digital — activaciones de marca, tótems interactivos, automatización con IA, eventos 360° — y el
sitio está construido con la misma filosofía: **composición editorial, jerarquía deliberada,
monocromía absoluta**. Cero gradientes SaaS, cero glassmorphism genérico, cero dashboards flotando
sin motivo.

Todo el proyecto vive en un único `App.jsx` que compone secciones de scroll largo (`Hero`,
`Services`, `Process`, `Products`, `Stack`) más un puñado de páginas standalone para cada servicio.

## Stack

| Capa | Elección | Por qué |
|---|---|---|
| UI | React 19 + Vite 8 | HMR instantáneo, sin capas de framework innecesarias |
| Animación | [`motion`](https://motion.dev) (sucesor de Framer Motion) | solo donde aporta — el resto usa `IntersectionObserver` + CSS puro |
| Iconografía | `lucide-react` | set consistente, sin iconos decorativos de más |
| Estilos | CSS Modules por sección | cero acoplamiento entre secciones, cero specificity wars |
| Enrutamiento | resolución manual por `window.location.pathname` en `App.jsx` | el sitio no necesita un router completo todavía |
| Lint | ESLint (flat config) + `eslint-plugin-react-hooks` | reglas de hooks estrictas |

## Empezar

```bash
npm install
npm run dev        # servidor de desarrollo con HMR
```

```bash
npm run build       # build de producción a /dist
npm run preview      # sirve el build localmente
npm run lint          # ESLint sobre todo el proyecto
```

Requiere Node 18+.

## Estructura

```
src/
├── App.jsx                  # composición de secciones + resolución de páginas standalone
├── main.jsx                 # entry point
├── components/               # Navbar, Footer, Ticker, BrainLogo — compartidos entre páginas
├── sections/                  # una sección de scroll = un archivo + su .module.css
│   ├── Hero.jsx                 # video showreel, pointer parallax, tema claro/oscuro
│   ├── Services.jsx              # catálogos de servicios (Automatizar / Activar / Producir)
│   ├── Process.jsx                # scroll horizontal de retos que resuelve APX
│   ├── Products.jsx               # showcase editorial de productos APX (ver detalle abajo)
│   ├── products.data.js            # config centralizada de productos + assets del showcase
│   └── Stack.jsx                    # sección de contacto (formulario con flip 3D)
├── pages/                     # páginas standalone por servicio (rutas fuera del scroll principal)
└── styles/globals.css          # tokens: color, tipografía, radios — fuente única de verdad

public/
└── Assets/                    # imágenes, video, fuentes — organizadas por sección/producto
    ├── Hero/ Products/ Events/ Activation/ BG/ Animation/ Fonts/
```

### Convención de assets

Cada sección con contenido dinámico centraliza sus rutas de assets en un único lugar (ver
`products.data.js` como referencia) en vez de dispersarlas por el JSX. Si una imagen no existe
todavía, el componente cae a un placeholder neutro en vez de romper el layout — así el diseño
nunca depende de que el asset final ya esté listo.

## La sección Products

`Products.jsx` es la pieza más deliberada del sitio: una composición editorial asimétrica
(no un grid `repeat(6, 1fr)`) armada con `grid-template-areas` nombradas, tarjetas altas y bajas
intercaladas, parallax casi imperceptible por tarjeta, líneas SVG procedurales de fondo y un
carrusel horizontal con scroll-snap en mobile — todo reutilizando los tokens de tipografía y color
que ya definía el sitio, sin introducir una isla visual nueva.

## Sistema de diseño

- **Tipografía**: `Raleway` (display, `--font-h`) + `Nunito` (texto, `--font-b`) — variable fonts
  cargadas localmente, sin dependencias externas más allá de Google Fonts para el fallback.
- **Color**: un único acento monocromático (`--accent: #f2f2f2`) sobre fondos casi negros/blancos —
  todo el contraste viene de opacidad, no de matices.
- **Tema**: claro/oscuro vía `data-theme` en el root, persistido en `localStorage`, con overrides
  por sección usando `:global([data-theme='light'])` dentro de cada CSS Module.
- **Movimiento**: transiciones de 250–600ms con `cubic-bezier(.16,1,.3,1)` / `.22,1,.36,1`,
  `prefers-reduced-motion` respetado en toda animación no esencial.

## Estado del proyecto

### Catálogo público con API

El catálogo puede usar mocks o la API ASP.NET Core sin cambiar componentes. Copia `.env.example` a tu configuración local y define:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_API=true
```

Si `VITE_USE_API` no es `true` o falta `VITE_API_URL`, el sitio usa `MockCatalogRepository`. El administrador y el formulario de propuesta continúan en mocks. Para probar el adaptador HTTP ejecuta `npm run test:catalog`.

Privado, en desarrollo activo. Sin licencia pública — todos los derechos reservados a APX.
