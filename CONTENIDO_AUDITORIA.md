# Auditoría de contenido — Portafolio APX

Inventario de elementos visuales y copy, sección por sección, en el orden real en que se renderizan en `/` (home). Pensado para marcar qué cortar, fusionar o reescribir.

> Flujo actual de la home (`src/App.jsx`): **Hero → Ticker → Services → Process → Stack → Footer**
> El `Navbar` global solo se usa en `/servicios/ia-automatizacion`; en la home la nav vive duplicada dentro del Hero.

---

## ⚠️ Problemas de flujo para cuestionar primero

- [ ] **Links rotos**: Nav (Navbar/Hero/Footer) apunta a `#casos` y `#nosotros`, pero `Cases.jsx` y `About.jsx` existen en el código y **no están montados** en `App.jsx`. ¿Se recuperan, se borran los links, o se arma una sección "Nosotros/Casos" nueva más corta?
- [ ] **Navegación triplicada**: los mismos links (Inicio/Servicios/Proceso/Casos/Nosotros/Blog) aparecen en Navbar, Hero y Footer, con destinos inconsistentes.
- [ ] **`Services.jsx` es 4 landings en una sola sección** (selector + 3 sub-catálogos completos con hero, grid de productos y CTA propios), todo apilado y siempre visible, no bajo demanda. Es probablemente el mayor causante de la saturación.
- [ ] **CTA de contacto con 10+ redacciones distintas** para la misma acción ("Hablemos", "Agendar demo", "Escribir mensaje", "Quiero resolver este reto", "Agendar reunión", "Hablar sobre este producto", "Quiero un stand para mi marca"...). ¿Unificar a 2-3 variantes máximo?
- [ ] Bug de encoding: `"MÃ¡s informaciÃ³n"` en `Services.jsx` (~línea 1680) → debería ser "Más información".
- [ ] `AIAutomationPage.jsx` está escrito casi sin tildes ("Automatizacion", "reunion"), inconsistente con el resto del sitio.
- [ ] Todos los links de redes sociales y varios de nav en el Footer apuntan a `href="#"` (no funcionales).

---

## 1. Hero (`src/sections/Hero.jsx`)

**Elementos visuales:**
- Nav interna propia (logo APX + 6 links + toggle tema + botón "Hablemos") — duplica el Navbar global
- Aside decorativo vertical oculto a lectores (texto: APX / IA / Datos / Experiencias / "01")
- Video de fondo que reacciona al mouse (2 versiones según tema claro/oscuro)
- SVG de líneas conectoras animadas
- 3 metric cards con iconos
- Panel de 6 "servicios flotantes" con iconos, resaltado según cursor
- 2 botones CTA
- 3 banderas (Colombia, México, Argentina)

**Copy:**
- Kicker: "Industrial AI partners"
- Título: "Experiencias que conectan. Datos que impulsan."
- Párrafo: "Diseñamos, desarrollamos e implementamos soluciones de gamificación, analítica e inteligencia artificial para transformar marcas y operaciones."
- Métricas: "+80 marcas — Confían en nosotros" / "+35% engagement — Resultados medibles" / "6 verticales — Industrias clave"
- Botones: "Agendar demo" / "Ver soluciones"
- Trust line: "Conectado por marcas en Colombia, México, Argentina"
- Nav: Inicio, Servicios, Proceso, Casos, Nosotros, Blog
- Servicios flotantes (01–06): IA y automatización, Experiencias interactivas, Eventos 360, Analítica de datos, Desarrollo de software, Producción 360

---

## 2. Ticker (`src/components/Ticker.jsx`)

**Elementos visuales:** cinta de texto en movimiento continuo (marquee, loop infinito).

**Copy:** Gamificación · Experiencias Interactivas · Inteligencia Artificial · Análisis de Datos · Automatización · Desarrollo de Software · Tótems Interactivos · Activaciones de Marca

---

## 3. Services (`src/sections/Services.jsx` — ~1700 líneas, la sección más pesada)

### 3.1 Selector principal de servicios

**Visual:** rail lateral de 6 botones (icono + número + título + descripción), panel showcase que cambia según selección con mockup de ventana, SVGs de flujo animados, tarjetas antes/durante/después, barra de métricas final, modal de producto.

**Copy intro:** "NUESTROS SERVICIOS" / "¿Qué necesitas mejorar?" / "Elige el reto principal de tu marca y te mostramos cómo podemos ayudarte sin enredos técnicos."

