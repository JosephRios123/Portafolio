
# Optimización integral del portafolio

## 1. Limpieza total de datos

- Borrar el proyecto `SneakVault` de la tabla `projects`.
- Las tablas `experiences`, `experience_bullets`, `formations`, `mindset_principles` ya están vacías.
- Eliminar todos los arrays hardcoded de `Education.tsx`, `Experience.tsx`, `Mindset.tsx`. Las secciones públicas mostrarán **estados vacíos elegantes** ("Próximamente — contenido en construcción") cuando no haya datos en la DB.
- `Skills.tsx` se mantiene hardcoded (no había tabla y tú elegiste no crearla).

## 2. Cambios de esquema (migración)

```text
projects
  + country         text         (junto con datos existentes)
  + icon_emoji      text         (icono del registro)
  + icon_image_url  text         (alternativa a emoji)
  alter description: límite 200 validado en cliente

formations
  + country              text
  + icon_emoji           text
  + icon_image_url       text
  + certificate_url      text     (PDF o imagen subida)
  + certificate_mime     text     ('application/pdf' | 'image/...')

mindset_principles
  + icon_emoji           text
  + icon_image_url       text
```

Nuevo bucket público de Storage: `certificates` (PDF/JPG/PNG, <2MB) con políticas RLS:
- SELECT público
- INSERT/UPDATE/DELETE solo admin (`has_role(auth.uid(),'admin')`)

Mismas políticas se añadirán al bucket `project-previews` para uniformidad.

## 3. CRUD endurecido (validaciones estrictas)

Crear `src/lib/validation.ts` con esquemas **zod** reutilizables:

- `projectSchema`: name (1-80), description (1-200), tags (1-10, cada uno ≤24), link (URL válida o vacío), image_url (URL).
- `formationSchema`: course/institution obligatorios, ciudad/país, status enum, fecha (YYYY o "Mes YYYY").
- `mindsetSchema`: phrase (1-120), description (1-400), categoría enum.
- `experienceSchema`: role/company/start_date obligatorios, end_date requerido si `is_current=false`.
- `iconSchema`: exactamente uno de emoji o imagen, no ambos.
- `imageFileSchema`: `type ∈ {jpeg,png,webp}`, `size ≤ 2MB`.
- `certificateFileSchema`: `type ∈ {pdf,jpeg,png}`, `size ≤ 2MB`.

Reemplazar las validaciones manuales actuales en los 4 admins por `schema.safeParse()` con mensajes inline (no solo toast).

### Componente `IconPicker` (`src/components/admin/IconPicker.tsx`)

- Tabs: "Emoji" / "Imagen".
- Tab Emoji: grid curado de ~80 emojis frecuentes (graduación, código, herramientas, banderas) + input manual.
- Tab Imagen: subida a `certificates` o bucket dedicado `icons` con preview circular 64×64 y botón "Quitar".
- Devuelve `{ icon_emoji, icon_image_url }` mutuamente excluyentes. Se usa en `FormationsAdmin` y `MindsetAdmin`.

### Componente `CertificateUpload` (`src/components/admin/CertificateUpload.tsx`)

- Acepta PDF/JPG/PNG ≤2MB.
- Preview inline: imagen → thumbnail; PDF → tarjeta con icono + nombre + "Abrir".
- Estados: idle / uploading / success / error con feedback visual.

## 4. Secciones públicas conectadas a Supabase

Crear hook genérico `src/hooks/usePublicData.ts`:

```text
useProjects()    → projects ordenados
useExperiences() → experiences + bullets (join manual)
useFormations()  → formations
useMindset()     → mindset_principles
```

Cada hook expone `{ data, loading, error }`. Loading muestra **skeletons** (componente `ui/skeleton` ya existe). Estado vacío muestra el card "Próximamente" estilizado.

Refactor de:

