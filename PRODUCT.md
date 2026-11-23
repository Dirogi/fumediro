# FUMEDIRO — Producto y catálogo

**Versión:** 1.0 · **Estado:** especificación base aprobada · **Fecha:** 11/11/2026  
**Ámbito:** proyecto ficticio de portfolio; no es una tienda operativa.

## 1. Qué es Fumediro

**Fumediro** es una marca ficticia de perfumería experimental de lujo. Sus fragancias se conciben como experiencias olfativas y objetos escultóricos, con materiales y efectos distintivos en el frasco. La marca se presenta exclusivamente como **Fumediro**: nunca «Maison Fumediro». El nombre de marca y de productos no presupone derechos de propiedad industrial; comprobar disponibilidad antes de cualquier uso comercial real.

**Claim de trabajo:** *Beyond scent. Beyond form.* (revisable, no traducir automáticamente como nombre de marca).

**Valores del producto:** originalidad plausible; acabado premium; funcionalidad realista (base estable, atomizador utilizable); armonía entre colecciones distintas; claridad y accesibilidad digital.

**Naturaleza ficticia:** DiroCore™, la resistencia extraordinaria, los módulos LED y las cámaras/recubrimientos especiales pertenecen al universo conceptual de la marca. Evitar presentarlos como tecnología demostrada o certificada; incluir una mención discreta y comprensible de «marca/proyecto conceptual» en el sitio (por ejemplo en el pie y la página de historia). No afirmar «irrompible» como garantía real, ni inventar ensayos, patentes, sellos o certificaciones.

## 2. Alcance del lanzamiento: exactamente 15 fragancias

**Fuente canónica para la V1** (orden editorial inicial, sin obligación de destacarlas por encima de sus compañeras):

| Colección | Slug | Tres fragancias incluidas en V1 |
|---|---|---|
| VOLTARA | `voltara` | ION (`ion`), PULSE (`pulse`), SOLARIS (`solaris`) |
| FLORA ARCANA | `flora-arcana` | AURELIS (`aurelis`), CORALLIS (`corallis`), VIRELIA (`virelia`) |
| COSMORA | `cosmora` | AURORA (`aurora`), ECLIPSE (`eclipse`), ORION (`orion`) |
| PRISMATICA | `prismatica` | AMETHYS (`amethys`), AUREON (`aureon`), CHROMA (`chroma`) |
| THERMAE | `thermae` | BLUSH (`blush`), GLACIER (`glacier`), TERRA (`terra`) |

**Ortografía obligatoria:** `CORALLIS` (no «Coralis»). Los frascos maestros iniciales ARC, NYMPHEA NOX, NEBULA, SPECTRA y EMBER **no forman parte del catálogo de lanzamiento**, aunque sus imágenes puedan servir como referencia interna de dirección artística. Tampoco se lanza ningún cuarto perfume por colección hasta aprobación posterior. No insertar un producto adicional en la web para llenar una cuadrícula.

Cada fragancia debe pertenecer a una sola colección. Las colecciones contienen listas de IDs, no páginas duplicadas a mano.

## 3. Colecciones: lenguaje de producto

### VOLTARA — energía contenida
- Siluetas de orbe con base plana y ligeras variaciones de diseño; vidrio óptico y metal premium.
- Efecto especial: iluminación LED integrada de intensidad contenida, aislada del depósito de fragancia.
- Perfumes V1: **ION** (verde esmeralda, estructura radial; perfil verde aromático), **PULSE** (magenta, nervaduras curvas; floral especiado), **SOLARIS** (ámbar/dorado, núcleo óptico suspendido; ambarado especiado).
- Interacción digital: control explícito para encender/apagar una **simulación** de luz en el frasco.

### FLORA ARCANA — botánica imaginaria
- Frascos que evocan flores singulares, orgánicas, no reproducciones literales de flores corrientes.
- Perfumes V1: **AURELIS** (marfil/oro; espiral floral; neroli, magnolia y cítricos), **CORALLIS** (coral opalino; cinco pétalos estructurales; perfil floral afrutado), **VIRELIA** (verde jade; cáliz vertical asimétrico; perfil verde amaderado).
- Interacción: exploración de partes de la flor ficticia y relación con notas olfativas.

### COSMORA — universo encapsulado
- Frascos de doble pared: depósito de fragancia separado de cámara decorativa sellada con fluido y micropartículas reflectantes ficticias.
- Perfumes V1: **AURORA** (verde polar / azul petróleo; reflejos aurorales; floral verde), **ECLIPSE** (cobre oscuro / negro; disco aplanado; amaderado especiado), **ORION** (azul oscuro / plata; prisma redondeado; aromático amaderado).
- Interacción: simulación ligera del movimiento de partículas. El efecto decorativo nunca se confunde con ingredientes reales del perfume.

