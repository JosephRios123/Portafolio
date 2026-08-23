# Corrección puntual del sistema orbital `SYSTEM.PROFILE_INFO`

## Objetivo
Eliminar los solapamientos de los nodos y sus tooltips durante hover/focus, y cambiar la etiqueta central de `BACKEND` a `STACK`, conservando intactos tamaños, geometría, icono, glow, animaciones y demás funcionalidades.

## Cambios
1. **Jerarquía de apilamiento orbital**
   - Elevar el contenedor completo del nodo activo (`hover` y `focus-within`), no únicamente el botón interno.
   - Asegurar que la cadena de contenedores intermedios permita que el nodo y el tooltip se rendericen por encima del rotor, del núcleo central y de los demás nodos.
   - Mantener la transición visual actual y añadir una transición discreta al estado elevado, sin mover ni redimensionar los elementos.
   - Preservar el comportamiento accesible por teclado mediante `focus-visible`/`focus-within`.

2. **Etiqueta central**
   - Actualizar el valor persistente de `profile_core.label` de `BACKEND` a `STACK`.
   - Cambiar también el fallback del componente orbital a `STACK` para que la etiqueta sea consistente incluso si la configuración todavía no ha cargado.
   - No modificar el icono, `CORE_ACTIVE`, estilos ni animaciones del núcleo.

3. **Verificación**
   - Probar hover y foco en nodos interiores y exteriores, confirmando que cuadro y tooltip quedan completamente por delante del núcleo y de los nodos vecinos.
   - Verificar visualmente en escritorio y móvil que no cambien distribución, tamaños ni posiciones y que el centro muestre `STACK`.

## Archivos y datos afectados
- Estilos del sistema orbital en `src/index.css`.
- Fallback de la etiqueta en `src/components/portfolio/orbital/OrbitalSystem.tsx`.
- Únicamente el campo `label` del registro existente en `profile_core`.
