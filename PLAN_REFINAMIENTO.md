# Plan de refinamiento — Portafolio APX

Basado en el inventario de `CONTENIDO_AUDITORIA.md` + capturas de pantalla reales de la home (levantada en local, scroll completo, 1440×900). Aquí no repito el inventario, me enfoco en **qué está mal, qué recortar y por qué se siente "de catálogo" en vez de orgánico.**

Servicios (contenido) y el orden general de secciones están bien, como dijiste. El problema es la **densidad interna** de cada bloque y la falta de aire entre elementos.

---

## 1. Bugs y problemas técnicos confirmados en pantalla

Estos no son de opinión, se ven directamente en las capturas:

1. **Texto placeholder olvidado en producción**: en la esquina inferior izquierda del Footer aparece literalmente `//sasdasd` flotando sobre el fondo. Es un comentario o texto de prueba que quedó visible. **Hay que borrarlo.**
2. **Video del Hero duplicado en la sub-landing "Activar mi marca"**: el mismo video/imagen del hero de esa sección se repite casi idéntico más abajo, a la derecha del producto seleccionado (APX Emotion Lab). Se ve como si la página cargara el mismo bloque dos veces.
3. **Huecos enormes de espacio en blanco** entre bloques dentro de Services (ej. entre la barra de métricas del selector principal y el inicio de "Automatizar tareas" hay un salto vacío de casi una pantalla completa). Rompe el ritmo de lectura — el usuario cree que la sección terminó y sigue habiendo más.
4. **Animaciones que dejan contenido "a medio aparecer"**: la tarjeta de contacto (CTA final) se ve semi-transparente/apagada durante buena parte del scroll antes de terminar de revelarse — si el usuario no se queda quieto esperando la animación, puede pensar que el formulario está deshabilitado o roto.
5. **Métricas de "Process" no coinciden con el copy fuente**: en pantalla el contador se ve en +32% / −12% mientras el valor final debería ser +35% / −80% (confirmado en el código). Es un count-up que puede quedar "congelado" a mitad de animación si el usuario ya pasó el punto de scroll — vale la pena revisar el trigger.
6. Los ya reportados en la auditoría anterior siguen vigentes: mojibake `"MÃ¡s informaciÃ³n"`, links rotos a `#casos`/`#nosotros`, redes sociales del Footer sin destino real, `AIAutomationPage.jsx` sin tildes.

---

## 2. Por qué se siente "imposible de leer" (causa raíz, no síntoma)

Viendo las capturas en conjunto, no es un problema de una sección puntual — es un patrón que se repite:

- **Todo bloque de texto viene acompañado de: eyebrow en mayúsculas + título grande + párrafo + 3-4 beneficios con icono + chips/tags + 1-2 botones + a veces una métrica destacada.** Ese mismo esqueleto se repite ~15 veces en la página (una por servicio, por producto, por experiencia, por caso). El usuario nunca deja de ver la misma estructura, y eso cansa aunque cada bloque individualmente esté bien diseñado.
- **Exceso de "badges" y micro-etiquetas**: "SELECCIONADO", "EN VIVO", números de paso (01, 02...), eyebrows en mayúsculas con punto de color — son recursos de diseño que funcionan una o dos veces por página, no en cada tarjeta. Cuando todo grita, nada resalta.
- **Jerga técnica constante en vez de lenguaje natural**: "flujo conectado", "showcase", "pipeline", "verticales", "workflows", "RPA", tags como "APIs REST / WebSocket / Supabase" en secciones dirigidas a marcas, no a developers. Esto es lo que más choca contra el pedido de "sentirse más orgánico": la voz de la marca compite entre tono humano ("Que tu equipo deje de repetir lo mismo todos los días") y tono de stack técnico (chips con nombres de tecnologías) en la misma tarjeta.
- **Todo vive en cajas con borde**: cada elemento —beneficio, chip, métrica, producto— está encerrado en su propia tarjeta con borde y fondo semitransparente. Es lo que da la sensación de "catálogo" o "grilla de e-commerce" en vez de una narrativa que fluye. Lo orgánico normalmente se logra con menos contenedores y más texto/imagen que respira sin caja.
- **Repetición de la misma promesa con distintas palabras**: "+80 marcas confían en nosotros" aparece en el Hero, en el selector de Services, y en el CTA final (3 veces, casi textual). "+35% engagement" aparece en el Hero y en Process. Refuerza el mensaje pero también hace sentir que ya leíste esto antes, en la misma sesión.

---

## 3. Recorte recomendado por sección

