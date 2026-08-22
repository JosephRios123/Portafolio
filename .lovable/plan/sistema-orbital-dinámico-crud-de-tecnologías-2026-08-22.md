# Sistema Orbital Dinámico + CRUD de Tecnologías

Convertir el bloque `SYSTEM.PROFILE_INFO` en un sistema orbital que se genera desde la base de datos y se administra desde el panel admin, sin lista hardcodeada y sin romper el resto de la sección.

## 1. Base de datos

Nueva tabla `profile_technologies` (misma arquitectura y patrón de RLS que las tablas actuales):

- `id`, `name`, `category` (enum: Frontend, Backend, Database, Cloud, DevOps, AI, Tools, Architecture, Other)
- `icon_name` (nombre de icono Lucide), `color` (acento opcional, default coherente con el tema)
- `description` (texto corto), `display_order`, `is_active` (boolean, default true)
- `created_at`, `updated_at` + trigger `touch_updated_at`

Políticas: lectura pública solo de registros activos; escritura únicamente para admin. GRANTs explícitos para `anon` (SELECT), `authenticated` y `service_role`.

Tabla/registro opcional para el núcleo: `profile_core` con `label` (por defecto "BACKEND"), `status_text` ("CORE_ACTIVE") e `icon_name`, para hacer configurable el centro. Fila única, misma política.

Se cargan como semilla las tecnologías actuales (React, TypeScript, JavaScript, Node.js, Supabase, Cloud, Database, Backend, UI/UX, Terminal) para que la sección no quede vacía tras el cambio.

## 2. Algoritmo orbital

Nuevo módulo `src/lib/orbitalLayout.ts` con `calculateOrbitalLayout(count, viewport)` puro y memoizable:

- Determina número de anillos según cantidad (1 anillo hasta 6, 2 anillos hasta ~14, y luego anillos adicionales con capacidad proporcional al radio).
- Capacidad por anillo derivada del radio y del tamaño mínimo de nodo, garantizando separación angular mínima (sin solapamientos).
- Devuelve por elemento: anillo, radio (%), ángulo, posición x/y en porcentaje y escala del nodo.
- Anillos alternos con desfase angular para evitar alineaciones rígidas.
- Escala de nodo y radios se reducen cuando aumenta la densidad o cuando el viewport es pequeño.

Sin posiciones hardcodeadas: todo depende de la cantidad y del breakpoint.

## 3. Componentes públicos

Descomponer el bloque actual manteniendo el panel derecho intacto:

```text
src/components/portfolio/orbital/
  OrbitalSystem.tsx      (orquesta layout + estado activo)
  OrbitalCore.tsx        (núcleo configurable)
  OrbitalRings.tsx       (SVG de anillos)
  OrbitalConnections.tsx (líneas núcleo-nodo generadas del layout)
  OrbitalNode.tsx        (nodo + tooltip, hover/tap/teclado)
```

`About.tsx` pasa a consumir `useProfileTechnologies()` (añadido a `src/hooks/usePublicData.ts`) y renderiza `OrbitalSystem` en la columna izquierda; el texto, métricas y panel de detalle se conservan.

Estados: skeleton durante la carga, estado vacío elegante (núcleo + "Waiting for technologies…"), y estado de error consistente con el resto del portafolio.

Interacción: hover/focus/tap resalta el nodo y su conexión, atenúa levemente el resto, muestra nombre + categoría + descripción; panel inferior con `aria-live` se mantiene. Todos los nodos con `aria-label` y navegables por teclado.

Rendimiento: layout memoizado por cantidad y breakpoint, transformaciones CSS, rotación orbital muy lenta mediante una sola animación CSS del contenedor con contra-rotación de nodos (sin `requestAnimationFrame`), y respeto a `prefers-reduced-motion`.

## 4. Panel administrativo

Nueva ruta `/admin/technologies` (lazy, dentro de `ProtectedRoute`) y nuevo ítem "Tecnologías" en el sidebar de `AdminLayout`.

`src/pages/admin/TechnologiesAdmin.tsx` reutilizando los patrones existentes (`ConfirmDelete`, toasts, validación Zod en `src/lib/validation.ts`):

- Tabla con: orden, nombre, categoría, icono, color, estado (toggle activo/inactivo), acciones.
- Botón "+ Agregar tecnología" que abre un formulario/modal con nombre, categoría, selector de icono Lucide (buscador con vista previa), color de acento opcional, descripción, orden y estado.
- Editar y eliminar con confirmación ("¿Eliminar "React" del sistema orbital?").
- Reordenar mediante botones subir/bajar que persisten `display_order` (drag & drop se descarta para no añadir dependencias; la UX queda simple e inmediata).

El dashboard admin suma la nueva entidad a sus KPIs.

## Detalles técnicos

- Selector de iconos: mapa curado de iconos Lucide (~60) para mantener el bundle pequeño y evitar imports dinámicos arbitrarios; renderizado vía lookup en el sistema orbital con fallback (`Cpu`) si el nombre no existe.
- Colores validados como HSL/hex y aplicados vía variables CSS inline, sin romper el sistema de tokens.
- Estilos nuevos en `src/index.css` reutilizando las clases `tech-hub__*` existentes, extendidas con soporte multi-anillo.
- Verificación final: CRUD y persistencia, render con 0 / 1–6 / 7–12 / 20+ / 30+ elementos, responsive de 320px a desktop, hover/tap, teclado, loading y error.
