# Plan: Admin Panel Funcional + Responsive Integral

Dos correcciones críticas, ejecutadas con arquitectura limpia y respetando la identidad visual existente (dark + azul/cyan + glassmorphism).

---

## 🔴 Parte 1 — Reparar y elevar el Panel Admin

### 1.1 Diagnóstico del bug de redirección

El login muestra el toast pero no entra al panel. Causa raíz:

- `AdminLogin.tsx` llama `signInWithPassword` y luego `navigate("/admin")` **antes** de que el listener `onAuthStateChange` de `useAdminAuth` haya verificado el rol via `setTimeout(checkRole, 0)`.
- Al llegar a `/admin`, `AdminLayout` ve `isAdmin = false` (todavía cargando) y como `loading` ya es `false` (la sesión inicial sí se resolvió), redirige de vuelta a `/admin/login`. Loop silencioso.

**Fix**: introducir un estado `roleLoading` separado en `useAdminAuth`. Mientras haya `session` pero el rol no se haya resuelto, `loading=true`. Así `AdminLayout` espera al spinner y luego entra correctamente. Además, en `AdminLogin` no navegamos manualmente: el `useEffect` que ya observa `session && isAdmin` hace la redirección de forma reactiva (única fuente de verdad).

### 1.2 Nuevo Dashboard admin (reemplaza `AdminIndex.tsx`)

Layout tipo "startup Serie B", usando los componentes y tokens ya existentes (`glass-card`, `gradient-bg`, `text-accent`, etc.):

- **Header sticky** dentro del `<main>` del `AdminLayout`: avatar circular con iniciales del email, nombre, badge "Admin", botón "Cerrar sesión" (solo en mobile, en desktop sigue en sidebar).
- **Fila de KPIs (4 tarjetas)**: cuentas reales obtenidas con `supabase.from('<tabla>').select('*', { count: 'exact', head: true })`:
  - Proyectos publicados
  - Experiencias registradas
  - Principios de mentalidad
  - Formaciones
  Cada KPI: ícono lucide, número grande animado (count-up con `requestAnimationFrame`, sin librerías), delta sutil "+ actualizado hace X".
- **Gráfica de actividad (sparkline SVG inline)**: agregamos los `created_at` de las 4 tablas por día de los últimos 14 días → área chart minimalista en SVG puro (sin recharts para no añadir peso). Tooltip on hover.
- **Tabla de actividad reciente**: union de las 4 tablas ordenadas por `updated_at desc limit 8`, con columnas: Tipo (chip color por entidad), Título, Fecha relativa, Acción (botón "Editar" → ruta CRUD correspondiente). En mobile se transforma en lista de cards apiladas.
- **Atajos rápidos**: 4 cards lineales con CTA "Crear nuevo" → llevan a la ruta CRUD.
- Transición de entrada: `animate-fade-in` escalonado (`animation-delay` por bloque).

### 1.3 Sidebar `AdminLayout` — colapsable y responsive

- Desktop (`md+`): sidebar fijo 256px (como hoy).
- Tablet (`sm`–`md`): sidebar colapsado a 64px solo iconos, con tooltip al hover.
- Mobile (`<sm`): sidebar oculto, drawer off-canvas accionado por botón hamburguesa en el header del main. Click en backdrop o link cierra.
- Estado controlado con `useState` local + `useIsMobile` (ya existe el hook).
- Header del main contiene: hamburguesa (mobile), título de la subruta (derivado del pathname), avatar+menu.

### 1.4 Rutas protegidas — `<ProtectedRoute>`

Extraer el guard de `AdminLayout` a un componente reusable `ProtectedRoute` que:
- Espera `loading` (incluye `roleLoading`).
- Si no hay `session` o `!isAdmin` → `<Navigate to="/admin/login" replace />`.
- Si OK → `<Outlet />`.

Se envuelve `<Route path="/admin">` con él en `App.tsx`. `AdminLayout` queda solo presentacional.

### 1.5 Logout limpio

`signOut` ya llama `supabase.auth.signOut()`. Asegurar que tras eso: limpiamos estado local (`setSession(null)`, `setIsAdmin(false)` lo hace el listener) y navegamos a `/` (no a `/admin/login`) para sentir "salida real".

---

## 🟡 Parte 2 — Responsive Integral (320px → 1920px)

Auditoría sección por sección. Reglas globales aplicadas:

- Tipografía fluida con `clamp()` en `tailwind.config.ts` o usando escalas `text-base sm:text-lg md:text-xl` ya presentes — verificar que ninguna headline use `text-5xl` sin variante sm menor.
- `overflow-x: hidden` en `<main>` para garantizar cero scroll horizontal.
- Touch targets ≥ 44×44 px (revisar botones ícono del Navbar mobile, chips de skills, controles de admin).
- Padding lateral mínimo `px-4` en mobile, `px-6` sm, `px-8` md+.