### Hero
- **Eliminar** el nav interno duplicado (ya existe `Navbar.jsx` global) — usarlo en toda la home, no solo en la landing de IA.
- **Bajar de 3 a 1 métrica** destacada junto al CTA (la más fuerte: "+80 marcas"), mover el resto al footer o a una sola línea de texto simple sin tarjetas.
- **El panel de 6 servicios flotantes compite directamente con la sección Services que viene inmediatamente después** — es contenido repetido dos veces seguidas. Recomendación: quitarlo del Hero y dejar que Hero sea solo promesa + CTA + prueba social mínima (banderas o marcas, no ambas).

### Ticker
- Bien como está — es liviano y no necesita cambios.

### Services (la sección más pesada, ~1700 líneas)
- **Separar las 3 sub-landings en rutas propias** (`/servicios/automatizar`, `/servicios/activar-marca`, `/servicios/eventos`), igual que ya existe `/servicios/ia-automatizacion`. Hoy se renderizan las 4 landings completas, una debajo de otra, en la misma página — eso solo ya explica gran parte de la longitud total (15,000px de alto).
- El selector principal queda en la home como preview/resumen (sin las sub-landings completas debajo), con un link "Ver más" hacia la landing dedicada.
- Dentro de cada producto: **recortar a 2 beneficios en vez de 3**, quitar chips de tecnologías (son para developers, no para el cliente de marca), y dejar un solo CTA por producto en vez de CTA + "Más información" + modal.

### Process
- Funciona bien como narrativa (cita → solución → métrica), es de las secciones más claras de toda la página. Solo corregir el bug del count-up y dejarlo igual.

### Stack
- La sección "Soluciones" repite contenido ya cubierto en Services (Experiencias, Eventos 360, Merch) — evaluar si se fusiona con Services en vez de repetir la misma info con otro formato de tarjeta.
- El CTA de contacto: reducir diferenciadores de 4 a 2-3, y el formulario de 2 pasos puede ir a 1 paso si se recortan campos opcionales (Empresa, Cargo, "cómo nos encontraste" pueden ir después por email, no antes de recibir el mensaje).

### Footer
- Quitar el texto placeholder `//sasdasd`.
- Reducir de 4 a 3 columnas fusionando "Recursos" dentro de "Navegación" (Blog y Contacto ya están en Navegación/Servicios).

---

## 4. Copy a unificar (repetido con distinta redacción, mismo objetivo)

**CTA de contacto** — hoy existen al menos estas variantes para la misma acción de "hablar con ventas":
"Hablemos" · "Agendar demo" · "Escribir mensaje" · "WhatsApp directo" · "Quiero resolver este reto" · "Agendar reunión" · "Hablar sobre este producto" · "Quiero un stand para mi marca" · "Quiero activar mi marca" · "Quiero producir mi evento" · "Hablar del proyecto"

Recomendación: quedarse con **2 variantes fijas** en toda la página:
- Primaria (rojo, siempre la misma): **"Hablemos"** o **"Agendar reunión"** — elegir una y repetirla igual en todos lados.
- Secundaria contextual (solo cuando aporta, ej. dentro de un producto): **"Más información"**, sin inventar una frase nueva por cada tarjeta.

**Prueba social repetida** — "+80 marcas", "+35% engagement" aparecen 3 veces cada una en lugares distintos. Dejarlas en **un solo lugar fijo** (recomendado: Hero o Footer, no ambos ni en medio de Services/Process).

**Eyebrows en mayúsculas** ("NUESTROS SERVICIOS", "NUESTROS PRODUCTOS", "RETOS QUE RESOLVEMOS", "SOLUCIONES", "SERVICIO 03"...) — son 8+ repeticiones del mismo recurso tipográfico. Dejarlo solo en las secciones de nivel raíz (Services, Process, Stack), no en cada subsección interna.

---

## 5. Qué significa "orgánico" en este caso, en concreto

No es un ajuste de color o fuente — es reducir el número de decisiones visuales que compiten por atención al mismo tiempo. Concretamente:

1. Menos contenedores con borde; más texto/imagen sin caja.
2. Menos badges y etiquetas de estado (SELECCIONADO, EN VIVO, 01/02/03) — usarlos donde de verdad ayudan a orientarse, no como decoración recurrente.
3. Una sola voz: si el copy le habla a un dueño de marca ("Que tu equipo deje de repetir lo mismo todos los días"), no mezclarlo con chips técnicos ("WebSocket", "Supabase", "RPA") en la misma tarjeta.
4. Una sola promesa repetida una vez, no tres.
5. Un solo CTA repetido literalmente igual, no una frase nueva por sección.

---

## Capturas de referencia

Se generaron en `%TEMP%\claude\...\scratchpad\shots\` (full page + 18 pasos de scroll a 1440×900) durante esta sesión para el análisis — no quedaron en el repo. Si quieres que las deje documentadas dentro del proyecto o las suba a un artifact para verlas ordenadas, decime y las publico.
