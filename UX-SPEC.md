# FUMEDIRO — Especificación de UX y navegación

**Versión:** 1.0 · **Estado:** UX acordada; detalles de implementación abiertos a validación en navegador.

## 1. Principios

- **Profesionalidad primero:** contenido comprensible, navegación predecible y compra simulada clara.
- **Creatividad con intención:** experiencias destacadas por colección, sin saturación ni tiempos de espera impuestos.
- **Sin perfume privilegiado en Home:** el hero presenta la **marca**, no uno de los quince frascos.
- **Mobile-first real:** gestos táctiles opcionales; todas las funciones tienen controles visibles/accesibles.
- **Escalabilidad:** la cantidad de páginas no se codifica a mano; deriva de datos de colecciones y productos.

## 2. Rutas propuestas (Next.js App Router)

| Ruta | Responsabilidad |
|---|---|
| `/` | Home: identidad, cinco universos y CTA de descubrimiento |
| `/perfumes` | Catálogo completo y filtros |
| `/colecciones` | Índice editorial de colecciones |
| `/colecciones/[collectionSlug]` | Página de colección (datos + tratamiento temático) |
| `/perfumes/[perfumeSlug]` | Ficha de producto (plantilla compartida) |
| `/historia` | Filosofía de Fumediro y materiales ficticios |
| `/descubre-tu-aroma` | Cuestionario interactivo de recomendación |
| `/contacto` | Información de contacto de demostración / naturaleza del proyecto |
| `/checkout` | Checkout **simulado** (formulario con datos de ejemplo y confirmación ficticia en la misma ruta) |

`[collectionSlug]` y `[perfumeSlug]` son segmentos dinámicos, con 404 correcto para entradas desconocidas. Mantener una convención estable de URLs y metadata. Carrito como panel accesible de interfaz (sin página `/carrito`) y checkout simulado en `/checkout`: **no** una tienda operativa ni un checkout real.

## 3. Navegación global

**Cabecera:** marca FUMEDIRO (enlace a `/`), «Colecciones», «Perfumes», «Descubre tu aroma», «Nuestra historia» e icono de carrito con contador. Contacto en pie de página. Las páginas internas pueden disponer de breadcrumbs.

**Escritorio:** barra glassmorphism de apariencia ligera; cabecera visible sin invadir demasiado el hero, con estados hover/focus claros. No imponer sticky si perjudica la composición: validar en prototipo.

**Móvil/tablet estrecha:** marca, botón menú y carrito. Menú desplegable/panel con gestión de foco, Escape, clic fuera cuando proceda y cierre tras navegar. No depender de hover; respetar safe areas.

**Transiciones de ruta:** cortas, elegantes y no bloqueantes; el navegador debe conservar comportamiento correcto de back/forward, historial, anclas y foco. Si falla una animación, la navegación sigue funcionando.

## 4. Home — contenido y comportamiento

**Hero «The Essence»:** composición abstracta de bruma, material óptico y luz, sin elevar un frasco concreto como protagonista. Marca «FUMEDIRO», claim provisional «Beyond scent. Beyond form.» y CTA «Explorar colecciones». El texto será HTML accesible, nunca parte fija de la imagen. Carga inicial rápida; preferir imagen optimizada con movimiento ligero opcional a vídeo pesado por defecto.

**Secuencia de secciones propuesta:**
1. Hero de marca.
2. Introducción breve: perfume + materia + diseño.
3. Los cinco universos en una presentación **equitativa** y explorable; cada uno enlaza a su página.
4. Selección editorial de productos rotatoria o equilibrada, **sin designar un flagship permanente**.
5. Breve bloque sobre la innovación ficticia DiroCore™ y la historia.
6. CTA hacia «Descubre tu aroma».
7. Pie con navegación secundaria y nota de proyecto conceptual.

**Selector de universos:** un sistema de cinco opciones (VOLTARA, FLORA ARCANA, COSMORA, PRISMATICA, THERMAE), cada una con un acento y descripción, sin alterar la estructura común. En móvil debe poder explorarse por botones o scroll accesible, no por hover.

## 5. `/colecciones` y `/colecciones/[collectionSlug]`

