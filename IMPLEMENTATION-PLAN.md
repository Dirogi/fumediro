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

## 4. Fichas y carrito de demostración

- [ ] Crear `/perfumes/[perfumeSlug]` dinámicas, incluyendo notas, descripción y característica especial.
- [ ] Reutilizar imágenes existentes con layout correcto; añadir galería solo con assets reales.
- [ ] Incorporar selección de fragancias, contador, cantidades y borrado del carrito.
- [ ] Mostrar con claridad que no existen pagos reales; no incluir precios o subtotal hasta aprobación.
- [ ] Comprobar drawers, foco, Escape, teclado, móvil y persistencia local si se incorpora.

**Salida:** recorrido completo desde una colección hasta la selección en el carrito de demostración.

## 5. Historia y cuestionario

- [ ] Crear `/historia` con Fumediro, materiales ficticios y contexto de portfolio.
- [ ] Definir atributos de recomendación a partir de datos reales del catálogo.
- [ ] Implementar 4–5 pasos del cuestionario con progreso, retroceso, reinicio y resultado explicado.
- [ ] Testear la función pura de recomendación y casos límite.
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

- Precios y tamaños definitivos de los perfumes.
- Asset abstracto definitivo de la home.
- Rutas reales y variantes de las fotografías generadas.
- Logotipo definitivo (si reemplaza al wordmark tipográfico).
- Textos comerciales finales y contacto que se desea publicar.
- Persistencia local del carrito (opcional).

Estas decisiones no deben impedir avanzar con una interfaz y arquitectura de V1 sin datos inventados.

**Documentos de referencia:** [`PRODUCT.md`](./PRODUCT.md), [`DESIGN.md`](./DESIGN.md), [`UX-SPEC.md`](./UX-SPEC.md), [`CLAUDE.md`](./CLAUDE.md).
