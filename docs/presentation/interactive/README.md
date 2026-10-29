# Finance AI · presentación interactiva (HTML)

Versión animada de las diez diapositivas principales de [`../slides.md`](../slides.md), más las cuatro de respaldo técnico (A–D). Mismo contenido y misma paleta que la app, pero cada idea se explica con una animación en lugar de una imagen fija.

No necesita internet ni instalar nada: son archivos estáticos.

## Abrir

- **Doble clic en `index.html`** (se abre en el navegador). Pulsar `F` para pantalla completa.
- Con servidor local, si el navegador bloquea algo al abrir como archivo:

```bash
python -m http.server 3031 --directory docs/presentation/interactive
```

y abrir http://localhost:3031 (sirve para cualquier compañero con Python instalado).

## Ritmo: casi sin clics

Por defecto la presentación es **fluida**: una pulsación lleva a la escena siguiente y sus pasos se encadenan solos (cada paso espera lo que necesita su animación). Si hay prisa, `→` salta al siguiente paso sin esperar.

| Modo | Tecla | Qué hace |
|---|---|---|
| **Fluido** (por defecto) | — | Los pasos de cada escena se encadenan solos; una pulsación por escena |
| **Manual** | `Mayús+M` | Un paso por pulsación, como diapositivas clásicas. `Mayús+M` otra vez vuelve a fluido. La etiqueta `MANUAL` se pone en ámbar para que no pase desapercibido |
| **Recorrido** | `Mayús+P` o botón ▶ | Sin manos: también cambia de escena y se detiene en la demostración (escena 10). Retroceder o abrir un respaldo lo pausa |

**El modo fluido es el estándar y está pensado para no fallar:**

- Cada escena arranca sola al entrar, sin depender de que el navegador pinte fotogramas.
- Un error dentro de una animación nunca corta el encadenado de pasos.
- Una red de seguridad revisa cada segundo y, si el encadenado se detuviera (por ejemplo, tras volver a la pestaña), lo retoma. No actúa si retrocediste a propósito con `←`: en ese caso espera a que vuelvas a avanzar.
- Mantener una tecla pulsada no salta diapositivas, y un botón con foco (p. ej. tras hacer clic en ▶) ya no se activa de nuevo con Espacio o Enter.
- Los modos manual y recorrido exigen `Mayús`, así que una tecla suelta no cambia el ritmo sin querer.

**Escenas manuales:** una escena con el atributo `data-manual` no encadena sus pasos sola, aunque el modo general sea fluido. Hoy es la 3 (Objetivo general), que se lee en tres partes, una por pulsación. En esas escenas la etiqueta junto al contador marca `MANUAL` en ámbar. El recorrido (`Mayús+P`) sí la recorre sola. Para volver a fluida una escena, quitar `data-manual` en `index.html`.

La etiqueta junto al contador (`AUTO`, `MANUAL`, `RECORRIDO`) muestra el modo activo. Los tiempos están en `DWELL` y `HOLD` al inicio de `deck.js`.

## Controles

| Acción | Tecla |
|---|---|
| Avanzar | `→` · `↓` · `Espacio` · `Enter` · `Re Pág` · clic |
| Retroceder | `←` · `↑` · `Retroceso` · `Av Pág` |
| Primera / última escena | `Inicio` / `Fin` |
| Ir a la escena 1–9 / 10 | `1`…`9` / `0` |
| **Respaldo técnico A–D** | `A` `B` `C` `D` (desde cualquier punto) |
| Volver de un respaldo al mismo punto | `Esc` o `R` o botón «Volver a la presentación» |
| Recorrido automático / modo manual (con Mayús, para no activarlos sin querer) | `Mayús+P` / `Mayús+M` |
| Movimiento: reducir / activar | `V` |
| **Notas de estudio** (mostrar / ocultar) | `N` |
| Pantalla completa | `F` |
| Saltar a una escena | clic en la barra de progreso inferior |