**Índice:** cinco tarjetas/secciones editoriales distintas; acceso igualitario, imágenes y descripciones concisas. Al añadir nuevas colecciones, se integrarán sin modificar esta página.

**Página individual:** (a) hero e identidad de colección, (b) qué la hace especial, (c) los **tres perfumes activos de V1**, (d) una interacción propia de colección, (e) acceso al resto del catálogo o la siguiente colección como enlace normal.

**Experiencias** (progresive enhancement, no bloqueantes):
- VOLTARA: interruptor de luz LED simulada.
- FLORA ARCANA: explorador botánico y notas.
- COSMORA: efecto de micropartículas ligero y accesible.
- PRISMATICA: slider de iluminación/refracción.
- THERMAE: slider o botón de transformación térmica simulada.

Cada colección puede declarar `experienceType` o ID de variante, mapeado a un componente concreto mediante un registro explícito. No crear un componente nuevo por cada perfume. Para añadir una colección con una **experiencia especial nueva** sí podrá ser necesario implementar una nueva variante; el alta de colección normal no requiere reescritura del sitio.

## 6. Catálogo `/perfumes`

**Objetivo:** catálogo evocador pero rápido de usar. Los 15 perfumes aparecen inicialmente sin filtros. Diseño editorial con tarjetas consistentes; enlaces a las fichas.

**Filtros iniciales:** colección (multi/single según solución UX), familia olfativa, carácter/etiquetas sensoriales; orden opcional por nombre. Generar opciones desde los datos reales; nunca filtros vacíos o etiquetas de características que no existan. «Limpiar filtros» visible. Preferentemente reflejar filtros en query params para compartir enlace y usar historial correctamente.

**Efecto «Fragrance Reveal» al cambiar filtros:**
1. Actualizar estado/datos sin retraso artificial.
2. Atenuar brevemente tarjetas antiguas.
3. Pasar una bruma muy sutil (idealmente overlay de bajo coste).
4. Mostrar nuevas tarjetas con opacidad / leve desplazamiento.

**Duración objetivo:** alrededor de 300–450 ms, reducible según pruebas; una interacción rápida sucesiva cancela/transiciona limpiamente la anterior. No bloquear controles. Reducir o eliminar efecto con `prefers-reduced-motion`; mantener anuncio accesible y no excesivo del número de resultados. El efecto nunca se usa para ocultar una carga real.

**Estados:** sin filtros, filtros activos, cero resultados con CTA limpiar, falta de imagen (placeholder elegante), error de cliente sin pérdida de navegación.

**Móvil:** filtros en drawer accesible, chips o contador de filtros seleccionados visibles, grid adaptable de una o dos columnas; nunca obligar a arrastrar una barra horizontal para consultar todos los productos.

## 7. Fichas `/perfumes/[perfumeSlug]`

Plantilla compartida para los 15 perfumes: imagen editorial principal, galería futura (sin inventar imágenes), nombre, colección enlazada, precio de demostración, controles de compra simulada y, **solo cuando estén aprobados**, historia, familia olfativa, notas (pirámide o lista), rasgos del frasco y explicación de innovación. Ningún dato ausente se inventa: su fila no se muestra. Dirección editorial minimalista, sin valoraciones, stock, descuentos ni urgencia comercial. No inventar tamaños ni añadir mensajes falsos de stock.

**Escritorio:** imagen e información en columnas con jerarquía fuerte. **Móvil:** imagen superior, contenido en lectura vertical; controles accesibles y CTA visible sin tapar secciones. Ofrecer navegación a productos relacionados de la misma colección de manera derivada de datos.

Si existe una experiencia visual en ficha, reutilizar el componente de colección donde tenga sentido y no hacerla obligatoria para entender la fragancia.

## 8. Cuestionario `/descubre-tu-aroma`

**Nombre de trabajo:** *The Scent Finder*. Cuatro preguntas, una respuesta por pantalla: **paleta** (Verdes; Azules y plata; Rosas y corales; Magenta y violeta; Oro, cobre y tierra), **territorio olfativo** (Floral; Verde y fresco; Amaderado; Ámbar y especias), **forma** (Curvas y formas botánicas; Facetas y geometría; Luz y reflejos; Volúmenes y vetas) y **concepto de colección** (Luz interior, Flor imaginada, Cosmos sellado, Reflejos y refracción, Respuesta cromática al calor). Sin inferencias sensibles ni datos personales.

