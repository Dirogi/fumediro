# FUMEDIRO

> **Beyond scent. Beyond form.**

FUMEDIRO es una marca **ficticia** de perfumería experimental, concebida como proyecto de diseño y desarrollo web para portfolio. Imagina perfumes cuyo frasco forma parte de la experiencia: su forma, su color y su relación con la luz.

**No es una tienda real.** Los perfumes, los materiales y DiroCore™ son inventados, los precios son de demostración y no se procesa ningún pago ni pedido.

## Funcionalidades

- **Home editorial** con los cinco universos de la marca.
- **Catálogo de 15 perfumes** con filtro por colección, ordenación y estado en la URL.
- **Cinco colecciones** (VOLTARA, FLORA ARCANA, COSMORA, PRISMATICA, THERMAE), cada una con una interacción propia.
- **Fichas de producto** generadas desde una única fuente de datos tipada.
- **Carrito de demostración** en un panel accesible, con persistencia local.
- **Checkout simulado**: valida un formulario de ejemplo y muestra una confirmación ficticia; no envía nada.
- **The Scent Finder**: cuestionario de cuatro preguntas con una recomendación determinista.
- **Nuestra historia**: la idea de marca en cuatro capítulos.
- **Contacto** (`/contacto`): correo y enlace al portfolio del creador. Sin formulario ni backend; se enlaza desde el pie de página.

## Tecnologías

Versiones instaladas en este repositorio (ver `package-lock.json`):

| Tecnología | Versión |
|---|---|
| Next.js (App Router) | 16.4.6 |
| React | 19.3.1 |
| TypeScript (estricto) | 6.0.3 |
| Tailwind CSS | 4.3.5 |
| Vitest | 5.1.0 |
| ESLint | 9.39.5 |

Tipografías (Cormorant Garamond y Manrope) cargadas con `next/font/google`. Node `>=22.12`.

## Ejecución local

```bash
npm ci               # instala dependencias exactas (o npm install)
npm run dev          # desarrollo en http://localhost:3000
npm run build        # build de producción
npm run start        # sirve el build de producción
npm run typecheck    # next typegen + tsc --noEmit
npm run lint         # eslint
npm test             # vitest run
```

Una integración continua en GitHub Actions (`.github/workflows/ci.yml`) ejecuta typecheck, lint, tests y build en cada push y pull request.

## Arquitectura

```
src/app/         Rutas (App Router): /, /perfumes, /colecciones, /descubre-tu-aroma,
                 /historia, /checkout, /contacto y las dinámicas por slug
src/components/  Componentes compartidos (GlassPanel, GlassButton, navegación, tarjetas,
                 drawer del carrito) y experiencias de cada colección
src/data/        Catálogo, colecciones, precios de demostración y textos (datos locales)
src/lib/         Tipos y funciones puras (catálogo, filtros, carrito, recomendación) con tests
public/images/   Fotografías de producto e imágenes del hero
```

No hay backend, CMS ni servicios externos. No hay una página por perfume: las fichas y colecciones salen de `generateStaticParams` y los datos. Los documentos de especificación (`PRODUCT.md`, `DESIGN.md`, `UX-SPEC.md`, `IMPLEMENTATION-PLAN.md`) y las reglas de trabajo (`CLAUDE.md`) están en la raíz.

## Diseño y accesibilidad

- Estética editorial oscura: carbón, grafito, marfil, plata y champagne; glassmorphism contenido.
- Responsive; se ha comprobado la ausencia de desplazamiento horizontal entre 320 y 1920 px.
- Navegación completa con teclado, enlace «Saltar al contenido», foco visible y paneles (menú móvil y carrito) sobre `<dialog>` modal con gestión del foco.
- Respeta `prefers-reduced-motion`: el contenido es legible sin animaciones.
- Se ha ejecutado axe-core en las páginas principales, junto con pruebas manuales de teclado y movimiento reducido. **No** constituye una certificación ni una auditoría completa de WCAG: no se han realizado pruebas con lector de pantalla real ni con zoom al 200 %.

## Limitaciones y transparencia

- Productos, materiales y tecnologías (DiroCore™) son ficticios.
- No hay pagos: el checkout no crea pedidos ni envía datos.
- Los precios son de demostración.
- El carrito guarda en `localStorage` únicamente identificadores y cantidades.
- El cuestionario no almacena ni envía las respuestas.
- Aún no se han medido métricas de rendimiento (Lighthouse/Core Web Vitals) en un entorno publicado.

## Imágenes, créditos y licencia

- Las fotografías de producto son imágenes generadas; la herramienta concreta no consta en este repositorio.
- Las tipografías proceden de Google Fonts.
- Aún no se ha definido una licencia para el código o las imágenes; hasta entonces, todos los derechos están reservados.

## Despliegue

Pendiente: todavía no hay una versión publicada. Cuando exista, se añadirá aquí su dirección.