- **`Projects.tsx`**: si `data.length === 0` → mantiene la card actual de "Próximamente". Si hay datos → grid responsive (`1 / sm:2 / lg:3`) con tarjetas: imagen lazy (`loading="lazy" decoding="async"`), título, descripción 2 líneas, tags como badges, botón "Ver proyecto" si hay link. Hover lift suave.
- **`Experience.tsx`**: timeline alimentado por DB con bullets. Empty state propio.
- **`Education.tsx`**: accordions alimentados por DB; si hay `certificate_url` → botón "Ver certificado" abre **modal** (Dialog shadcn) con `<embed>` para PDF o `<img>` para imagen. Icono usa `icon_image_url` (en círculo) o `icon_emoji`.
- **`Mindset.tsx`**: tarjetas alimentadas por DB. Categoría → color. Icono igual que Education.

Cuando guardas/eliminas en el admin, las secciones públicas se actualizan al recargar (sin realtime; suficiente para portafolio).

## 5. Responsive / UX / Performance

### Responsive (mobile <768, tablet 768-1024, desktop >1024)
- Auditar y unificar paddings: `px-4 sm:px-6 lg:px-8`, `py-16 sm:py-20 lg:py-28`.
- Grids canónicos: cards `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`.
- Tipografía fluida estandarizada en h2: `text-3xl sm:text-4xl lg:text-5xl`.
- Hero CTAs: en mobile stack vertical full-width, en sm+ fila centrada (corregir 3 botones que hoy se aprietan).
- Eliminar `min-w` que generen overflow horizontal lateral.

### UX/UI
- Skeletons mientras carga DB (no spinners en sección pública).
- Hover/focus visibles en todas las cards (`focus-visible:ring-2 ring-accent`).
- Transiciones uniformes 200-300ms; quitar las que excedan 500ms en hover.
- Toasts `sonner` consistentes para todas las acciones admin (success/error).
- Confirmación de borrado con `AlertDialog` shadcn en lugar de `confirm()` nativo en los 4 admins.

### Performance
- `loading="lazy"` y `decoding="async"` en todas las `<img>` de proyectos/iconos/certificados.
- `React.lazy` + `Suspense` para las páginas admin (`/admin/*`) — no se cargan en el bundle público.
- Memoización de listas grandes con `useMemo` cuando ordenamos.
- Validar tamaño de imagen antes de subir (rechaza >2MB en cliente, ahorra round-trip).

## 6. Tareas concretas

```text
Migración SQL          → 1 migración (drop SneakVault + alter tables + bucket certificates + RLS)
src/lib/validation.ts  → nuevo (zod schemas)
src/hooks/usePublicData.ts → nuevo
src/components/admin/IconPicker.tsx       → nuevo
src/components/admin/CertificateUpload.tsx → nuevo
src/components/admin/ConfirmDelete.tsx    → nuevo (AlertDialog wrapper)
src/components/portfolio/CertificateModal.tsx → nuevo
src/pages/admin/ProjectsAdmin.tsx     → zod + AlertDialog + lazy
src/pages/admin/ExperienceAdmin.tsx   → zod + AlertDialog
src/pages/admin/FormationsAdmin.tsx   → zod + IconPicker + CertificateUpload + país
src/pages/admin/MindsetAdmin.tsx      → zod + IconPicker
src/components/portfolio/Projects.tsx   → conectar a useProjects()
src/components/portfolio/Experience.tsx → conectar a useExperiences()
src/components/portfolio/Education.tsx  → conectar a useFormations() + modal cert
src/components/portfolio/Mindset.tsx    → conectar a useMindset()
src/App.tsx → React.lazy en rutas /admin
```

## Qué NO se toca
- Hero, Navbar, About (orbital), Skills, Contact: ya están finos tras la corrección anterior.
- Auth flow, AdminLayout, Dashboard: funcionan correctamente.
- Estética, paleta, glassmorphism, animaciones: se preservan al 100%.
