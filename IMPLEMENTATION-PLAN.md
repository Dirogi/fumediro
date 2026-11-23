# FUMEDIRO — Plan de implementación

**Versión:** 1.0 · **Método:** fases pequeñas, validación continua, sin reescrituras innecesarias.

## 0. Preparación y control de alcance

- [ ] Crear repositorio Git y proyecto Next.js + TypeScript estricto + Tailwind.
- [ ] Incorporar los cuatro documentos de especificación y este plan.
- [ ] Importar y **verificar** rutas de las 15 imágenes aprobadas; normalizar nombres sin modificar el contenido original.
- [ ] Establecer convenciones (`src/` si se adopta), scripts, `README.md`, `.gitignore`, configuración mínima de lint y formato.
- [ ] Auditar skills/plugins/MCPs antes de su instalación; instalar solo lo que aporta valor inmediato.

**Salida:** proyecto ejecutable localmente con documentación y configuración comprobadas.

## 1. Datos y arquitectura compartida

- [ ] Definir tipos `Collection`, `Perfume`, `Note`, `FragranceFamily`, `ExperienceType` y referencias de imagen.
- [ ] Definir datos de **cinco colecciones y exactamente quince perfumes** según `PRODUCT.md`, sin crear productos ficticios extra.
- [ ] Validar programáticamente unicidad de IDs/slugs y pertenencia de perfumes.
- [ ] Crear helpers de filtrado, consulta por slug y relación entre perfume y colección.
- [ ] Crear componentes base del sistema de diseño, cabecera, pie y layout adaptable.
- [ ] Añadir test que compruebe que cada colección V1 contiene **exactamente 3 perfumes**, incluida la grafía `corallis`.

**Salida:** estructura reutilizable; navegación básica y catálogo canónico centralizado.

## 2. Home e identidad visual

- [ ] Aplicar fuentes Cormorant Garamond + Manrope, tokens y glassmorphism refinado.
- [ ] Crear hero de marca sin frasco protagonista; asset abstracto solo cuando esté disponible o placeholder editorial sin inventar imagen.
- [ ] Diseñar bloque de cinco colecciones con igual protagonismo.
- [ ] Añadir introducción, innovación ficticia, CTA al quiz y enlaces.
- [ ] Comprobar contraste, carga inicial, acceso por teclado y navegación responsive.

**Salida:** home funcional, pulida y coherente en smartphone/tablet/desktop.

## 3. Catálogo y páginas de colección

- [ ] Crear `/perfumes` desde los datos con tarjetas y enlaces reales.
- [ ] Añadir filtros por colección/familia/carácter con URL compartible si es viable y estado vacío.
- [ ] Implementar bruma de filtrado **breve, cancelable y opcional**; verificar cambios rápidos y `prefers-reduced-motion`.
- [ ] Crear `/colecciones` y `/colecciones/[collectionSlug]` dinámicas.
- [ ] Implementar una estructura común para cinco experiencias, inicialmente con alternativas simples.
- [ ] Integrar/acabar interacciones por colección, comprobando que no impiden ver la información.

**Salida:** exploración completa de las cinco colecciones y quince perfumes.

## 4. Fichas, carrito y checkout de demostración (D5)

Precios ficticios de portfolio en `src/data/demoPricing.ts` (céntimos). Cada subentregable se detiene para revisión; fichas y `/checkout` públicas desde D5-E.

- [x] **D5-A** Ficha piloto AURELIS (botón de compra desactivado como vista previa) y módulo de precios con tests.
- [x] **D5-B** Plantilla reutilizable y 15 fichas; navegación anterior/siguiente; retirar `displayPrice`.
- [x] **D5-C** Carrito lateral (`<dialog>`), estado compartido, cantidades (máx. 9), eliminación y persistencia validada de ids y cantidades.
- [x] **D5-D** `/checkout` simulado: datos de ejemplo precargados, validación, resumen y confirmación ficticia; sin pagos ni datos personales.
- [x] **D5-E** Auditoría integral y activación de rutas (hecho; el commit de D5 espera aprobación expresa).
- [ ] Reutilizar imágenes existentes con layout correcto (sin recorte); galería solo con assets reales.
- [ ] Comprobar drawers, foco, Escape, teclado, móvil y persistencia local.

**Salida:** recorrido completo desde una colección hasta una confirmación ficticia, sin pagos reales.

## 5. Historia y cuestionario

