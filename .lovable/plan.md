# Evolución final del portafolio

## Objetivo

Convertir el portafolio en una experiencia por capítulos horizontales, mantener todo el contenido profesional sincronizado con el CV, ampliar Formación con eventos y reforzar SEO, accesibilidad, rendimiento y detalle creativo sin romper el panel ni los flujos actuales.

## 1. Navegación horizontal por capítulos

- Convertir las 8 secciones públicas en capítulos de ancho completo dentro de un contenedor nativo `scroll-snap` horizontal.
- Cada capítulo ocupará el viewport (`100dvw × 100dvh`) y tendrá scroll vertical interno cuando su contenido supere la altura disponible; así no se recortan grids, formularios ni acordeones.
- Soportar rueda, trackpad, swipe táctil, flechas del teclado y controles anterior/siguiente sin reemplazar el comportamiento nativo con gestos frágiles.
- Sincronizar el capítulo activo con el hash de la URL para conservar enlaces directos como `#projects`.
- Adaptar Navbar y CTAs del Hero al nuevo controlador, manteniendo sus `href` como fallback accesible.
- Añadir indicadores de progreso con nombre, posición, `aria-current` y botones de al menos 44×44 px.
- Actualizar el mensaje del Hero a “Desliza para explorar” y usar una señal lateral.
- En móvil, conservar el swipe horizontal y permitir el desplazamiento vertical dentro del capítulo sin interferir con el menú o el teclado del formulario.

## 2. CV inteligente y sincronizado

- Reescribir `generateCV` para recibir un modelo `CVData` en vez de contener información profesional hardcodeada.
- Crear un agregador que consulte en paralelo proyectos, experiencia con logros, formación y conferencias/workshops; combinará esos datos con el perfil, habilidades, idiomas y contacto compartidos por la interfaz pública.
- Extraer el contenido personal que hoy está duplicado en Hero, About, Skills, Contact y PDF a una única fuente tipada del frontend.
- Incluir automáticamente todas las secciones que tengan datos y omitir limpiamente las vacías.
- Mantener PDF vectorial, texto seleccionable, una sola columna y orden lineal ATS-safe.
- Implementar paginación real, encabezados repetibles y protección contra bloques cortados cuando el contenido administrado crezca.
- Mostrar estado de preparación en los botones de descarga y manejar fallos sin generar un PDF incompleto.

## 3. Mentalidad: contenido inicial publicado

- Insertar 10 principios profesionales editables sobre aprendizaje continuo, calidad, ownership, comunicación, resiliencia, liderazgo, simplicidad, seguridad, colaboración y mejora basada en feedback.
- Publicarlos directamente en `mindset_principles`, con categoría, descripción, icono y orden coherente.
- Mantenerlos como registros normales del CRUD para que puedan editarse, reordenarse o eliminarse desde el panel.
- Diseñar el grid público con ritmo asimétrico controlado, sin alterar el orden semántico ni provocar desbordes.

## 4. Esfera tecnológica de Sobre Mí

- Sustituir la mezcla actual de porcentajes y coordenadas fijas por un único sistema radial responsivo.
- Integrar el icono coherente de la plataforma backend solicitada y reemplazar emojis por marcas visuales consistentes.
- Usar dos anillos cuando la cantidad de tecnologías lo requiera, con posiciones deterministas y sin colisiones.
- Mantener todos los nodos dentro del contenedor en 320 px; en pantallas compactas reducir movimiento y densidad sin convertirlo en una lista desconectada del concepto orbital.
- Hacer cada tecnología accesible por teclado, con nombre visible al foco/hover y animaciones desactivables.

## 5. Formación, conferencias y workshops

- Crear una tabla pública `professional_events` con título, organización, tipo, rol, fecha, ubicación, descripción, enlace, icono, certificado y orden.
- Aplicar permisos públicos de lectura, administración autenticada mediante rol, RLS y grants explícitos.
- Añadir la gestión de conferencias/workshops como segunda pestaña del admin de Formación, reutilizando validación, selector de icono, subida de certificado y confirmación de borrado.
- Ampliar la sección pública con tabs Formación / Conferencias y un timeline-acordeón; el certificado seguirá abriéndose en el visor accesible existente.
- Añadir hook público, skeletons, estado vacío y tipos para estos eventos.