**Los 6 servicios** (título de menú → problema → título de panel → resultado):
1. **Automatizar tareas** — "Que tu equipo deje de repetir lo mismo todos los días." → "Automatización simple para trabajar mejor" → Resultado: "Más tiempo para tu equipo"
2. **Activar mi marca** — "Experiencias que la gente vive, recuerda y comparte." → "Experiencias interactivas que conectan" → Resultado: "Marca en movimiento"
3. **Producir un evento** — "Hacemos que tu evento salga bien de punta a punta." → "Eventos 360 sin perder detalles" → Resultado: "Evento con control total"
4. **Entender mis datos** — "Convertimos números sueltos en decisiones claras." → "Datos claros para decidir mejor" → Resultado: "Decisiones con confianza"
5. **Crear una plataforma** — "Una herramienta propia para operar mejor." → "Software hecho para tu operación" → Resultado: "Operación más ágil"

Métricas finales: "+80 marcas confían en nosotros" / "+35% engagement promedio" / "6 verticales principales" / "3 países con presencia activa"

Botón CTA por panel: "Quiero resolver este reto" (+ "Más información" en algunos)

### 3.2 Sub-landing "Automatizar" (`AutomationProductsSection`)

**Visual:** diagrama de flujo animado (3 nodos: Disparador/Automatiza/Resultado), grid de 5 tarjetas de producto con mockups distintos (chat, leads, timeline, reporte, documentos).

**Copy:**
- "AUTOMATIZAR TAREAS" / "Automatización simple para trabajar mejor" / "Soluciones inteligentes que eliminan lo repetitivo, conectan herramientas y le dan información clara a tu equipo para tomar mejores decisiones."
- Beneficios: Menos tiempo manual, Más velocidad y precisión, Menos errores y reprocesos, Equipos más productivos
- "NUESTROS PRODUCTOS" / "Elige la solución que más impacta tu operación"
- **5 productos:** APX Assistant, APX Leads Radar, APX FlowOps, APX ReportBot, APX DocFlow — cada uno con descripción, 3 beneficios, métrica de resultado, tags y modal de detalle
- CTA final: "Cuéntanos tu reto y te mostramos cómo podemos automatizar tu operación." → "Quiero resolver este reto"

### 3.3 Sub-landing "Activar mi marca" (`BrandActivationCatalogSection`)

**Visual:** hero con video, lista seleccionable de 5 productos con thumbnails, panel de detalle, carrusel de 5 "experiencias extra" (pisos interactivos, hologramas, pantallas LED, simuladores, photobooth).

**Copy:**
- "ACTIVAR MI MARCA" / "Experiencias que la gente vive, recuerda y comparte." → CTA "Quiero activar mi marca"
- Beneficios: Más participación, Más recordación, Datos útiles
- **5 productos:** APX Emotion Lab, APX Game Arena, APX FacePlay, APX Touch Journey, APX Immersive Room
- "Más experiencias que conectan"
- CTA final: "Hablemos de tu próxima activación" → "Agendar reunión"

### 3.4 Sub-landing "Producir un evento" (`EventProductionSection`)

**Visual:** hero con video showreel, grid de 5 tarjetas de producto con imágenes, panel de detalle expandible con navegación, franja de proceso (5 pasos).

**Copy:**
- "SERVICIO 03" / "Producir un evento" / "Planeamos, diseñamos y ejecutamos eventos 360° que se ven bien, funcionan perfecto y dejan resultados." → CTA "Quiero producir mi evento"
- Beneficios: Experiencias memorables, Ejecución impecable, Resultados que importan
- **5 productos:** APX Brand Stand, APX Launch Experience, APX Conference Flow, APX Event Operations, APX Event Data
- Proceso: "Así trabajamos en cada evento" — Concepto, Diseño, Producción, Operación, Medición

---

## 4. Process (`src/sections/Process.jsx`)

**Visual:** carrusel horizontal por scroll, 6 tarjetas (número + cita + solución + métrica animada + tags), barra de progreso, fondo decorativo.

**Copy:**
- "RETOS QUE RESOLVEMOS" / "Los problemas reales que traen a APX." / "No vendemos tecnología. Resolvemos los retos que más le cuestan a tu negocio."
- 6 tarjetas (cita del cliente → solución → métrica):
  1. "Tenemos datos pero nadie los entiende." → dashboards ejecutivos → −72% tiempo en reportes
  2. "Nuestros sistemas no se hablan entre sí." → integración de ecosistema → "Cero" intervenciones manuales
  3. "Necesitamos software pero no sabemos por dónde empezar." → software a medida → "3–6 sem" concepto a producción
  4. "Hacemos eventos pero no capturamos datos ni generamos leads." → tecnología en cada punto del evento → "+3x" conversión a leads
  5. "La gente asiste, pero no interactúa con la marca." → gamificación y activaciones → +35% engagement
  6. "Nuestro equipo pierde horas en tareas que debería automatizar." → automatización con IA → −80% tiempo en tareas repetitivas