- [x] Crear `/historia` con Fumediro, materiales ficticios y contexto de portfolio.
  - [x] **D7-A** Narrativa, textos y dirección artística aprobados (cuatro capítulos).
  - [x] **D7-B** Primera versión de `/historia` (`src/app/historia/page.tsx`, `StoryForms`, `StoryUniverses`, `src/data/story.ts`).
  - [x] **D7-C** Visibilidad y refinamiento: el capítulo IV «vacío» era un artefacto del navegador de pruebas (sin frames no avanzan las transiciones de `RevealOnView`; ocurre igual en Home y `/colecciones`), sin cambios de código.
  - [x] **D7-D** Auditoría y activación pública (`routes.story.ready = true`, guard de desarrollo eliminado, test de rutas actualizado, metadata propia, indexable). Técnicamente terminada; el commit único de D7 espera aprobación final.
- [x] **D6-A** Definir atributos de recomendación a partir de datos reales del catálogo (capa interpretativa `scentFinder.ts`; simulación de las 400 combinaciones aprobada).
- [x] **D6-B** Algoritmo definitivo y cuestionario de 4 pasos con progreso, retroceso y reinicio (ruta solo en desarrollo; estado final provisional).
- [x] **D6-C** Pantalla de resultados: recomendación, alternativas, fotografía, explicación y enlaces a las fichas (ruta aún solo en desarrollo en ese momento).
- [x] **D6-D** Auditoría y activación pública (`routes.quiz.ready = true`): frases de resultado refinadas, ruta pública, guard de desarrollo eliminado, auditoría de accesibilidad/responsive/privacidad. Cierre de D6 aprobado y guardado en un único commit.
- [x] Testear la función pura de recomendación y casos límite (incluye simulación exhaustiva).
- [ ] Comprobar accesibilidad de inputs, estados y navegación del cuestionario.

**Salida:** historia convincente y experiencia interactiva funcional, no aleatoria.

## 6. Calidad, seguridad y publicación

- [ ] `typecheck`, `lint`, tests unitarios y `build` en verde.
- [ ] Pruebas end-to-end Playwright: navegar, filtrar, quitar filtros, ficha, carrito, quiz, enlaces no existentes.
- [ ] Auditoría axe-core y revisión manual de accesibilidad.
- [ ] Revisar seguridad: secretos, dependencias, rutas, entrada no confiable, enlaces externos y headers según despliegue.
- [ ] Revisar visualmente 320, 360, 390, 430, 768, 1024, 1440, 1920 px, zoom y movimiento reducido.
- [ ] Medir Core Web Vitals/Lighthouse y corregir problemas relevantes; objetivo orientativo ≥90 en categorías principales, sin prometerlo antes de medir.
- [ ] Configurar GitHub Actions con scripts reales.
- [ ] Publicar en Vercel, verificar producción y añadir proyecto al portfolio.
- [ ] Completar README con capturas verificadas, funcionalidades, stack, limitaciones y enlace de producción.

**Salida:** proyecto verificable y presentable en portfolio.

## Priorización y control de cambios

**MVP imprescindible:** web de marca, índice de colecciones, fichas, catálogo filtrable, accesibilidad básica, responsive, carrito simulado, quiz y buenas pruebas. La interacción de cada colección puede comenzar con su variante liviana y mejorarse tras validación.

**Diferible sin bloquear el MVP:** packshots transparentes, 3D, vídeos pesados, CMS, backend, nuevos perfumes, experiencias alternativas de catálogo, comparador avanzado, animaciones sofisticadas entre rutas.

**Regla:** una nueva funcionalidad solo entra si mejora de manera demostrable la experiencia y no deteriora calidad, claridad o rendimiento. La prioridad es completar cada recorrido del usuario de extremo a extremo, no maximizar número de efectos.

## Orden de comandos a concretar al inicializar

No asumir que los scripts ya existen. Una vez configurados `package.json`, definir y usar según corresponda:

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

Los comandos exactos de Playwright, auditorías y CI se establecerán cuando las dependencias estén instaladas.

## Registro de decisiones abiertas (no inventar)

- Tamaños definitivos de los perfumes (los precios de demostración de D5 están decididos y no son comerciales).
- Asset abstracto definitivo de la home.
- Rutas reales y variantes de las fotografías generadas.
- Logotipo definitivo (si reemplaza al wordmark tipográfico).
- Textos comerciales finales y contacto que se desea publicar.

Estas decisiones no deben impedir avanzar con una interfaz y arquitectura de V1 sin datos inventados.

**Documentos de referencia:** [`PRODUCT.md`](./PRODUCT.md), [`DESIGN.md`](./DESIGN.md), [`UX-SPEC.md`](./UX-SPEC.md), [`CLAUDE.md`](./CLAUDE.md).
