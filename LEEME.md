# 💍 Invitación de boda · Guía rápida

Todo es **100% gratis** y **no necesitas cuenta de Google**. La página se publica en **Netlify** (puedes registrarte con tu correo), y Netlify guarda cada confirmación. Cuando quieras, descargas un **CSV** con todas las respuestas.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación |
| `config.js` | ✏️ **Edita aquí** nombres, fecha, lugar, WhatsApp, invitados y mesas |
| `styles.css` / `script.js` | Diseño y animaciones |
| `admin.html` | Tu panel: le pasas el CSV y te muestra el conteo de personas |
| `assets/hacienda.jpg` | Imagen del inicio (cámbiala por una foto real) |

---

## Paso 1 · Personaliza
Abre `config.js` y cambia `novia`, `novio`, `iniciales`, `fechaISO` y la lista de `invitados` (la actual es de **ejemplo**).
Si quieres música, pon un `.mp3` en `assets/` y escribe su ruta en `musica`.

## Paso 2 · Publica gratis en Netlify
1. Crea una cuenta en <https://app.netlify.com/signup> **con tu correo** (no hace falta Google).
2. Entra a <https://app.netlify.com/drop> y arrastra la carpeta `invitacion` completa.
3. Te da un link tipo `https://algo-raro.netlify.app`. Cámbialo en *Site configuration → Change site name* (ej. `ella-y-el.netlify.app`).
4. En *Forms* activa la detección de formularios (**Enable form detection**) y vuelve a arrastrar la carpeta para que detecte el formulario `rsvp`.

## Paso 3 · Mira tus confirmaciones
- En Netlify: **Forms → rsvp** ves cada respuesta.
- Para el conteo total: **Download as CSV** y arrástralo a `admin.html` (puedes abrirlo desde tu computador, sin publicar). Te muestra personas que asisten, cuántos dijeron sí/no, y elimina duplicados si alguien confirmó dos veces.

> El plan gratis de Netlify permite **100 confirmaciones al mes**, suficiente para la mayoría de bodas.
> Si se llegara a pasar del límite o algo falla, la invitación envía automáticamente la confirmación a tu **WhatsApp** como respaldo.

## Alternativa: solo WhatsApp
Si prefieres no usar Netlify Forms, en `config.js` pon `modoRSVP: "whatsapp"`. Cada invitado te enviará un mensaje con su respuesta (no habrá conteo automático).

## ¿Por qué no un .txt o .csv directo en la página?
Los hostings gratis (Netlify, GitHub Pages) sirven páginas **estáticas**: la página no puede escribir archivos en el servidor. Por eso Netlify guarda las respuestas por ti y te las entrega como CSV.

## Consejos de diseño
- Cambia `assets/hacienda.jpg` por una foto real (horizontal, buena luz, ~1600px). Es lo que más impacto genera.
- Esa misma imagen sale como vista previa al compartir por WhatsApp.