Un control remoto de presentaciones (que envía `→` y `←`) funciona sin configurar nada. La URL guarda dónde vas (`#6/2` = escena 6, paso 2; `#b/3` = respaldo B, paso 3), así que recargar no pierde el punto.

## Notas de estudio (tecla N)

Para ensayar: `N` abre y cierra un panel con lo que se podría decir al jurado en la diapositiva que está en pantalla.

- **Idea clave** de la diapositiva y **tiempo sugerido** (los de la exposición de 6 minutos).
- **Guion**: el guion oral del equipo de `slides.md` para las diez principales; para el respaldo A–D, puntos para responder, tomados de sus notas y de su contenido.
- Mientras la animación avanza, el párrafo que corresponde al paso actual se ilumina (`paso 2/3`) y los demás se atenúan; así se ve cuándo decir cada cosa.
- **Ojo** (cuidados con cifras y alcance) y una frase sugerida **para pasar a la siguiente** diapositiva.
- El panel se queda abierto al cambiar de diapositiva. `Esc` o `N` lo cierran; un clic dentro del panel no avanza la presentación.
- `index.html?notes=on` abre el panel al cargar.

Está pensado solo para estudiar: empieza oculto, no aparece en la pista de teclas de la pantalla de inicio y no hay ningún botón visible. Para cambiar un texto, editar el `<template class="notes">` de la escena en `index.html` (los párrafos con `data-s="n"` se sincronizan con el paso `n`). Si cambia el guion en `slides.md`, actualizarlo también aquí.

## Qué anima cada escena

| # | Escena | Pasos | Idea que explica | Movimiento en reposo (se nota a primera vista) |
|---|---|---:|---|---|
| 1 | Portada | 0 | Frase → propuesta de la IA | Mini demostración en bucle: se escribe la frase, aparece la propuesta y se llena una barra de presupuesto; teléfono con balanceo 3D |
| 2 | Problema y justificación | 2 | El esfuerzo se repite y deja huecos | Formulario que se llena una y otra vez; días sin registrar con halo ámbar y «?» que crecen; punto que viaja por la flecha |
| 3 | Objetivo general | 3 | Lectura guiada: qué, cómo, para qué | El marcador respira, la tarjeta activa late, iconos que flotan |
| 4 | Objetivos específicos | 5 | CDIO como un recorrido de cinco nodos | Orbes que recorren la línea, anillos que se expanden en cada nodo |
| 5 | Propuesta tecnológica | 4 | Una captura recorre Flutter → FastAPI → IA → FastAPI → app → PostgreSQL | Paquetes de datos viajando por cada enlace y un pulso que pasa de nodo en nodo |
| 6 | Captura asistida | 3 | Escribir, revisar campo por campo, confirmar sobre la pantalla real | Ecualizador en «Dictado», cursor en «Texto», modos que se alternan, puntos que laten |
| 7 | Gastos por categoría y período | 3 | Anillo por categoría, períodos, saldo ≠ gasto | La categoría activa se ensancha en el anillo, con su leyenda; punto de luz que recorre el anillo; período que cambia solo |
| 8 | Movimientos y presupuestos | 2 | Del movimiento al progreso del presupuesto | La búsqueda escribe consultas distintas; barras con rayas en movimiento; alerta que vibra; filtros que se iluminan |
| 9 | Conclusiones | 3 | Lo logrado (flujo central), el uso del gasto confirmado y lo que falta medir, con el ciclo captura → revisión → movimientos → análisis; en el paso 3 el centro pregunta «¿Reduce el esfuerzo?» | Dos puntos orbitan y «entregan» a cada nodo con un anillo; nodos que flotan |
| 10 | Probemos con la app real | 0 | Transición a la demostración | Brillo que cruza «app real»; cada paso se ilumina con su barra de progreso |
| A | Respaldo · Modelo de datos | 4 | El saldo se arma movimiento a movimiento | Pulso que recorre la cadena de entidades, flujo en las relaciones |
| B | Respaldo · De palabras a una propuesta | 5 | El mensaje recorre el flujo; el anclaje reconoce las cuentas | Un punto recorre las cinco etapas |
| C | Respaldo · Recibos y voz | 5 | Dos recorridos paso a paso | El paso activo late, el candado se mueve |
| D | Respaldo · Seguridad y calidad | 2 | Contadores de pruebas y cobertura | Los visados de la lista saltan en cadena |

