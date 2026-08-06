# Correcciones de producción: Sobre Mí, autorización admin y CV

## Diagnóstico confirmado

- La migración que trasladó `has_role` de `public` a `private` revocó `USAGE` del esquema y `EXECUTE` de la función a `authenticated`, pero después hizo que todas las políticas administrativas llamaran esa función. Por eso cualquier evaluación RLS autenticada falla con `42501`; `SECURITY DEFINER` no elimina la necesidad de esos permisos de invocación.
- La función sí tiene una base segura: propietario controlado, `SECURITY DEFINER` y `search_path` fijo. No se reemplazará con una política permisiva ni con un RPC público.
- Los privilegios actuales de las tablas públicas son más amplios de lo necesario: `anon` posee operaciones de escritura aunque RLS las bloquee. Se reducirá esa superficie siguiendo mínimo privilegio.
- El login contiene un bootstrap de administrador desde el navegador. Aunque las políticas deberían impedirlo, asignar roles desde el cliente es un patrón inseguro y se eliminará.
- “Sobre Mí” expone el nivel en el modelo, el texto accesible, el tooltip y el panel de detalle.
- El CV antepone verbos promocionales fijos (`Impulsé`, `Construí`, `Participé`) a datos reales. Su layout no controla saltos de página y los chips solo incrementan la posición vertical al envolver, lo que puede superponer categorías, secciones y la firma final.
- No hay una imagen adjunta disponible en los archivos recibidos; la reconstrucción se validará directamente sobre el PDF generado por la aplicación.

## 1. Simplificar la visualización “Sobre Mí”

- Eliminar `level` del modelo local de tecnologías y de sus diez registros.
- Retirar niveles del `aria-label`, tooltip y panel de detalle; conservar nombre, icono y descripción.
- Reequilibrar el espacio interno de tooltip/panel para que la composición no deje huecos y mantener órbita, glow, foco, partículas y animaciones con `prefers-reduced-motion`.
- Verificar geometría, foco por teclado y ausencia de overflow en móvil, tablet y escritorio.

## 2. Reparar autorización y endurecer el panel admin

### Migración de mínimo privilegio

- Mantener `private.has_role(uuid, app_role)` como `SECURITY DEFINER` con `search_path` fijo.
- Conceder solamente `USAGE` del esquema `private` y `EXECUTE` de esa firma a `authenticated`; mantener ambos revocados para `anon`/`PUBLIC`.
- Normalizar privilegios de tablas:
  - contenido público: `anon` solo lectura;
  - contenido administrable: `authenticated` lectura/escritura, siempre restringida por RLS;
  - `user_roles`: sin acceso anónimo, lectura/escritura autenticada bajo sus políticas;
  - `service_role`: conservar acceso administrativo.
- No abrir políticas, no crear bypasses y no conceder acceso directo anónimo a la función.

### Cliente y prevención

- Eliminar el alta automática y la asignación de rol desde `AdminLogin`; el formulario solo autenticará cuentas ya provisionadas.
- Fortalecer `useAdminAuth` para validar al usuario con el servidor de autenticación, distinguir “sin rol” de “error de autorización/configuración” y evitar bucles silenciosos de redirección.
- Mostrar un error seguro y comprensible en login cuando la comprobación de rol no pueda completarse, sin filtrar detalles internos.
- Añadir pruebas/regresiones para comprobar permisos de esquema/función y que el hook no trate un fallo backend como “usuario no admin”.

### Matriz de validación

- Administrador: login, carga del dashboard, lectura y una operación CRUD representativa, carga protegida de archivos y logout.
- Usuario normal: login válido pero acceso admin rechazado; escrituras y asignación de roles denegadas.
- Anónimo: lectura del portafolio permitida; escritura y lectura de `user_roles` denegadas.
- Confirmar que solo existe la función privada esperada, que todas las políticas apuntan a ella y que no quedan errores `42501` en logs o consola.
- Ejecutar linter y escaneo de seguridad después de la migración.

## 3. Reescribir el CV con tono técnico y objetivo

- Sustituir prefijos promocionales por contenido directo: bullets reales sin verbos añadidos, descripciones de proyecto sin “Construí” y eventos descritos objetivamente por tipo/rol.
- Revisar perfil, encabezados y cierre para retirar lenguaje grandilocuente; conservar información profesional verificable y evitar inventar métricas o logros.
- Mantener todos los datos dinámicos de proyectos, experiencia, formación y eventos.
- Añadir manejo visible de error al botón de descarga para que una consulta fallida no quede como rechazo silencioso.

## 4. Reconstruir el Stack Técnico y la paginación PDF

- Reemplazar chips flotantes por una matriz editorial ATS-safe: una fila por categoría, etiqueta de categoría estable y tecnologías como texto vectorial con wrapping medido.
- Usar cuatro categorías coherentes: Backend, Bases de datos, Herramientas/DevOps y Metodologías.
- Calcular altura de cada fila antes de dibujarla; mantener márgenes, interlineado y divisores uniformes.
- Incorporar un sistema central `ensureSpace` que mida cada bloque, cree páginas cuando corresponde y repinte fondo/encabezado de continuidad.
- Aplicar la misma protección contra cortes a experiencia, proyectos, formación, eventos, idiomas y cierre; eliminar la firma con posición absoluta que puede superponerse al contenido.
- Mantener una sola columna semántica, texto seleccionable y orden de lectura ATS.

## 5. QA integral

- Ejecutar pruebas, lint y validación de compilación del flujo automatizado.
- Generar un CV con los datos reales, convertir cada página a imagen e inspeccionar visualmente márgenes, wrapping, simetría, cortes, superposición y legibilidad; corregir y repetir la inspección.
- Probar el portafolio y admin con Playwright en 320 px, tablet y escritorio: overflow horizontal, sidebar, navegación, foco, nombres accesibles y contraste.
- Revisar consola, red y logs backend después de login/CRUD/logout.
- Repetir consultas de permisos, linter, escaneo de seguridad y pruebas negativas de RLS antes de declarar resuelto el problema.

## Archivos y áreas previstas

- `src/components/portfolio/About.tsx` y estilos relacionados en `src/index.css`.
- `src/lib/generateCV.ts` y el control de descarga en `src/components/portfolio/Hero.tsx`.
- `src/hooks/useAdminAuth.tsx`, `src/pages/admin/AdminLogin.tsx` y rutas protegidas si requieren mostrar el nuevo estado de error.
- Una migración de backend para grants de función/esquema/tablas; sin modificar tablas ni datos profesionales.
- Pruebas enfocadas en autorización y generación/medición del PDF.