# Rediseño de “Sobre Mí”: Cybernetic Data Hub

## Dirección aprobada

Construir la variante **Cybernetic Data Hub** con composición bento técnica, paleta azul eléctrico/cyan (`#050B18`, `#111C33`, `#3B82F6`, `#06B6D4`) y lenguaje tipográfico **JetBrains Mono + Work Sans**. La pieza se presentará como un núcleo digital de arquitectura backend, no como un grupo decorativo de iconos.

## Implementación

1. **Recomponer la sección en un bento técnico responsive**
   - Bloque narrativo con el contenido profesional existente.
   - Visualización orbital como celda dominante.
   - Métricas y resumen técnico en celdas secundarias, conservando los datos reales del portafolio.
   - Evitar tarjetas anidadas y mantener una jerarquía compacta compatible con la navegación horizontal actual.

2. **Construir una geometría orbital determinista**
   - Distribuir exactamente 10 nodos a intervalos de `360 / 10 = 36°`.
   - Calcular cada coordenada desde un único centro y un único radio responsive.
   - Separar el contenedor que posiciona cada nodo del elemento que anima su contenido, para que ninguna transformación altere la coordenada matemática.
   - Dibujar conexiones radiales y anillos en un SVG con `viewBox` compartido por toda la composición.
   - Mantener el núcleo central perfectamente centrado y reservar margen interno suficiente para que ningún nodo salga del escenario.

3. **Crear el núcleo y los diez nodos tecnológicos**
   - Núcleo central abstracto con identidad de desarrollador backend, estado activo y profundidad por capas.
   - Tecnologías: React, TypeScript, JavaScript, Node.js, Supabase, Cloud, Database, Backend, UI/UX y Terminal.
   - Usar iconos vectoriales coherentes, sin emojis, y abreviaturas tipográficas solo cuando no exista un pictograma apropiado.
   - Añadir un pulso ambiental mínimo y partículas contenidas dentro del escenario.

4. **Añadir interacción accesible y premium**
   - Cada nodo será accesible por teclado y tendrá estados `hover`, `focus-visible` y activo.
   - Tooltip estable con nombre, nivel de dominio y descripción breve; no alterará el tamaño ni la posición del nodo.
   - En dispositivos táctiles, el primer toque seleccionará el nodo y mostrará su detalle en un panel fijo dentro del bento, evitando tooltips flotantes fuera de pantalla.
   - Incluir nombres accesibles, contraste AA y semántica apropiada.

5. **Adaptar la pieza por breakpoint sin romper la geometría**
   - Desktop: órbita completa y panel de detalle lateral.
   - Tablet: órbita reducida con bento reordenado.
   - Mobile: misma circunferencia matemática dentro de un escenario cuadrado fluido; nodos y núcleo escalan mediante límites discretos, sin cambiar el número ni la separación angular.
   - Validar también 320 px y evitar cualquier overflow horizontal.

6. **Movimiento y rendimiento**
   - Entrada escalonada del núcleo, conexiones y nodos al entrar en viewport.
   - Respiración sutil del glow y señal de actividad en el nodo seleccionado; la órbita no girará completa para preservar lectura y precisión visual.
   - Respetar `prefers-reduced-motion` y evitar repintados costosos, filtros excesivos o animaciones que modifiquen layout.

## Detalles técnicos

- Refactor focalizado en `About.tsx` y en los tokens/utilidades de `index.css` necesarios para la pieza.
- Datos tecnológicos tipados con icono, nivel y descripción.
- Posicionamiento con trigonometría y variables CSS; animación aplicada a un wrapper interior independiente.
- Reutilización de los tokens semánticos existentes, ampliando solo los roles visuales necesarios para reproducir la dirección aprobada.
- No se añadirán dependencias pesadas ni cambios al backend.

## Verificación

- Capturas y mediciones con navegador real en desktop, tablet y mobile.
- Comprobar centro común, radio uniforme, separación de 36°, nodos totalmente contenidos y ausencia de solapamientos.
- Probar mouse, teclado y toque; apertura/cierre del detalle y comportamiento con movimiento reducido.
- Confirmar que la sección funciona dentro del capítulo horizontal actual y no introduce errores de consola.