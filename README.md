# DIGECOG 360° — Plataforma Integral de Gestión y Analítica Contable Gubernamental

Prototipo de alta fidelidad, 100% front-end (sin backend ni llamadas de red), que simula cómo podría
funcionar tecnológicamente la Dirección General de Contabilidad Gubernamental (DIGECOG) si integrara
en un solo ecosistema digital sus funciones rectoras, contables, financieras, estadísticas, normativas
y de planificación institucional.

Todos los datos financieros, de cumplimiento y de calidad son **sintéticos y deterministas** (misma
semilla → mismo dataset siempre) y están etiquetados como `DEMO — DATOS SIMULADOS` en toda la interfaz,
salvo hechos, misión/visión, marco legal e indicadores del PEI/POA citados literalmente del Contexto
Maestro Institucional, marcados `DATO REAL`. Ver [`docs/01-descubrimiento-arquitectura.md`](docs/01-descubrimiento-arquitectura.md)
para el detalle del principio de veracidad, fuentes y arquitectura, y
[`docs/02-escenario-demo.md`](docs/02-escenario-demo.md) para un guion de demostración paso a paso.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router (HashRouter) + Recharts + Zustand.
No requiere backend, base de datos ni variables de entorno: todo el dataset se genera en el cliente
a partir de `src/data/generator.ts`.

## Acceso al prototipo (autenticación simulada)

La aplicación abre en una pantalla de acceso institucional con doble factor simulado:

| Campo | Valor |
|---|---|
| Usuario | `orisonsoto@gmail.com` |
| Contraseña | `1234` |
| Código MFA | `482913` |

> **Importante:** la validación ocurre íntegramente en el navegador contra una credencial fija visible
> en el código fuente. **No es un mecanismo de seguridad real** — es parte del mockup (módulo "Login"
> del inventario de pantallas) y no debe usarse para proteger información sensible. En una
> implementación real la autenticación se delegaría a Single Sign-On institucional con MFA y RBAC.

La sesión se guarda en `sessionStorage`, por lo que se mantiene al recargar y se cierra al cerrar la pestaña.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build   # tsc -b && vite build → dist/
npm run preview
```

## Despliegue (GitHub Pages vía GitHub Actions)

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) construye el proyecto y lo
publica en GitHub Pages en cada push a `main`. Como es una aplicación 100% estática sin llamadas de red,
el enrutamiento usa `HashRouter` (URLs con `#/ruta`) para funcionar sin necesidad de reglas de rewrite
en el servidor.

Sitio publicado: **https://orisonsoto.github.io/digecog-library/**

Si el sitio no aparece tras el primer push, verificar en el repositorio: *Settings → Pages → Build and
deployment → Source* debe estar en **"GitHub Actions"** (normalmente se configura solo con el primer
run del workflow).

## Estructura

- `src/data/` — modelo de datos, catálogo de cuentas (Plan de Cuentas Contables oficial DIGECOG v2.0) y generador sintético.
- `src/pages/` — los 30 módulos del prototipo.
- `src/components/` — layout (sidebar, topbar, panel contextual) y componentes UI reutilizables.
- `docs/` — documentación de fases (descubrimiento, arquitectura, escenario de demo).
