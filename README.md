# mannmish-2.0

A new website for **Mannmish Design Studio** — architecture, interior design and
construction management, Ahmedabad.

Static HTML/CSS/JS. No build step, no framework. The 3D is built procedurally with
[three.js](https://threejs.org) — there are no model or texture files to download.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — 3D villa hero, interactive floor-plan explorer, work, expertise |
| `about.html` | The studio, founders, design philosophy, five-stage process |
| `projects.html` | Selected work, filterable, with a lightbox |
| `contact.html` | Enquiry form, studio details, map |

## Interactive pieces

- **Hero villa** — drag to orbit. Three view modes (Massing / X-Ray / Exploded) and a
  daylight slider that moves the sun, warms the light at golden hour and switches the
  interior lights on after dark. It opens on the visitor's local time.
- **Spatial walkthrough** — a sectioned 3D model of a 3 BHK with real walls, door and
  window openings, floor finishes and furniture. Hover a room to inspect it; switch
  between the 3D model and a true top-down plan.

## Structure

```
assets/site.css     all shared styles
assets/site.js      shared UI: loader, nav, reveals, counters, accordion, tilt
assets/*.jpg        project photography
```

Page-specific 3D lives in a `<script>` at the bottom of each page.

## Running it

Any static server:

```sh
python3 -m http.server 8777
```

## Before going live

- The contact form composes a `mailto:` — wire it to a real endpoint (Formspree, Resend,
  an API route) before launch.
- Project meta values (scope, status) are placeholders — replace with the real data.