### PRISMATICA — óptica y refracción
- Cuerpos facetados con geometría elegante; cambios visuales por **iluminación externa**, no LEDs.
- Perfumes V1: **AMETHYS** (amatista / sección hexagonal; floral empolvado), **AUREON** (champagne / facetas amplias; ambarado luminoso), **CHROMA** (azul hielo / prisma helicoidal; fresco mineral).
- Interacción: regulador de dirección/intensidad aparente de la luz para explorar reflejos.

### THERMAE — tacto y temperatura
- Volúmenes ergonómicos de acabado mineral o cerámico, con capa termorreactiva ficticia sobre el exterior.
- Perfumes V1: **BLUSH** (marfil rosado; halos rosa cálido; floral almizclado), **GLACIER** (gris perla / vetas azuladas; fresco aromático), **TERRA** (marrón mineral / vetas arena y bronce; amaderado terroso).
- Interacción: control deliberado que simula el cambio visual por calor, sin afirmar detección física real de temperatura del usuario.

## 4. Tecnología de la marca

**DiroCore™:** familia de materiales **ficticia** que permite imaginar vidrios avanzados, compuestos cerámicos y superficies de gran resistencia. No presupone que todos los frascos sean transparentes. Las subtecnologías del universo creativo pueden describirse como **LumaCore™** (luz), **Nebula Chamber™** (cámara de partículas), **PrismaLayer™** (óptica) y **ThermaSkin™** (termorreactividad), todas **conceptuales**. No presentar especificaciones técnicas inventadas como resultados de laboratorio.

## 5. Información que debe tener cada perfume

Modelo de datos previsto: `id`, `slug`, `collectionId`, `name`, `shortDescription`, `story`, `olfactoryFamily`, `characterTags`, `topNotes`, `heartNotes`, `baseNotes`, `accentColor`, `images` (referencias locales), `specialFeature`, `availableFormats`, `isFeatured` (opcional); los precios viven aparte en `src/data/demoPricing.ts`. Todos los campos públicos deben ser coherentes con lo visible.

**Precios de demostración (D5):** importes ficticios en euros, en céntimos, en `src/data/demoPricing.ts`, separados de las características de los perfumes. Corresponden a una demostración de portfolio, **no** a productos comercializados, y se rotulan como tales en la interfaz.

**No están definidos:** tamaños, volumen, concentración, textos comerciales finales completos, inventario, promociones, envíos, impuestos, logística ni obligaciones de una tienda real. No inventarlos.

**Cuestionario (D6):** las asociaciones de descubrimiento (paleta, territorio, forma, concepto) viven en `src/data/scentFinder.ts`, separadas de los datos oficiales; son una interpretación editorial, no propiedades del producto. Los campos `characterTags` y `quizAttributes` no se usan por ahora. Desde D6-D el cuestionario es público en `/descubre-tu-aroma`; las explicaciones citan siempre el dato oficial (AURELIS, sin familia olfativa, solo sus notas).

## 6. Objetivos de la primera versión

- Presentar una identidad de marca original, profesional y coherente.
- Explorar cinco colecciones mediante páginas individuales.
- Descubrir y filtrar 15 fragancias sin lag ni interacciones intrusivas.
- Consultar fichas dinámicas de producto y notas olfativas.
- Completar un cuestionario de recomendación determinista y explicable.
- Añadir productos a un carrito **de demostración** y completar un checkout **simulado** con confirmación ficticia, sin cobros, sin datos de tarjeta y sin pedidos reales.
- Ofrecer experiencia excelente para smartphone, tablet, ordenador, teclado y tecnologías de asistencia.
- Permitir añadir fragancias/colecciones a partir de datos y recursos, no de páginas copiadas.

## 7. Fuera del alcance inicial

- Checkout **real** (el simulado de D5 sí entra en alcance), pasarelas de pago, cuentas de usuario, base de datos de clientes, seguimiento de pedidos o stock real.
- Modelado 3D obligatorio, WebGL en todas las páginas, sistemas de partículas pesados.
- CMS o backend sin una necesidad demostrada.
- Generación automática de imágenes desde la aplicación.
- Integraciones de servicios externos que requieran credenciales reales.

## 8. Referencias visuales

Las 15 fotografías generadas constituyen la **biblioteca creativa aprobada**, pero sus nombres/rutas definitivos se registrarán al incorporarlas al repositorio. No asumir que están presentes en `public/` hasta comprobarlo. Conservar primero las versiones con fondo; los recortes transparentes se crearán solo cuando los necesite la interfaz y después de verificar vidrio, reflejos y bordes.

**Documentos relacionados:** [`DESIGN.md`](./DESIGN.md) para criterios visuales; [`UX-SPEC.md`](./UX-SPEC.md) para comportamiento; [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) para entregas.
