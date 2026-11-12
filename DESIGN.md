# FUMEDIRO — Sistema de diseño

**Versión:** 1.0 · **Estado:** dirección visual aprobada; implementación y validación pendientes.

## 1. Personalidad visual

**Editorial de lujo contemporáneo + glassmorphism refinado + movimiento sensorial.** La marca se llama **Fumediro**, sin «Maison». Un solo sistema visual ha de abrazar cinco colecciones diferentes. Debe sentirse sofisticado, preciso y ligeramente experimental; evitar neones indiscriminados, efectos tipo videojuego, tarjetas genéricas de SaaS y animaciones que estorben.

## 2. Tipografía

- **Cormorant Garamond:** titulares editoriales, grandes nombres de fragancia y citas breves. Seleccionar pocos pesos; evitarla en controles pequeños o párrafos largos.
- **Manrope:** navegación, cuerpo, filtros, formularios, precios futuros, datos y botones.
- Tipografía fluida con `clamp()` y límites razonables. Priorizar una longitud de línea legible (aprox. 60–75 caracteres para párrafos largos) e interlineado cómodo.
- **FUMEDIRO** como marca tipográfica inicialmente; si se crea un logotipo personalizado, deberá conservar legibilidad y versiones monocromas.
- Carga optimizada con `next/font` cuando proceda, sin descargas arbitrarias de fuentes ni recursos externos en ejecución.

## 3. Paleta de marca

| Token propuesto | Valor | Uso preferente |
|---|---|---|
| `--color-charcoal` | `#14171B` | Fondo cinematográfico y pie |
| `--color-graphite` | `#252A30` | Superficies oscuras secundarias |
| `--color-ivory` | `#F2EEE6` | Texto claro y zonas editoriales claras |
| `--color-silver` | `#B9C0C7` | Bordes, iconos y texto secundario solo si hay contraste suficiente |
| `--color-champagne` | `#C7AD83` | Acento de lujo ocasional, no todo el texto |

Definir además tokens semánticos (`background`, `foreground`, `surface`, `border`, `muted`, `focus`) en cada contexto oscuro/claro. **No** aplicar texto blanco sobre fondos claros o fotografías con poco contraste. Añadir velo/overlay cuando sea imprescindible y comprobar contraste en estado normal, hover, focus y disabled.

**Acentos por colección:** Voltara — magenta/verde/ámbar; Flora Arcana — jade/coral/marfil; Cosmora — azul/violeta/cobre; Prismatica — amatista/champagne/azul hielo; Thermae — rosa/mineral/terracota. Los acentos apoyan el contenido; la navegación y los patrones de interacción siguen siendo comunes.

## 4. Glassmorphism (uso selectivo)

Crear componentes reutilizables, no estilos aislados copiados por página:

- `GlassNav`: navegación horizontal flotante/sutil en escritorio; menú compacto en móvil.
- `GlassButton`: variantes primaria/secundaria, bordes definidos, texto legible, estados claros.
- `GlassPanel`: bloques de texto, historia, introducciones y contenido explicativo.
- `GlassFilterBar` / `GlassFilterDrawer`: filtros de catálogo.
- `GlassCartPanel`: carrito de demostración.

**Receta orientativa** (ajustar sobre fotografías reales):

```css
.glass-panel {
  background: rgb(20 23 27 / 55%);
  border: 1px solid rgb(242 238 230 / 24%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
```

Evitar desenfoques grandes repetidos, saturación de capas transparentes o glassmorphism en bloques con texto extenso cuando perjudique legibilidad. Ofrecer un color de fondo suficientemente opaco si el navegador no soporta el filtro; para `prefers-reduced-transparency` si está disponible, usar superficie opaca. Los bordes deben ser perceptibles sin parecer marcos luminosos pesados.

## 5. Composición y componentes

- Diseño editorial de espacios amplios; asimetría deliberada pero no arbitraria.
- Hero de la home **sin un perfume protagonista**. Utilizar un concepto abstracto propio de vapor/luz/vidrio, nombre FUMEDIRO, claim y CTA claro.
- Las cinco colecciones reciben un peso equivalente en la página principal.
- Componentes comunes: encabezado, pie, tarjetas de colección, tarjetas de perfume, botones, paneles, breadcrumbs, filtros, etiquetas, controles de experiencias, estados vacíos y mensajes de estado.
- No renderizar textos, botones, logos o precios como parte fija de imágenes generadas cuando sea posible representarlos de manera real con HTML/CSS; considerar que algunos assets existentes sí llevan rotulación fotográfica, que habrá que evaluar visualmente.
- Evitar introducir nuevas bibliotecas de componentes solo por decorar; priorizar componentes propios simples y accesibles.

