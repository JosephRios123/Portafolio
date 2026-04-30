## Plan de implementación — 4 módulos

### Módulo 1 — Hero: párrafo de impacto
Reemplazar el párrafo actual en `src/components/portfolio/Hero.tsx` (líneas 129-133) por dos líneas con punch técnico backend, p. ej.:

> "Diseño APIs que escalan, bases de datos que vuelan y arquitecturas que no se rompen bajo presión.
> El backend invisible que sostiene cada experiencia que importa."

Mantengo el highlight de palabras clave (`APIs`, `bases de datos`, `arquitecturas`) en `text-primary` / `text-accent` para conservar la estética.

---

### Módulo 2 — CV descargable rediseñado
Reescribir `src/lib/generateCV.ts` desde cero con identidad editorial:

- **Paleta**: fondo blanco hueso `#FAFAF9`, texto `#0D0D0D`, acento único **teal oscuro `#0F766E`** (transmite seniority sin gritar).
- **Tipografía**: `helvetica` bold para headings (proxy de Inter en jsPDF) + `times` para cuerpo (serif con clase). Tamaños jerárquicos (nombre 32pt, rol 12pt acento, sección 9pt uppercase tracking, cuerpo 9.5pt serif).
- **Layout 1 columna ATS-safe**: sin tablas ni columnas en zonas críticas. Solo líneas hairline (0.2mm) como separadores y labels uppercase con letter-spacing manual (espacios entre letras).
- **Header**: nombre dominante a la izquierda, rol con acento debajo, links como texto limpio (github / linkedin / portfolio) sin íconos.
- **Stats row**: 3 números destacados (ej. `2+ años exp` · `4+ tecnologías core` · `3+ certificaciones`) en grande con micro-label uppercase abajo.
- **Skills agrupados por categoría** ("Backend Core", "Bases de Datos", "DevOps & Cloud", "Metodologías") como chips de borde fino sin relleno (rectángulos con `setDrawColor` y padding).
- **Bullets de experiencia**: cada uno empieza con verbo en pasado en negrita (Arquitecté, Desarrollé, Optimicé, Automaticé, Escalé) + dato cuantificable cuando exista.
- **Cierre**: frase firma estilo manifesto: *"Construyo backends que sobreviven al éxito."*
- ATS-safe: solo texto vectorial, keywords incrustadas (Laravel, .NET, MySQL, REST API, SCRUM, testing).

---

### Módulo 3 — Panel Admin con CRUDs (requiere Lovable Cloud)
Activar Lovable Cloud para auth + DB persistente.

**Backend (Supabase)**:
- Tablas: `projects`, `experiences`, `experience_bullets` (1:N), `mindset_principles`, `formations`. Cada una con RLS: lectura pública (anon SELECT), escritura solo admin.
- Tabla `user_roles` + enum `app_role` + función `has_role(uuid, app_role)` SECURITY DEFINER (patrón estándar anti-recursión).
- Bucket público `project-previews` para imágenes opcionales de proyectos.
- Seed de la cuenta admin `cresposfelices@gmail.com` con rol `admin`. La contraseña `ppmm0204*` se establece al crear el usuario en auth.

**Frontend**:
- Ruta `/admin/login` con formulario email/contraseña (default Lovable Cloud auth, sin OAuth).
- Ruta protegida `/admin` con layout: sidebar (`Sidebar` shadcn) con 4 entradas (Proyectos, Experiencia, Mentalidad, Formación) + topbar con avatar/logout.
- Cada CRUD comparte un patrón: tabla con shadcn `Table` (acciones editar/eliminar), botón "Nuevo", `Sheet` lateral con formulario `react-hook-form` + zod, toast (sonner) al guardar/borrar.
- **CRUD Proyectos**: nombre, tags (chips input), descripción ≤200, link, upload imagen a bucket.
- **CRUD Experiencia**: cargo, empresa, fecha inicio/fin (toggle "Actualidad"), bullets dinámicos (sub-tabla con add/remove inline).
- **CRUD Mentalidad**: frase, descripción larga, categoría (select Técnica/Humana/Estratégica).
- **CRUD Formación**: nombre, institución, ciudad, estado (select), fecha.

**Vistas públicas**: refactorizar `Projects.tsx`, `Experience.tsx`, `Mindset.tsx`, `Education.tsx` para leer de Supabase con fallback al diseño "Próximamente" si no hay datos. Mantener estética actual + animaciones (timeline para experiencia, bloques asimétricos glassmorphism para mentalidad, grid con íconos de estado para formación, cards hover con badges para proyectos).

---

### Módulo 4 — Email premium con Reply-To
Cambios en `src/components/portfolio/Contact.tsx`:

1. Cambiar `to_email` enviado a EmailJS por `josephcantantecontact@gmail.com`.
2. Añadir variables al payload: `reply_to: result.data.email`, `subject: \`Nuevo mensaje desde el portafolio — ${result.data.name}\``.
3. Botón submit con 3 estados visuales: idle → loading (spinner + "Enviando...") → success (checkmark animado SVG con stroke-dashoffset + texto "¡Mensaje enviado!"), error con banner rojo sin destruir el form.

**Plantilla HTML para EmailJS (te la entrego al final)**:
- Header dark `#0D0D0D`, título "Portafolio · Jose Manuel" con acento `#06B6D4`.
- Body claro: nombre del remitente bold, email como `<a href="mailto:{{from_email}}">`, mensaje en blockquote con `border-left: 4px solid #06B6D4` y fondo `#F8FAFC`.
- Footer con la nota de "Responde directamente para contactar al remitente".
- Tablas inline con `style=""` para compatibilidad Gmail desktop/mobile.

**Configuración manual que tú harás en EmailJS dashboard**:
- En la plantilla `template_3wfaklf`, setear el campo **Reply-To** = `{{reply_to}}`.
- Pegar el HTML que te entregaré en el body de la plantilla.
- Dejar **To Email** = `josephcantantecontact@gmail.com` (o usar `{{to_email}}`).
- Subject = `{{subject}}`.

---

### Detalles técnicos

- **Orden de ejecución**: Módulo 1 → Módulo 4 (rápidos, sin backend) → activar Lovable Cloud → Módulo 2 (CV) → Módulo 3 (admin completo, el más extenso).
- Dependencias nuevas: ninguna en Módulo 1, 2, 4. En Módulo 3: `react-hook-form` y `@hookform/resolvers` ya están instalados con shadcn.
- Las vistas públicas mantendrán el `Projects.tsx` "Próximamente" como fallback cuando la tabla esté vacía.
- Auth: contraseña fuerte recomendada; `ppmm0204*` cumple mínimo. La cuenta admin queda creada y con rol asignado vía seed automático.
- RLS estricto: tablas públicas readable sin auth, mutaciones solo si `has_role(auth.uid(), 'admin')`.
- Validación con Zod en todos los formularios admin + límites de longitud.

