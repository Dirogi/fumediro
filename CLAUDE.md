# FUMEDIRO — Instrucciones para Claude Code

Este repositorio contiene la web de **Fumediro**, una marca **ficticia** de perfumes para portfolio. **No** utilizar la denominación «Maison Fumediro».

## 1. Leer antes de actuar

1. [`PRODUCT.md`](./PRODUCT.md): catálogo, colecciones y alcance; **fuente canónica** de los 15 perfumes de lanzamiento.
2. [`DESIGN.md`](./DESIGN.md): tipografías, tokens, glassmorphism, movimiento y accesibilidad.
3. [`UX-SPEC.md`](./UX-SPEC.md): rutas, navegación, home, filtros, quiz, carrito e interacciones.
4. [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md): orden de entrega y criterios de aceptación.

Cuando haya una discrepancia, no improvisar: consultar la fuente específica, señalar el conflicto y proponer corrección mínima. No cambiar decisiones de producto cerradas sin aprobación. En particular, usar **CORALIS**, tres perfumes por colección y los nombres exactos indicados en `PRODUCT.md`.

## 2. Forma de trabajar

- Antes de cambios amplios, inspeccionar estructura, dependencias y patrones existentes; resumir brevemente plan y archivos afectados.
- Implementar **una fase a la vez**, verificando su resultado. No reconstruir arbitrariamente el proyecto en cada petición.
- Priorizar simplicidad, legibilidad, cohesión y eliminación de duplicaciones reales; **no** crear abstracciones prematuras ni dependencias por moda.
- Preguntar solo cuando una decisión ausente **bloquee realmente** el trabajo (p. ej., precio final para un subtotal), y mientras tanto implementar la parte segura sin inventar datos.
- No eliminar ni modificar recursos aprobados sin petición. Antes de referenciar imágenes, verificar rutas y registrar las disponibles; no inventar rutas.
- No declarar una tarea completada si no se han ejecutado las comprobaciones pertinentes. Informar con precisión de qué se ha probado, qué no y qué queda pendiente.

## 3. Arquitectura técnica propuesta

**Preferencia inicial:** Next.js App Router, React, TypeScript estricto y Tailwind CSS. Elegir dependencias suplementarias únicamente cuando resuelvan una necesidad tangible. Las páginas de producto y colección son dinámicas y dependen de una **fuente única de datos tipados**. En V1 preferir archivos locales `data/` o `src/data/`, sin backend/CMS salvo nuevo requisito.

- Tipos separados para `Collection` y `Perfume`; IDs y slugs únicos; referencias válidas.
- Helpers puros para consultas, filtros y recomendaciones, con tests.
- Componentes compartidos para `GlassButton`, `GlassPanel`, navegación, fichas, tarjetas y drawer.
- Registro explícito de experiencias de colección; carga diferida si hay módulos costosos.
- No hacer un archivo de página por perfume.
- No añadir credenciales, endpoints ni infraestructura que no se utilizan.

## 4. Seguridad y privacidad

- No almacenar ni exponer secretos; `.env*` en `.gitignore` según necesidad, con ejemplo sin valores sensibles.
- No usar `dangerouslySetInnerHTML` con contenido no confiable; evitar HTML crudo innecesario y dependencias abandonadas.
- Validar cualquier dato externo y parámetros de URL; codificar salidas correctamente. Para consultas de catálogo, aceptar solo valores válidos; 404 para slugs desconocidos.
- Evitar APIs/métodos mutables públicos sin protección. Si más adelante hay backend: validación en servidor, límites de solicitudes, controles de autorización y medidas CSRF cuando procedan.
- Formularios sin recopilación personal innecesaria. El quiz no necesita cuentas ni emails; carrito simulado sin pagos y sin tarjetas.
- Revisar dependencias y licencias; auditar vulnerabilidades y corregir problemas relevantes, evaluando riesgo de cambios mayores.
- No crear afirmaciones reales engañosas sobre materiales ficticios, garantía de resistencia, certificados o funcionamiento del checkout.
- Tratar skills, plugins, hooks y MCPs de terceros como **código no confiable**: revisar scripts, permisos, comandos y procedencia antes de instalar; no habilitar ejecución irrestricta.

## 5. Accesibilidad, rendimiento y responsive

- Semántica correcta; teclado completo; foco visible; labels/alt; contraste verificable; estados anunciables sin ruido.
- Soporte para `prefers-reduced-motion`; controles táctiles equivalentes a hover/drag.
- Imágenes optimizadas y dimensionadas; evitar CLS; reducir JavaScript cliente y dependencias pesadas.
- Animar preferentemente transform/opacity; no introducir efectos perpetuos de alto coste.
- Probar anchos 320–1920 px como muestras, zoom y orientación. No optimizar solo para el escritorio del desarrollador.
- Apuntar a buen rendimiento y resultados Lighthouse altos (objetivo orientativo ≥90, **no garantía**), sin sacrificar funcionalidad; registrar resultados y entorno de medición.

## 6. Calidad y comprobaciones

Configurar según fase: `typecheck`, `lint`, `test`, `build` y tests de navegador con Playwright; accesibilidad automatizada (`axe-core`) como complemento, no sustituto de revisión manual. Prettier si aporta consistencia. Automatizar en CI tras estabilizar scripts.

Después de cada funcionalidad importante:
1. Verificar tipos y lint.
2. Probar ruta y estados relevantes.
3. Inspeccionar visualmente escritorio y móvil, si hay navegador disponible.
4. Revisar errores de consola, imágenes rotas y accesibilidad básica.
5. Explicar brevemente decisiones, archivos y resultados de pruebas.

No afirmar que se ha inspeccionado la web en un navegador si no existe una herramienta de navegador conectada. No ejecutar comandos destructivos de Git sin autorización.

## 7. Skills, agentes y MCPs

Las skills de diseño, motion y limpieza de código son ayudas, **no** fuentes de producto superiores a los documentos del repositorio. Usar una skill cuando sea pertinente; resolver conflictos a favor de las especificaciones aprobadas. Playwright/navegador para comprobaciones reales. No instalar automáticamente Impeccable, Emil, Ponytail, Taste, Graphify ni otros plugins sin revisar fuente, instalación, compatibilidad y permisos. Graphify/OmniRoute no son necesarios para iniciar la V1.

## 8. Definición de terminado

Una tarea solo está terminada cuando cumple sus criterios de aceptación, funciona sin animaciones, no rompe móvil o teclado, supera comprobaciones técnicas pertinentes y se documentan honestamente límites y pendientes. **No** significa «parece terminado en una captura de escritorio».