---

## 5. Stack (`src/sections/Stack.jsx`)

### 5.1 Soluciones

**Visual:** grid de 3 tarjetas con iconos SVG, la primera destacada con 4 sub-servicios, las otras dos con métrica + tags.

**Copy:**
- "SOLUCIONES" / "Todo lo que tu negocio necesita." / "Software inteligente, experiencias digitales y producción de eventos. Una sola alianza, sin intermediarios."
- **Experiencias**: "Experiencias que activan marcas." — 4 filas: Activaciones interactivas, Gamificación & Loyalty, Micrositios & Registro, Contenido & Motion
- **Eventos 360**: "Del concepto al evento. Sin detalles perdidos." — métrica "360° producción integral"
- **Merch & Stands**: "Marca en cada detalle." — métrica "+50 marcas en eventos"

### 5.2 CTA de contacto (id="contacto")

**Visual:** tarjeta 3D que rota al hacer scroll — frente (headline + diferenciadores) / reverso (formulario en 2 pasos con progreso, selects USD/COP, pantalla de éxito).

**Copy — frente:**
- "¿Tienes un proyecto en mente?" / "Ingeniería que transforma negocios." / "Sin plantillas. Sin intermediarios. Del reto a producción."
- Botones: "Escribir mensaje" / "WhatsApp directo →"
- Diferenciadores: Solución 100% personalizada, Sin plantillas ni intermediarios, Equipo senior dedicado, Soporte post-lanzamiento

**Copy — formulario:**
- Paso 1: Nombre*, Apellido, Email*, Teléfono, Empresa, Cargo, País → "Continuar"
- Paso 2: Tipo de proyecto*, Presupuesto (USD/COP), Urgencia, "¿Cómo nos encontraste?", "Cuéntanos tu reto*" → "Enviar mensaje"
- Éxito: "Te respondemos en menos de 24 horas hábiles."
- Trust bar: "Respuesta en < 24h" · "Sin compromiso inicial" · "+80 marcas atendidas"

---

## 6. Footer (`src/components/Footer.jsx` — siempre visible)

**Visual:** logo animado + wordmark, 5 iconos sociales, 4 columnas de links, iconos de contacto, botón CTA, barra legal.

**Copy:**
- "Experiencias, tecnología e inteligencia para impulsar marcas y negocios hacia el futuro."
- Navegación: Inicio, Servicios, Proceso, Casos, Nosotros, Blog
- Servicios: Experiencias, Gamificación, Análisis de datos, Inteligencia artificial, Desarrollo de software, Automatización
- Recursos: Blog, Casos de éxito, Preguntas frecuentes, Contacto
- Contacto: hola@apx.com / +57 300 123 4567 / Latinoamérica / "Hablemos"
- "© 2024 APX. Todos los derechos reservados." / "Política de privacidad" / "Términos y condiciones"

---

## Secciones que existen pero NO se muestran (huérfanas)

### `src/sections/Cases.jsx` (id="casos") — no montada en App.jsx
"Casos de éxito" / "Resultados reales. Impacto medible." / 3 stats (+120 proyectos, +35% engagement, +80 marcas) / 3 casos: "Programa de lealtad gamificado" (+47%), "Reducción de costos operativos" (−32%), "Automatización de procesos clave" (+28%)

### `src/sections/About.jsx` (id="nosotros") — no montada en App.jsx
"Nuestro enfoque" / "Tecnología que potencia. Personas que transforman." / "No somos agencia. No somos consultora. Somos un sistema integrado de experiencia, datos e inteligencia." / 4 pilares: Enfoque estratégico, Equipo multidisciplinario, Tecnología escalable, Mejora continua

---

## Página secundaria: `/servicios/ia-automatizacion` (`src/pages/AIAutomationPage.jsx`)

No forma parte del flujo de la home, pero existe como landing propia.

**Copy:** "IA + AUTOMATIZACION" / "Automatizacion inteligente para crecer sin friccion." / consola visual con 5 nodos (Datos, RAG, Agente, Accion, CRM) / "Que incluye" (6 capacidades) / "De idea a sistema operativo" (4 pasos: Diagnostico, Prototipo, Integracion, Medicion) / grid de 6 proyectos (RAG Legal, Bots & Seguridad, Lead Intelligence, Agentes IA, RPA, Data AI) / CTA final "Hablar del proyecto"
