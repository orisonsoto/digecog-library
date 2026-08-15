# DIGECOG 360° — Fase 1-2: Descubrimiento y Arquitectura

> Documento de trabajo del prototipo. No es un documento institucional oficial de DIGECOG.
> Fuente primaria de contexto: *Contexto Maestro Institucional de la DIGECOG v1.0* (10/08/2026), complementado con investigación en fuentes oficiales (digecog.gob.do, hacienda.gob.do, datos.gob.do). Ver §7 "Fuentes y trazabilidad".

## 1. Qué hace DIGECOG hoy (según contexto cargado + fuentes oficiales)

- **Naturaleza**: órgano rector del Sistema de Contabilidad Gubernamental (SCG) de la República Dominicana. Creada por la **Ley 126-01**, reglamentada por el **Decreto 526-09**. Adscrita al **Ministerio de Hacienda y Economía** (fusión Hacienda + antiguo MEPyD por la **Ley 45-25**, jul-2025).
- **Mandato**: emitir normas/manuales contables; administrar el Plan de Cuentas Contables (versión **2023**, vigente); consolidar y procesar información financiera del Sector Público No Financiero (SPNF); elaborar Estados Financieros y el **ERIR** (Estado de Recaudación e Inversión de las Rentas — documento anual del Ministro de Hacienda al Congreso y la Cámara de Cuentas); evaluar cumplimiento normativo vía **SISACNOC** (Sistema de Análisis del Cumplimiento de las Normativas Contables); asistencia técnica y capacitación.
- **Misión 2025-2028**: "Dirigir el Sistema de Contabilidad del Sector Público para la consolidación, transparencia y la efectiva toma de decisiones de las finanzas públicas."
- **Visión 2025-2028**: "Ser modelo de implementación de las mejores prácticas contables del Sector Público, que integra estándares internacionales en todo el Sistema de Contabilidad."
- **Valores**: Transparencia, Compromiso, Integridad, Excelencia, Innovación.

## 2. Usuarios del ecosistema

| Perfil | Rol frente al sistema |
|---|---|
| Director General | Visión ejecutiva nacional, decisiones, resumen de cierre |
| Directores misionales (Contabilidad, Análisis, Normativas) | Operación y análisis de su dominio |
| Planificación y Desarrollo | PEI, POA, riesgos, calidad, innovación, cambio, benchmarking |
| Entidad reportante (SPNF) | Reporta, corrige, consulta solo su institución |
| Auditor / Cámara de Cuentas | Consulta y trazabilidad, sin edición |
| OAI / Ciudadanía | Datos públicos, transparencia, datos abiertos |
| Tecnología / Jurídico / Comunicaciones / RRHH | Administración interna |

## 3. Sistemas y fuentes existentes (reales, mencionados en fuentes oficiales)

SISACNOC, ERIR, Plan de Cuentas Contables 2023, SINOC (capacitación), SIAB (activos/bienes), SIGEF (Hacienda), DIGEPRES, Tesorería Nacional, Contraloría, DGCP, portal de Datos Abiertos (datos.gob.do). El prototipo **representa conceptualmente** estos sistemas como módulos conectados; no son integraciones reales.

## 4. Procesos principales (mapa de procesos v4, 08/07/2024)

Estratégicos → Misionales/Clave (implementación SCG, normativa, capacitación, consolidación, estados financieros, ERIR, SISACNOC, **Verificación de Estados Financieros** como proceso diferenciado desde v4) → Apoyo (incluye **Compras y Contrataciones** desde v4) → Medición y evaluación.

## 5. Oportunidades de integración (base del diseño de módulos)

1. Un solo modelo de datos para instituciones, cuentas, períodos y hechos contables (evita silos SISACNOC/ERIR/SIAB/SINOC).
2. Trazabilidad de extremo a extremo (Data Lineage) entre dato reportado → validado → consolidado → publicado.
3. Analítica y detección de anomalías sobre el mismo dato contable (no reportes aislados).
4. Gestión institucional (PEI/POA/riesgos/calidad/documental) integrada al mismo panel que la operación contable — hoy son procesos de apoyo desconectados de las herramientas SCG.

## 6. Principio de veracidad aplicado en el prototipo

| Tipo | Tratamiento en la interfaz |
|---|---|
| **REAL** | Nombres de instituciones, marco legal, misión/visión, definiciones de ERIR/SISACNOC/Plan de Cuentas, metas del PEI 2025-2028 y POA 2026 citadas en el contexto maestro. |
| **DERIVADA** | Ratios, variaciones %, rankings calculados matemáticamente sobre datos sintéticos (la fórmula es real; el insumo es simulado). |
| **SIMULADA** | Saldos, movimientos, cifras de cumplimiento, alertas, hallazgos de IA. Se etiqueta `DEMO — DATOS SIMULADOS` de forma consistente en el header de cada módulo analítico y en cada KPI que no provenga del contexto cargado. |

