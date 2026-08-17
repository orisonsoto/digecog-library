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
| Usuario | `lauraperez@gmail.com` |
| Contraseña | `1234` |
| Código MFA | `482913` |

> **Importante:** la validación ocurre íntegramente en el navegador contra una credencial fija visible
> en el código fuente. **No es un mecanismo de seguridad real** — es parte del mockup (módulo "Login"
> del inventario de pantallas) y no debe usarse para proteger información sensible. En una
> implementación real la autenticación se delegaría a Single Sign-On institucional con MFA y RBAC.

La sesión se guarda en `sessionStorage`, por lo que se mantiene al recargar y se cierra al cerrar la pestaña.

## Control de acceso por rol (RBAC)

El perfil elegido en la pantalla de acceso determina qué módulos ve y puede abrir el usuario.
Los alcances reproducen los perfiles diferenciados del §39 del prompt maestro y viven en
[`src/lib/permisos.ts`](src/lib/permisos.ts).

| Perfil | Alcance | Módulos |
|---|---|---:|
| Director General | Acceso ejecutivo total | 28 |
| Directores Misionales | Analítico y operativo sobre la función misional | 19 |
| Procesamiento Contable y Estados Financieros | Contabilidad, estados, cierre y consolidación | 12 |
| Análisis de Información Financiera | SISACNOC, analítica, estadísticas y calidad | 12 |
| Auditor | Consulta y trazabilidad, sin gestión | 15 |
| Planificación y Desarrollo | PEI, POA, proyectos, riesgos, calidad, documental | 12 |
| Políticas, Normas y Procedimientos Contables | Normativas, catálogo y capacitación | 7 |
| Jurídico / Cumplimiento | Normativas, SIG y cumplimiento | 7 |
| Tecnología | Interoperabilidad, administración y calidad | 6 |
| Entidad Reportante (SPNF) | Solo su institución; inicia en el Centro de Cierre | 4 |
| OAI | Transparencia, estadísticas y documental | 4 |
| Ciudadanía | Datos públicos; inicia en Transparencia | 3 |

Comportamiento: el sidebar solo lista los módulos del alcance, cada perfil aterriza en su propia
pantalla de inicio, la navegación directa por URL a un módulo fuera de alcance muestra una pantalla
de **Acceso restringido**, y las alertas y el copiloto Mía AI se ocultan para los perfiles externos.

> La restricción es de interfaz. En una implementación real debe aplicarse también en el servidor,
> sobre cada consulta de datos.

## Diseño responsive

La experiencia primaria es escritorio, pero el prototipo se adapta a tablet y celular:

| Ancho | Comportamiento |
|---|---|
| `≥ 1024px` (escritorio) | Sidebar fijo (248px, colapsable a iconos), panel contextual derecho fijo (320px), búsqueda inline en el topbar. |
| `< 1024px` (tablet/celular) | Sidebar como **drawer** superpuesto con backdrop, abierto desde el botón hamburguesa; panel contextual y Mía AI como **hoja a pantalla completa**; búsqueda desplegable desde un icono; topbar compacto con marca visible. |

Detalles considerados: `h-dvh` en lugar de `h-screen` para que la barra de direcciones del navegador móvil
no recorte el contenido, objetivos táctiles de ~44px en la navegación y controles, cierre del drawer al
navegar, y tablas/gráficos con desplazamiento horizontal contenido (sin desbordar la página).

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