**Lógica:** función pura, determinista y probada (`src/lib/scentFinder.ts`) sobre una capa interpretativa independiente del catálogo (`src/data/scentFinder.ts`). Cada perfume tiene una asociación principal (3 puntos) y, si procede, una secundaria (1 punto) por paleta, territorio y forma; el concepto suma 3 si coincide con su colección. Toda asociación cita el dato oficial que la respalda (`olfactoryFamily`, `notes`, `colorway` o `specialFeature`); sin esa evidencia no puntúa. Desempate: 1) puntuación total, 2) afinidad con el territorio, 3) con la forma, 4) con la paleta, 5) orden del catálogo. Sin azar, sin porcentajes de compatibilidad, sin precios. Una recomendación principal y hasta dos alternativas con coincidencias en al menos dos dimensiones. Las asociaciones son una lectura editorial de descubrimiento, no propiedades físicas u olfativas. Añadir un perfume = añadir su perfil en `scentFinder.ts`.

**UX:** bienvenida («Descubre tu aroma.», «Comenzar»), progreso visible («Pregunta n de 4»), radios nativos con «Continuar» (sin avance automático; indica por qué está inactivo), «Atrás» con selección conservada, «Reiniciar», gestión de foco y teclado completo. Las respuestas solo viven en memoria: sin cuenta, email, persistencia ni envío. **Resultado (D6-C):** «Tu universo tiene una forma.» con fotografía y nombre de la fragancia principal, las razones (una por coincidencia, con la cita concreta del dato oficial y la opción elegida), un aviso editorial discreto, acciones «Descubrir [perfume]» y «Explorar [colección]» hacia las páginas reales, y «Quizá también te atraigan.» con 0, 1 o 2 alternativas (nunca se rellenan). Sin puntuaciones, porcentajes, precio ni carrito. «Cambiar respuestas» conserva la selección; «Volver a empezar» la borra. **Activación (D6-D):** `routes.quiz.ready = true`; `/descubre-tu-aroma` es pública (cabecera, menú móvil, pie y cierre de la Home la enlazan) y se indexa con metadatos propios. Las razones usan plantillas cortas por tipo de evidencia y nivel (principal/secundaria), citan el dato oficial sin comillas y no repiten fórmulas.

## 9. Carrito de demostración

- Añadir producto, cambiar cantidad, eliminar y vaciar; icono con contador coherente.
- Drawer lateral en escritorio y panel adaptado en móvil.
- Subtotal calculado con los precios de demostración (`demoPricing.ts`); máximo 9 unidades por referencia como límite técnico (no es stock). El total de demostración es igual al subtotal: sin envío ni impuestos inventados.
- Persistencia local (`localStorage`) de ids y cantidades con validación de esquema; ids desconocidos y cantidades inválidas se descartan; no guardar datos financieros ni personales.
- Checkout `/checkout`: formulario con datos de ejemplo precargados y editables, sin tarjeta, DNI ni fecha de nacimiento; nada se envía ni se almacena; confirmación ficticia en la misma ruta con identificador local de demostración.
- Mensaje inequívoco de «experiencia demostrativa; no se realizan compras» y ninguna pasarela de pago real.
- Confirmaciones y estados accesibles; gestión correcta de foco.

## 10. Historia `/historia`

Narrativa sobria: visión de Fumediro, cinco colecciones, diseño escultórico, materiales DiroCore™ y las tecnologías ficticias asociadas. Explicar de forma transparente que es un **proyecto conceptual de portfolio**. No inventar fechas de fundación, laboratorios, premios, patentes o certificaciones. Contenido organizado en secciones editoriales y paneles de cristal selectivos.