No se usa Lorem Ipsum en ninguna pantalla. No se inventan colores institucionales: no fue posible obtener el código hexadecimal oficial de marca de DIGECOG/Hacienda desde fuentes públicas accesibles en esta sesión (el manual de identidad del gobierno dominicano — uxkit.digital.gob.do — confirma arquitectura de marca monolítica pero no expone valores hex en la página pública); se usa una paleta profesional propia inspirada en la banca azul institucional dominicana (consistente con el azul/celeste observado en la portada oficial del propio Plan de Cuentas de DIGECOG), y se documenta como decisión de diseño, no como marca oficial verificada.

**Actualización — Plan de Cuentas Contables**: el usuario suministró directamente el PDF oficial *"Plan de Cuentas Contables y su Descripción, Versión 2.0"* (DIGECOG, Dirección de Normas, Políticas y Procedimientos, junio 2023, basado en NICSP 2021). El catálogo de cuentas del prototipo (`src/data/catalogoCuentas.ts`) fue reconstruido con la estructura y nombres **reales y literales** de ese documento (Clase → Grupo → Rubro → Cuenta, primeros 4 de los 7 niveles oficiales), reemplazando la versión ilustrativa inicial. Ya no aplica la salvedad anterior sobre estructura no verificada.

## 7. Fuentes y trazabilidad de esta fase

- digecog.gob.do (portal oficial, NORTIC A2)
- hacienda.gob.do/dependencias/direccion-general-de-contabilidad-gubernamental
- digecog.gob.do/index.php/sisanoc/introduccion-del-sistema (SISACNOC)
- digecog.gob.do — Plan de Cuentas Contables 2.0 (2023)
- digecog.gob.do/index.php/erir (ERIR)
- datos.gob.do/organization/direccion-general-de-contabilidad-gubernamental-digecog
- Clasificación EGEHID/ETED/EDENORTE/EDESUR/EDEESTE como Empresas Públicas No Financieras: hacienda.gob.do (procedimiento de presupuestos EPNF) y DIGEPRES (libro de ejecución EPNF/IPF 2022)
- Contexto Maestro Institucional DIGECOG v1.0 (documento cargado por el usuario)
- Plan de Cuentas Contables y su Descripción, Versión 2.0 (DIGECOG, junio 2023) — PDF oficial suministrado directamente por el usuario

---

# Arquitectura del sistema (Fase 2)

## A. Tres ecosistemas

```
ECOSISTEMA A (Interno DIGECOG)      ECOSISTEMA B (Entidades SPNF)      ECOSISTEMA C (Inteligencia Nacional)
- Home ejecutivo                    - Portal de reporte                - Analítica financiera
- Explorador contable                - Validación de catálogo          - SISACNOC 360 / ERIR
- Consolidación / Cierre            - Consulta de estado                - Empresas Públicas / Gob. Locales
- Gestión institucional (PEI/POA/    - Historial de envíos              - Transparencia / Datos abiertos
  riesgos/SIG/documental/RRHH...)                                       - Mía AI (copiloto)
                    \_______________________ Modelo de datos común (DIM_ + FACT_) _______________________/
```

## B. Modelo de datos conceptual

Ver `src/data/types.ts` para la implementación TypeScript. Dimensiones: `DIM_INSTITUCION, DIM_CUENTA_CONTABLE, DIM_PERIODO, DIM_FUENTE, DIM_NIVEL_GOBIERNO, DIM_SECTOR, DIM_UBICACION, DIM_INDICADOR, DIM_NORMA_NICSP, DIM_USUARIO`. Hechos: `FACT_SALDOS_CONTABLES, FACT_TRANSACCIONES, FACT_ESTADOS_FINANCIEROS, FACT_EJECUCION_PRESUPUESTARIA, FACT_IMPLEMENTACION_SCG, FACT_SISACNOC, FACT_CALIDAD_DATOS, FACT_ERIR, FACT_ACTIVOS, FACT_CAPACITACIONES, FACT_ASISTENCIA_TECNICA, FACT_INDICADORES, FACT_RIESGOS, FACT_PROYECTOS, FACT_POA`.

## C. Alcance del prototipo ejecutable (nota de escala)

El PEI 2025-2028 reporta 520 instituciones del SPNF evaluadas por SISACNOC (línea base 2024) con meta de 545 en 2028. El prototipo simula un universo de **114 instituciones con nombre real** (26 del Gobierno Central, 26 descentralizadas/autónomas, 3 de seguridad social, 9 empresas públicas no financieras y 3 financieras verificadas, 39 ayuntamientos/municipios de las 32 demarcaciones y 8 juntas de distrito municipal) y genera de forma determinista (semilla fija) saldos, movimientos y estados financieros para 5 años fiscales (2022-2026) sobre el Plan de Cuentas oficial (Clase→Grupo→Rubro→Cuenta). Los KPI de "escala nacional" (ej. "4.8 millones de registros") se presentan como cifra ilustrativa DEMO de lo que representaría la plataforma en producción, distinta de la muestra navegable real que sustenta el drill-down.