## 6. Easter eggs accesibles

- Convertir dos detalles discretos —las iniciales del logo y un carácter del Hero— en activadores operables por click y teclado, con nombre accesible sin alterar el texto indexable.
- Mostrar “¡Easter Egg encontrado!” mediante un estado anunciado por lector de pantalla y una microanimación breve.
- Añadir un tercer secreto por secuencia de teclado que active un mensaje técnico, sin capturar teclas cuando el usuario escribe en formularios.
- Registrar secretos descubiertos solo en la sesión del navegador; no requieren cuenta ni base de datos.
- Respetar `prefers-reduced-motion` y no cargar librerías de confeti o animación pesadas.

## 7. SEO, accesibilidad y rendimiento

### SEO
- Corregir idioma del documento a español y reemplazar metadatos genéricos por título, descripción, Open Graph y Twitter específicos.
- Añadir canonical del dominio publicado, JSON-LD `Person/ProfilePage`, sitemap y referencia desde `robots.txt`.
- Bloquear `/admin` para rastreo y marcar las vistas administrativas como `noindex`.
- Mantener un solo H1 y jerarquía H2/H3 coherente en todos los capítulos.

### Accesibilidad AA
- Añadir `prefers-reduced-motion` global y eliminar animación infinita para quienes lo soliciten.
- Completar `aria-controls`, foco y retorno de foco del menú móvil.
- Vincular errores del formulario con `aria-invalid`/`aria-describedby` y anunciar estados de éxito/error.
- Mantener navegación completa por teclado, foco visible, contraste AA y objetivos táctiles de 44 px.
- Conservar el orden natural del DOM para lectores de pantalla; los capítulos no activos no se ocultarán artificialmente.

### Rendimiento
- Hacer deterministas y memoizadas las partículas del Hero para evitar repintados en cada carácter del typewriter.
- Reducir partículas en móvil y eliminarlas con reduced motion.
- Mantener imágenes diferidas con `loading="lazy"` y `decoding="async"`; reservar dimensiones para evitar CLS.
- Cargar de forma diferida las secciones públicas posteriores al primer capítulo con fallbacks de altura estable.
- Evitar nuevas dependencias pesadas; usar APIs nativas, componentes existentes y PDF vectorial.

## 8. Validación de producción

- Probar capítulos, hashes, rueda, trackpad, swipe y teclado en 320, 390, 768, 1280 y 1440 px.
- Verificar menú, formulario, certificados, descargas de CV y panel administrativo después del cambio de layout.
- Ejecutar pruebas automatizadas selectivas y una revisión visual con navegador en desktop y móvil.
- Auditar consola, red, foco, contraste, overflow, reduced motion, estructura semántica y enlaces profundos.
- Generar un CV con datos reales y comprobar visualmente todas sus páginas antes de darlo por terminado.
- Ejecutar el escaneo SEO del proyecto una vez aplicados los cambios y dejar los hallazgos corregidos listos para revalidación.

## Detalles técnicos

```text
Index
└── HorizontalPortfolio
    ├── Navbar + progreso
    └── scroll-snap x
        ├── Hero
        ├── Projects
        ├── Experience
        ├── Mindset
        ├── About
        ├── Education + Events
        ├── Skills
        └── Contact

CVData
├── perfil/contacto/habilidades compartidos
├── projects
├── experiences + bullets
├── formations
└── professional_events
```

- La migración de `professional_events` incluirá tabla, grants, RLS, políticas, trigger de `updated_at` e índices de orden/fecha.
- Los principios son datos, por lo que se insertarán mediante la operación de datos correspondiente, no dentro de la migración estructural.
- La advertencia de refs observada en desarrollo proviene del etiquetador visual del entorno, no de los componentes funcionales; se validará el build de producción sin modificar componentes correctos para ocultarla.