## 6. Sistema de movimiento

**Principio:** «la interfaz responde como una fragancia: aparece, se difunde y deja espacio». Solo animar cuando aclara una transición o aporta carácter.

| Tipo | Uso | Duración orientativa |
|---|---|---|
| Feedback | hover, focus/pressed | 150–220 ms |
| Reveal | entrada de tarjeta o bloque | 250–450 ms |
| Bruma | transición de resultados filtrados | 300–450 ms |
| Página | transición ligera sin bloqueo | 200–350 ms |
| Efecto de colección | interacción explícita | según control; sin bucles intrusivos |

Usar preferentemente `opacity` y `transform`; no animar propiedades costosas por defecto. Aplicar easing suave y consistente; evitar rebotes fuertes, scroll hijacking y transiciones que impidan interactuar. Respetar `prefers-reduced-motion`: sin efectos de partículas, desplazamientos o transiciones significativas; mostrar inmediatamente el estado correcto. El filtrado actualiza el resultado de forma fiable incluso si el usuario repite acciones rápidamente.

### Efectos únicos por colección

- **Voltara:** interruptor «Luz encendida/apagada», simulación visual (no hardware real).
- **Flora Arcana:** explorar anatomía conceptual de cada flor y notas olfativas.
- **Cosmora:** cámara estelar con micropartículas ligeras o secuencia pre-renderizada.
- **Prismatica:** slider óptico para modificar la iluminación aparente.
- **Thermae:** control de «calor» que transforma gradualmente colores/patrones.

El contenido principal debe funcionar si el efecto falla o se desactiva.

## 7. Responsive y táctil

Diseñar primero la estructura fluida, no un escritorio encogido. Revisar como **muestras de prueba** 320, 360, 390, 430, 768, 1024, 1440 y 1920 px, además de dimensiones intermedias, orientaciones y zoom al 200 %. Los breakpoints reales derivarán de las necesidades del contenido.

- Menú accesible en móvil, sin hover obligatorio.
- Filtros en drawer o panel táctil; resultados y estado de filtros visibles.
- Catálogo adaptable: normalmente 2 columnas en móvil si hay ancho suficiente; 1 si mejora legibilidad; 3–4 en escritorio según contenedor.
- Ficha: composición editorial de dos columnas en escritorio y una en móvil.
- CTA, controles y botones táctiles con objetivo de zona interactiva de alrededor de 44×44 px o superior cuando corresponda.
- Imágenes responsivas con recortes/encuadres adecuados; no borrar información crítica con `object-fit: cover`.

## 8. Accesibilidad

Objetivo: buenas prácticas WCAG 2.2 AA con verificación, no proclamación automática de conformidad. Teclado completo, foco visible, semántica HTML, nombres accesibles, contraste suficiente, feedback de estado, `aria-live` moderado para resultados filtrados, `alt` útil en fotos de producto, alt vacío en adornos, orden correcto de encabezados, sin trampas de foco. Modales/drawers deben manejar apertura, cierre por Escape, foco y restitución del foco. No depender exclusivamente de color o movimiento.

## 9. Imágenes

Usar de inicio las 15 imágenes aprobadas **con su fondo**. Separar assets **editoriales** y **packshots aislados**; los transparentes se prepararán más adelante si aportan valor. Comprimir y servir imágenes en tamaños adecuados con `next/image` cuando proceda; definir dimensiones para evitar saltos de layout. Tratar con especial cuidado refracciones, vidrio y etiquetas en posibles recortes. No suponer nombres/rutas de archivos no verificados.

## 10. Criterios de calidad visual

- Parece una única marca aunque cada colección tenga personalidad.
- Ningún perfume es el héroe exclusivo de la home.
- El glassmorphism tiene una función, no cubre cada elemento.
- Toda interacción importante funciona sin animaciones y en pantalla táctil.
- No hay desplazamiento horizontal accidental, botones inalcanzables ni textos ilegibles.
- Cada imagen es consistente con el producto real dentro de esta ficción.

**Ver también:** [`PRODUCT.md`](./PRODUCT.md), [`UX-SPEC.md`](./UX-SPEC.md).