### Cambios concretos por archivo

| Archivo | Ajustes |
|---|---|
| `src/index.css` | Añadir `html, body { overflow-x: hidden; }` + utility `.touch-target { min-width: 44px; min-height: 44px; }` |
| `Navbar.tsx` | Hamburguesa: aumentar a `w-11 h-11` con `flex items-center justify-center`. Animar el menu mobile con transición (no aparición seca). Bloquear scroll del body cuando `menuOpen`. Cerrar con tecla `Esc`. |
| `Hero.tsx` | Headline `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl` (hoy arranca en 5xl, demasiado para 320px). CTAs en mobile: stack vertical full-width `w-full sm:w-auto`. Reducir cantidad de partículas en mobile (`useIsMobile` → 8 en vez de 20) por performance. |
| `Projects.tsx` | Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Cards con `min-w-0` para evitar overflow de tags. Tags con `flex-wrap`. |
| `Experience.tsx` | Si usa timeline con línea izquierda, en mobile cambiar a línea simple sin offset, padding-left reducido. |
| `Mindset.tsx` | Asegurar grid responsive y que las tarjetas no fuercen ancho mínimo. |
| `About.tsx` | Las órbitas del stack tecnológico: en mobile (`<sm`) reducir radio o cambiar a grid de chips estático para que no se salga de la pantalla. Tooltip `whitespace-nowrap` (línea 140) → en mobile mejor wrap. |
| `Education.tsx` | Accordions full-width, padding interno reducido en mobile. |
| `Skills.tsx` | Grid `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`. |
| `Contact.tsx` | Form: inputs `w-full`, labels arriba, botón submit full-width en mobile. Espaciado `space-y-4 sm:space-y-5`. |
| `AdminLayout.tsx` | Drawer mobile descrito en 1.3. |
| `AdminLogin.tsx` | Card `max-w-md` ya OK; padding `p-6 sm:p-8`. Inputs `text-base` (evita zoom de iOS al enfocar). |
| Páginas CRUD admin | Tablas envueltas en `<div class="overflow-x-auto">`. Formularios: `grid-cols-1 sm:grid-cols-2`. Botones de acción min 44px. |

### Breakpoints de prueba mental
- **320 (iPhone SE)**: Hero legible, CTAs apilados, navbar hamburguesa, sin overflow.
- **390 (actual del usuario)**: Mismo, ya verificado en preview.
- **768 (tablet)**: Sidebar admin colapsado iconos, grids 2 cols.
- **1024+**: Layout completo desktop.

---

## 📦 Resumen de archivos tocados

**Nuevos**
- `src/components/admin/ProtectedRoute.tsx`
- `src/components/admin/AdminHeader.tsx`
- `src/components/admin/KpiCard.tsx`
- `src/components/admin/ActivitySparkline.tsx`
- `src/components/admin/RecentActivity.tsx`

**Modificados**
- `src/hooks/useAdminAuth.tsx` (estado `roleLoading`)
- `src/App.tsx` (ProtectedRoute wrapping)
- `src/pages/admin/AdminLogin.tsx` (quitar navigate manual)
- `src/pages/admin/AdminLayout.tsx` (sidebar colapsable + drawer mobile + header)
- `src/pages/admin/AdminIndex.tsx` (dashboard nuevo con KPIs/sparkline/actividad)
- Páginas CRUD: ProjectsAdmin, ExperienceAdmin, MindsetAdmin, FormationsAdmin (responsive)
- `src/index.css` (overflow-x hidden, touch-target)
- `src/components/portfolio/*` (responsive fixes en cada sección)

**Sin tocar**: Supabase schema (ya está bien), `generateCV.ts`, `Contact.tsx` lógica de email (ya quedó del módulo anterior).

---

## ✅ Criterios de aceptación

1. Login en `/admin/login` con `cresposfelices@gmail.com` → entra al dashboard sin loops.
2. Refrescar en `/admin` mantiene sesión.
3. Acceso a `/admin` sin sesión → redirige a `/admin/login`.
4. Logout → limpia estado y vuelve a `/`.
5. En 320px no hay scroll horizontal en ninguna sección ni en admin.
6. Hamburguesa abre/cierra suavemente y bloquea scroll del body.
7. Sidebar admin se transforma en drawer en mobile.
8. Todos los botones táctiles ≥ 44px.
9. Dashboard muestra conteos reales desde Supabase y actividad reciente.