**Estructura (D7-B, textos aprobados):** cabecera «Nuestra historia.» con entradilla; I Manifiesto («Un perfume no termina en su aroma.», lema una sola vez con `lang="en"`, sin traducción); II «La forma también habla.» (banda grafito; ION, AUREON y CORALLIS en su proporción real, pies con enlace a la ficha; DiroCore™ presentado como familia ficticia); III «Cinco formas de imaginar.» (cinco filas-enlace a las colecciones; luz ambiental solo con hover/foco, nada esencial depende de ella); IV «Empieza por donde quieras.» (acción principal «Descubre tu aroma», secundarias «Ver los quince perfumes» y «Explorar colecciones», y nota de proyecto conceptual). Textos de catálogo en `src/data/story.ts`. Activa desde D7-D: la enlazan cabecera, menú móvil y pie, y se indexa con metadatos propios.

**Contacto (D8-B, textos aprobados):** `/contacto` sin formulario ni backend: H1 «Toda idea empieza con una conversación.», entradilla, bloque «Hablemos de ideas.», un único panel de cristal con «Escribir un correo» (`mailto:` con asunto «Sobre FUMEDIRO») y «Ver mi portfolio» (nueva pestaña, `noopener noreferrer`, anunciada a lectores de pantalla) y nota de transparencia en banda grafito. En móvil el panel de acciones precede al bloque editorial. Activa públicamente desde D8-D (`routes.contact.ready = true`, guard de desarrollo eliminado, metadata propia, indexable); permanece solo en el pie, no en cabecera ni menú móvil.

**Ajustes D8-C2:** el menú móvil ya no muestra el aviso «Otras secciones se abrirán por fases». Las migas amplían su área pulsable con un `::after` (sin mover el texto). Los enlaces del índice de colecciones usan un nombre accesible que contiene el texto visible. PERF-1 (aviso de consola en `/perfumes` con viewports estrechos: la precarga de las tres primeras tarjetas pide `w=384` mientras la imagen usa `w=640`) se deja sin cambios: es un desajuste de candidatos de `srcset` sin evidencia de impacto medido en LCP; revisar tras publicar con métricas reales.

**Cierre D8-D:** Contacto activa; todas las rutas de `routes.ts` están activas. SEO dependiente de la URL de publicación (`metadataBase`, canonical, Open Graph/Twitter, `robots.ts`, `sitemap.ts`) pendiente hasta definir el dominio; checkout mantiene `noindex`. No verificados: zoom real al 200 % ni lector de pantalla real.

**SEO y metadatos (P3-B2):** URL canónica única `https://fumediro.vercel.app` (`metadataBase` en el layout; `pageMetadata` en `src/lib/seo.ts` fija canonical, Open Graph y Twitter por página, sin parámetros del catálogo). `robots.ts` permite el rastreo de todo (`Allow: /`) y apunta al sitemap; el checkout no se bloquea para que los rastreadores lean su `noindex, nofollow`. `sitemap.ts` lista las 26 páginas editoriales (sin checkout, sin filtros, sin `lastModified`). Imagen social: `public/images/og/fumediro-social.jpg` (JPEG 1200×630, ≈70 KB), copia optimizada del hero abstracto `hero-desktop.png` (original intacto, 1672×941, 1,8 MB) con recorte centrado conservador (≈7 % vertical), sin texto ni añadidos. Sin datos estructurados `Organization`/`Product`, cuentas sociales ni analítica.

## 11. Contratos de experiencia

- Toda página tiene título visible, metadata y navegación clara.
- No hay interacciones esenciales exclusivamente hover o arrastrar.
- Se puede llegar al contenido de cualquier perfume en enlaces reales.
- Los enlaces no dependen de animaciones ni de conexión a APIs externas.
- Los resultados del catálogo y el quiz se derivan exclusivamente del catálogo V1 real.
- No introducir bloqueos por scroll, vídeos de reproducción obligatoria o transiciones de varios segundos.

## 12. Criterios de validación

Probar escritorio/tablet/móvil con teclado y táctil; filtros sucesivos rápidos; búsqueda sin resultados (si existe); estado carrito vacío/lleno; páginas inexistentes; navegación atrás/adelante; reducción de movimiento; zoom 200 %; menú y drawer; salida del quiz y reinicio. Registrar incidencias y resolver las graves antes de lanzar.

**Ver también:** [`PRODUCT.md`](./PRODUCT.md), [`DESIGN.md`](./DESIGN.md), [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).
