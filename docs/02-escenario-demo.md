# DIGECOG 360° — Fase 7: Escenario de demostración guiado

Guion para presentar el flujo narrativo del prompt maestro (§45) usando el prototipo real construido.
Empresa pública sugerida para el recorrido: **EDEESTE** (Empresa Distribuidora de Electricidad del Este) — real, con datos financieros sintéticos.

| Paso | Narrativa | Pantalla / acción en el prototipo |
|---|---|---|
| 1. Recepción | Una empresa pública remite su información financiera de cierre. | `Centro de Cierre` (`/cierre`) → calendario de cierre del ejercicio 2025 e instituciones con documentación pendiente. |
| 2. Validación de catálogo | El sistema valida automáticamente el catálogo contable. | `Explorador Contable` (`/contabilidad`) → seleccionar EDEESTE y navegar Clase→Grupo→Rubro→Cuenta hasta el saldo real. |
| 3. Detección de inconsistencias | El sistema detecta inconsistencias. | `Analítica Financiera` (`/analitica`) → sección "Detección de anomalías (IA simulada)"; también `Calidad del Dato` (`/calidad-dato`). |
| 4. Corrección/justificación | La entidad corrige o justifica. | `Ficha 360°` de EDEESTE (`/institucion/<id>`) → pestaña Movimientos, diario de la institución. |
| 5. Validación DIGECOG | DIGECOG valida la información. | `Consolidación` (`/consolidacion`) → filtrar por etapa "Validado". |
| 6. Evaluación SISACNOC | SISACNOC evalúa cumplimiento. | `SISACNOC 360°` (`/sisacnoc`) → comparar EDEESTE vs. otra distribuidora eléctrica (EDENORTE/EDESUR) y vs. promedio sectorial. |
| 7. Incorporación a consolidación | La información se incorpora a la consolidación. | `Consolidación` (`/consolidacion`) → pipeline Recibido→Validado→Ajustes→Eliminaciones→Consolidado→Publicado. |
| 8. Generación de Estados Financieros | Se generan los Estados Financieros. | `Estados Financieros` (`/estados-financieros`) → alcance "Sector" = Energía, o alcance "Institución" = EDEESTE. |
| 9. Integración al ERIR | Se integra al ERIR. | `ERIR` (`/erir`) → año fiscal 2025, ver estado de EDEESTE en la tabla y la línea de tiempo. |
| 10. Actualización del BI | El BI actualiza los dashboards. | `Centro de Mando Ejecutivo` (`/`) → KPIs de cierre, ERIR y volumen financiero se recalculan sobre el mismo dataset. |
| 11. Detección de tendencias por IA | Mía AI identifica tendencias y riesgos. | `Copiloto Mía AI` (`/mia`) → preguntar *"Compara las empresas públicas eléctricas"* o *"¿Cuáles instituciones presentan mayor deterioro en liquidez?"*. |
| 12. Resumen ejecutivo | La Dirección General recibe un resumen. | `Copiloto Mía AI` → preguntar *"Genera un resumen ejecutivo del cierre"*, o volver a `Centro de Mando Ejecutivo`. |

## Cómo ejecutar el prototipo

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Rutas principales: `/login` (acceso institucional simulado), `/` (Centro de Mando), y el resto de los 30 módulos listados en el sidebar agrupados por: Centro de Mando, Monitoreo Nacional, Contabilidad Gubernamental, Cumplimiento y Calidad, Analítica e Inteligencia, Normativa y Conocimiento, Interoperabilidad y Transparencia, Gestión Institucional, y Administración.

## Fase 8 — Validación realizada

- **Consistencia contable:** el Patrimonio de cada institución/período se calcula como residual (Activo − Pasivo), por lo que la identidad `Activo = Pasivo + Patrimonio` se cumple por construcción en todos los registros de `FACT_ESTADOS_FINANCIEROS`.
- **Consistencia temporal del ERIR:** el procesamiento de un año fiscal ocurre durante el año calendario siguiente; con corte 2026-07, los años 2022-2024 aparecen publicados, 2025 en proceso (narrativa activa del escenario) y 2026 sin iniciar.
- **Navegación:** las 30 rutas (incluyendo `/login` y `/institucion/:id`) fueron verificadas una por una en navegador — sin errores de consola ni de compilación.
- **Build:** `npx tsc -b --noEmit` y `npm run build` se ejecutan sin errores (ver salida de Vite: ~2,424 módulos transformados, bundle principal ~342 KB / ~100 KB gzip).
- **Integridad de datos:** todas las cifras financieras, de cumplimiento y de calidad están claramente etiquetadas `DEMO — DATOS SIMULADOS` salvo los indicadores del PEI/POA y hechos institucionales citados literalmente del Contexto Maestro, marcados `DATO REAL`.