En todas las escenas, además: partículas que suben por el fondo, teléfonos con balanceo 3D y un destello de luz que cruza cada pantalla.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Las catorce escenas y el sprite de iconos. El texto está aquí, en español, editable |
| `deck.css` | Tokens de color, escenario 1280×720 escalado, sistema de revelado, barra inferior, dispositivo |
| `scenes.css` | Composición de las diez escenas principales |
| `backup.css` | Composición de los respaldos A–D |
| `idle.css` | Movimiento en reposo (bucles sutiles) |
| `deck.js` | Motor: pasos, ritmo (fluido, manual, recorrido), teclado, respaldo, hash, escalado, contador animado |
| `scenes.js` | Animaciones propias (flujo de la arquitectura, escritura de la captura, contadores, pipeline de IA) |
| `assets/` | Copia de las capturas reales de la app, el logo y el QR |

## Editar

- **Cambiar un texto**: editarlo en `index.html`.
- **Hacer que algo aparezca en un paso**: clase `rv` y `data-s="n"` (sin `data-s`, aparece al entrar). Variantes: `rv z` (escala), `rv r` (entra desde la derecha), `rv f` (solo fundido). `data-i` ajusta el orden del escalonado. `data-steps="n"` en la escena fija el número de pasos cuando una animación propia lo necesita.
- **Animación propia de una escena**: `Deck.hook('s-id', { step(n, { animate, prev }) {…}, leave() {…}, reset() {…} })` en `scenes.js`. `step` debe dejar la escena en el estado del paso `n`; con `animate: false` (retroceso o salto) pinta el final de inmediato.
- **Tiempo de cada paso**: `DWELL['s-id'][paso]` en `deck.js` (milisegundos que se queda en ese paso antes de pasar al siguiente).
- **Escena de respaldo nueva**: sección con `data-group="backup"` al final de las escenas; la letra se asigna por orden (A, B, C, D…).
- **Movimiento en reposo**: solo en elementos que no sean `.rv` (si no, se pisa la animación de entrada). Va en `idle.css`.
- **Colores**: variables al inicio de `deck.css`; replican la paleta de la app. La escena oscura usa `data-theme="dark"`.
- Los números de las pantallas (442.000, 252.000, 190.000, 3.000.000, presupuestos) son los datos de demostración de las capturas. Las cifras de pruebas (415 y 573) son las documentadas el 16 y 18 de octubre de 2026; no se reejecutan al editar la presentación.

## Movimiento y accesibilidad

El movimiento está **activo por defecto, aunque el sistema pida reducirlo**. Es una presentación, y en muchos equipos Windows tiene las animaciones apagadas («Efectos de animación» en Accesibilidad → Efectos visuales), lo que hace que los navegadores reporten «reducir movimiento» y la presentación se vea quieta.

| Cómo | Efecto |
|---|---|
| Tecla `V` | Alterna entre movimiento completo y reducido, en vivo |
| `index.html?motion=off` | Abre con el movimiento reducido |
| `index.html?motion=system` | Respeta la preferencia del sistema operativo |

En modo reducido se apagan las partículas y todos los bucles, y las transiciones quedan breves. Además: las barras de progreso son botones con etiqueta, el título de cada escena se anuncia a lectores de pantalla y los elementos decorativos están ocultos para ellos.

## Alcance

- Es la versión **online** descrita en la exposición. No incluye funciones de la rama offline-first.
- Las notas del orador siguen en Slidev (`npm run dev`, vista `/presenter`).
- Si cambian las capturas en `public/screens/`, copiar las nuevas a `interactive/assets/`.
