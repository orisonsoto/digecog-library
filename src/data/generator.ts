// Generador de dataset sintético DIGECOG 360° — determinista (semilla fija SEED).
// Todo lo generado aquí es SIMULADO (ver docs/01-descubrimiento-arquitectura.md §6) salvo
// donde se marca esReal=true, que corresponde a cifras citadas literalmente en el Contexto
// Maestro Institucional (PEI 2025-2028 / POA 2026).
import { Rng } from '../lib/prng';
import { TODAS_INSTITUCIONES_FUENTE } from './institucionesFuente';
import { CUENTAS_HOJA } from './catalogoCuentas';
import { ANIOS_DISPONIBLES, ANIO_ACTUAL, MES_CORTE_ACTUAL } from './periodos';
import type {
  Institucion, EstadoFinanciero, SaldoContable, Transaccion, SisacnocEvaluacion,
  ErirRegistro, CalidadDato, Riesgo, Proyecto, IndicadorPOA, Alerta, DocumentoNormativo,
  Activo, EjecucionPresupuestaria, NivelGobierno,
} from './types';

// ---------------------------------------------------------------------------
// 1. INSTITUCIONES — atributos operativos SIMULADOS sobre nombres reales
// ---------------------------------------------------------------------------
const RESPONSABLES_NOMBRES = [
  'Ramona Peña', 'Carlos Almonte', 'Yolanda Reyes', 'Manuel De la Cruz', 'Altagracia Mercedes',
  'José Rafael Tavárez', 'Mercedes Guzmán', 'Rafael Antonio Cuevas', 'Ana Julia Sánchez', 'Pedro Julio Familia',
  'Rosa Elena Payano', 'Víctor Manuel Ovalle', 'Cándida Rosa Féliz', 'Domingo Antonio Pérez', 'Luz Del Carmen Rodríguez',
];
const CARGOS = ['Directora Administrativa y Financiera', 'Encargado de Contabilidad', 'Director Financiero', 'Encargada de Presupuesto', 'Gerente Administrativo Financiero'];

// Peso de tamaño relativo (para escalar cifras financieras) por nivel de gobierno
const PESO_TAMANO: Record<NivelGobierno, [number, number]> = {
  'Gobierno Central': [8_000_000_000, 60_000_000_000],
  Descentralizada: [400_000_000, 6_000_000_000],
  Autónoma: [400_000_000, 6_000_000_000],
  'Seguridad Social': [3_000_000_000, 40_000_000_000],
  'Empresa Pública No Financiera': [2_000_000_000, 35_000_000_000],
  'Empresa Pública Financiera': [10_000_000_000, 120_000_000_000],
  Ayuntamiento: [80_000_000, 2_500_000_000],
  'Junta de Distrito Municipal': [5_000_000, 60_000_000],
};

export const INSTITUCIONES: Institucion[] = TODAS_INSTITUCIONES_FUENTE.map((f, i) => {
  const r = new Rng(`inst-${i}-${f.siglas}`);
  // Probabilidad de SCG implementado ~45% (meta PEI 2026), mayor en Gob. Central/Empresas, menor en municipios pequeños
  const probScg = f.nivelGobierno === 'Junta de Distrito Municipal' ? 0.18
    : f.nivelGobierno === 'Ayuntamiento' ? 0.32
    : f.nivelGobierno === 'Empresa Pública No Financiera' || f.nivelGobierno === 'Empresa Pública Financiera' ? 0.72
    : 0.55;
  return {
    id: `INS-${String(i + 1).padStart(3, '0')}`,
    nombre: f.nombre,
    siglas: f.siglas,
    nivelGobierno: f.nivelGobierno,
    sector: f.sector,
    region: f.region,
    provincia: f.provincia,
    esEmpresaPublica: f.nivelGobierno === 'Empresa Pública No Financiera' || f.nivelGobierno === 'Empresa Pública Financiera',
    scgImplementado: r.bool(probScg),
    sisacnocActivo: r.bool(0.86),
    sinocActivo: r.bool(0.68),
    siabActivo: r.bool(0.6),
    fechaIncorporacion: `${2005 + r.int(0, 19)}-${String(r.int(1, 12)).padStart(2, '0')}-01`,
    responsable: r.pick(RESPONSABLES_NOMBRES),
    cargoResponsable: r.pick(CARGOS),
  };
});

export const INSTITUCIONES_POR_ID = new Map(INSTITUCIONES.map((i) => [i.id, i]));

export const EMPRESAS_ELECTRICAS_ID = INSTITUCIONES
  .filter((i) => ['EGEHID', 'ETED', 'EDENORTE', 'EDESUR', 'EDEESTE'].includes(i.siglas))
  .map((i) => i.id);

export const EMPRESAS_PUBLICAS_LISTA = INSTITUCIONES.filter((i) => i.esEmpresaPublica);

function tamanoBase(inst: Institucion, seedTag: string): number {
  const r = new Rng(`tam-${inst.id}-${seedTag}`);
  const [min, max] = PESO_TAMANO[inst.nivelGobierno];
  return r.float(min, max);
}

// ---------------------------------------------------------------------------
// 2. ESTADOS FINANCIEROS + SALDOS — coherentes (Activo = Pasivo + Patrimonio)
// ---------------------------------------------------------------------------
// Períodos de reporte financiero: cierre anual 2022-2025 + corte mensual del año vigente.
const PERIODOS_EF = [
  ...ANIOS_DISPONIBLES.filter((a) => a < ANIO_ACTUAL).map((a) => ({ anio: a, mes: 12 })),
  { anio: ANIO_ACTUAL, mes: MES_CORTE_ACTUAL },
];

export const ESTADOS_FINANCIEROS: EstadoFinanciero[] = [];
export const SALDOS_CONTABLES: SaldoContable[] = [];

for (const inst of INSTITUCIONES) {
  const base = tamanoBase(inst, 'activo');
  const crecimientoAnual = new Rng(`crec-${inst.id}`).float(0.02, 0.11);
  for (const { anio, mes } of PERIODOS_EF) {
    const r = new Rng(`ef-${inst.id}-${anio}-${mes}`);
    const anios = anio - 2022;
    const factorEscala = Math.pow(1 + crecimientoAnual, anios) * r.float(0.9, 1.1);
    const activoTotal = base * factorEscala;
    const activoCorriente = activoTotal * r.float(0.28, 0.48);
    const activoNoCorriente = activoTotal - activoCorriente;
    const apalancamiento = r.float(0.32, 0.62); // pasivo / activo
    const pasivoTotal = activoTotal * apalancamiento;
    const pasivoCorriente = pasivoTotal * r.float(0.35, 0.6);
    const pasivoNoCorriente = pasivoTotal - pasivoCorriente;
    const patrimonio = activoTotal - pasivoTotal; // residual: garantiza balance contable

    const ingresosCorrientes = base * r.float(0.55, 0.95) * factorEscala;
    const ingresosCapital = ingresosCorrientes * r.float(0.03, 0.18);
    const margenOperativo = r.float(-0.06, 0.09);
    const gastosFuncionamiento = (ingresosCorrientes + ingresosCapital) * (1 - margenOperativo) * r.float(0.68, 0.86);
    const transferencias = (ingresosCorrientes + ingresosCapital) * r.float(0.04, 0.16);
    const gastosCapital = Math.max(0, (ingresosCorrientes + ingresosCapital) - gastosFuncionamiento - transferencias
      - ((ingresosCorrientes + ingresosCapital) * margenOperativo));
    const resultadoEjercicio = ingresosCorrientes + ingresosCapital - gastosFuncionamiento - gastosCapital - transferencias;

    ESTADOS_FINANCIEROS.push({
      institucionId: inst.id, anio, mes,
      activoCorriente, activoNoCorriente, pasivoCorriente, pasivoNoCorriente, patrimonio,
      ingresosCorrientes, ingresosCapital, gastosFuncionamiento, gastosCapital, transferencias,
      resultadoEjercicio,
      flujoOperacion: resultadoEjercicio * r.float(0.8, 1.3),
      flujoInversion: -gastosCapital * r.float(0.6, 1.1),
      flujoFinanciamiento: pasivoNoCorriente * r.float(-0.05, 0.08),
    });

    // Distribuir en cuentas hoja (solo en cierres anuales + corte vigente, para controlar volumen)
    const cuentasActivo = CUENTAS_HOJA.filter((c) => c.clasificacion === 'Activo');
    const cuentasPasivo = CUENTAS_HOJA.filter((c) => c.clasificacion === 'Pasivo');
    const cuentasPatrimonio = CUENTAS_HOJA.filter((c) => c.clasificacion === 'Patrimonio');
    const cuentasIngresos = CUENTAS_HOJA.filter((c) => c.clasificacion === 'Ingresos');
    const cuentasGastos = CUENTAS_HOJA.filter((c) => c.clasificacion === 'Gastos');

    const repartir = (total: number, cuentas: typeof cuentasActivo, tag: string) => {
      const rr = new Rng(`${tag}-${inst.id}-${anio}-${mes}`);
      const pesos = cuentas.map(() => rr.float(0.2, 1));
      const sumaPesos = pesos.reduce((s, p) => s + p, 0);
      cuentas.forEach((c, idx) => {
        const saldoFinal = total * (pesos[idx] / sumaPesos);
        const debitos = saldoFinal * rr.float(0.4, 1.3);
        const creditos = debitos - saldoFinal + saldoFinal * rr.float(-0.1, 0.1);
        SALDOS_CONTABLES.push({
          institucionId: inst.id, cuentaId: c.id, periodoKey: `${anio}-${String(mes).padStart(2, '0')}`,
          saldoInicial: saldoFinal - debitos + creditos, debitos, creditos, saldoFinal,
        });
      });
    };
    repartir(activoCorriente, cuentasActivo.slice(0, Math.ceil(cuentasActivo.length / 2)), 'sa');
    repartir(activoNoCorriente, cuentasActivo.slice(Math.ceil(cuentasActivo.length / 2)), 'sa2');
    repartir(pasivoTotal, cuentasPasivo, 'sp');
    repartir(Math.max(patrimonio, 1), cuentasPatrimonio, 'spt');
    repartir(ingresosCorrientes + ingresosCapital, cuentasIngresos, 'si');
    repartir(gastosFuncionamiento + gastosCapital + transferencias, cuentasGastos, 'sg');
  }
}

export function estadoFinancieroDe(institucionId: string, anio: number, mes: number): EstadoFinanciero | undefined {
  return ESTADOS_FINANCIEROS.find((e) => e.institucionId === institucionId && e.anio === anio && e.mes === mes);
}

export function estadosFinancierosDeInstitucion(institucionId: string): EstadoFinanciero[] {
  return ESTADOS_FINANCIEROS.filter((e) => e.institucionId === institucionId).sort((a, b) => a.anio - b.anio || a.mes - b.mes);
}

export function saldosDeInstitucionPeriodo(institucionId: string, periodoKey: string): SaldoContable[] {
  return SALDOS_CONTABLES.filter((s) => s.institucionId === institucionId && s.periodoKey === periodoKey);
}

// ---------------------------------------------------------------------------
// 3. TRANSACCIONES — muestra de movimientos (año vigente) para diario/mayor
// ---------------------------------------------------------------------------
const FUENTES_TX = ['SIGEF', 'Carga manual', 'Interoperabilidad', 'API', 'Archivo'] as const;
const GLOSAS = [
  'Registro de nómina quincenal', 'Pago a proveedor de servicios generales', 'Depreciación mensual de activos fijos',
  'Transferencia corriente recibida del Gobierno Central', 'Compra de materiales y suministros de oficina',
  'Registro de ingresos por tasas y derechos', 'Ajuste por conciliación bancaria', 'Pago de servicios básicos',
  'Devengo de intereses sobre inversión a plazo fijo', 'Registro de ejecución presupuestaria del período',
  'Amortización de préstamo con organismo multilateral', 'Provisión para prestaciones laborales',
];

export const TRANSACCIONES: Transaccion[] = (() => {
  const out: Transaccion[] = [];
  const cuentasMov = CUENTAS_HOJA;
  let seq = 1;
  for (const inst of INSTITUCIONES) {
    const r = new Rng(`tx-${inst.id}`);
    const nTx = r.int(14, 28);
    for (let k = 0; k < nTx; k++) {
      const mes = r.int(1, MES_CORTE_ACTUAL);
      const dia = r.int(1, 27);
      const cuenta = r.pick(cuentasMov);
      const monto = tamanoBase(inst, 'tx') * r.float(0.0006, 0.02);
      out.push({
        id: `TX-${String(seq++).padStart(6, '0')}`,
        institucionId: inst.id,
        cuentaId: cuenta.id,
        fecha: `${ANIO_ACTUAL}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
        tipo: r.bool(0.52) ? 'Débito' : 'Crédito',
        monto,
        fuente: r.pick(FUENTES_TX),
        glosa: r.pick(GLOSAS),
      });
    }
  }
  return out;
})();

export function transaccionesDeInstitucion(institucionId: string): Transaccion[] {
  return TRANSACCIONES.filter((t) => t.institucionId === institucionId).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

// ---------------------------------------------------------------------------
// 4. EJECUCIÓN PRESUPUESTARIA (resumen anual por institución)
// ---------------------------------------------------------------------------
export const EJECUCION_PRESUPUESTARIA: EjecucionPresupuestaria[] = (() => {
  const out: EjecucionPresupuestaria[] = [];
  for (const inst of INSTITUCIONES) {
    for (const { anio, mes } of PERIODOS_EF) {
      const r = new Rng(`pres-${inst.id}-${anio}`);
      const ef = estadoFinancieroDe(inst.id, anio, mes);
      const gastoTotal = ef ? ef.gastosFuncionamiento + ef.gastosCapital : tamanoBase(inst, 'pres') * 0.5;
      const presupuestoAprobado = gastoTotal * r.float(1.02, 1.18);
      const presupuestoModificado = presupuestoAprobado * r.float(0.97, 1.12);
      const devengado = presupuestoModificado * r.float(0.72, 0.99);
      const pagado = devengado * r.float(0.85, 1);
      out.push({ institucionId: inst.id, anio, mes, presupuestoAprobado, presupuestoModificado, devengado, pagado });
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// 5. SISACNOC — evaluaciones semestrales
// ---------------------------------------------------------------------------
export const SISACNOC_EVALUACIONES: SisacnocEvaluacion[] = (() => {
  const out: SisacnocEvaluacion[] = [];
  for (const inst of INSTITUCIONES) {
    if (!inst.sisacnocActivo) continue;
    const rBase = new Rng(`sisacnoc-base-${inst.id}`);
    let tendencia = rBase.float(45, 78);
    for (const anio of [2024, 2025, 2026]) {
      const semestres: (1 | 2)[] = anio === 2026 ? [1] : [1, 2];
      for (const semestre of semestres) {
        const r = new Rng(`sisacnoc-${inst.id}-${anio}-${semestre}`);
        tendencia = Math.min(99, Math.max(20, tendencia + r.float(-4, 6)));
        const oportunidad = Math.min(100, Math.max(10, tendencia + r.float(-10, 10)));
        const transparencia = Math.min(100, Math.max(10, tendencia + r.float(-10, 10)));
        const comparabilidad = Math.min(100, Math.max(10, tendencia + r.float(-10, 10)));
        const gestionActivos = Math.min(100, Math.max(10, tendencia + r.float(-15, 8)));
        const cumplimientoGeneral = (oportunidad + transparencia + comparabilidad + gestionActivos) / 4;
        out.push({
          institucionId: inst.id, anio, semestre, oportunidad, transparencia, comparabilidad, gestionActivos,
          cumplimientoGeneral,
          categoria: cumplimientoGeneral >= 85 ? 'Óptimo' : cumplimientoGeneral >= 65 ? 'Satisfactorio' : cumplimientoGeneral >= 45 ? 'En proceso' : 'Crítico',
        });
      }
    }
  }
  return out;
})();

export function sisacnocDeInstitucion(institucionId: string): SisacnocEvaluacion[] {
  return SISACNOC_EVALUACIONES.filter((s) => s.institucionId === institucionId).sort((a, b) => a.anio - b.anio || a.semestre - b.semestre);
}
export function ultimoSisacnoc(institucionId: string): SisacnocEvaluacion | undefined {
  const arr = sisacnocDeInstitucion(institucionId);
  return arr[arr.length - 1];
}

// ---------------------------------------------------------------------------
// 6. ERIR — línea de tiempo Recepción → Validación → Integración → Consolidación → Publicación
// ---------------------------------------------------------------------------
export const ERIR_REGISTROS: ErirRegistro[] = (() => {
  const out: ErirRegistro[] = [];
  for (const inst of INSTITUCIONES) {
    for (const anio of [2022, 2023, 2024, 2025, 2026]) {
      const r = new Rng(`erir-${inst.id}-${anio}`);
      // El ERIR de un año fiscal se procesa durante el año siguiente (anio+1). Con corte en 2026-07,
      // los años 2022-2024 ya completaron su ciclo de procesamiento; 2025 está en curso durante 2026;
      // 2026 aún no ha iniciado su procesamiento (corresponderá a 2027).
      const esAnioCerrado = anio <= 2024;
      const avance = esAnioCerrado ? 1 : anio === 2025 ? r.float(0.35, 0.95) : r.float(0, 0.1);
      const estado: ErirRegistro['estado'] = esAnioCerrado
        ? 'Publicado'
        : avance > 0.75 ? 'Consolidado' : avance > 0.55 ? 'Integrado' : avance > 0.3 ? 'Validado' : avance > 0.1 ? 'Recibido' : 'Pendiente';
      out.push({
        institucionId: inst.id, anio,
        cuentasPresupuestariasIntegradas: esAnioCerrado || avance > 0.5,
        cuentasPatrimonialesIntegradas: esAnioCerrado || avance > 0.6,
        fechaRecepcion: avance > 0.1 ? `${anio + 1}-02-${10 + r.int(0, 15)}` : null,
        fechaValidacion: avance > 0.3 ? `${anio + 1}-03-${5 + r.int(0, 20)}` : null,
        fechaIntegracion: avance > 0.55 ? `${anio + 1}-04-${5 + r.int(0, 20)}` : null,
        fechaConsolidacion: avance > 0.75 ? `${anio + 1}-05-${1 + r.int(0, 20)}` : null,
        estado,
      });
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// 7. CALIDAD DEL DATO — últimos 12 meses
// ---------------------------------------------------------------------------
export const CALIDAD_DATOS: CalidadDato[] = (() => {
  const out: CalidadDato[] = [];
  for (const inst of INSTITUCIONES) {
    const base = new Rng(`cal-base-${inst.id}`).float(58, 92);
    for (let m = Math.max(1, MES_CORTE_ACTUAL - 11); m <= MES_CORTE_ACTUAL; m++) {
      const r = new Rng(`cal-${inst.id}-${m}`);
      const jitter = () => Math.min(100, Math.max(15, base + r.float(-12, 10)));
      const completitud = jitter(), consistencia = jitter(), oportunidad = jitter();
      const exactitud = jitter(), duplicidad = jitter(), integridad = jitter();
      out.push({
        institucionId: inst.id, anio: ANIO_ACTUAL, mes: m,
        completitud, consistencia, oportunidad, exactitud, duplicidad, integridad,
        indiceGeneral: (completitud + consistencia + oportunidad + exactitud + duplicidad + integridad) / 6,
      });
    }
  }
  return out;
})();

export function calidadActualDe(institucionId: string): CalidadDato | undefined {
  const arr = CALIDAD_DATOS.filter((c) => c.institucionId === institucionId).sort((a, b) => a.mes - b.mes);
  return arr[arr.length - 1];
}

// ---------------------------------------------------------------------------
// 8. ACTIVOS (SIAB) — muestra por institución
// ---------------------------------------------------------------------------
const CATEGORIAS_ACTIVO: Activo['categoria'][] = ['Terrenos', 'Edificaciones', 'Vehículos', 'Mobiliario y Equipo', 'Equipo Tecnológico', 'Maquinaria'];
export const ACTIVOS: Activo[] = (() => {
  const out: Activo[] = [];
  let seq = 1;
  for (const inst of INSTITUCIONES) {
    if (!inst.siabActivo) continue;
    const r = new Rng(`activo-${inst.id}`);
    const n = r.int(4, 11);
    for (let k = 0; k < n; k++) {
      const valorAdquisicion = tamanoBase(inst, 'siab') * r.float(0.0008, 0.01);
      const depreciacionAcumulada = valorAdquisicion * r.float(0.1, 0.75);
      out.push({
        id: `ACT-${String(seq++).padStart(5, '0')}`,
        institucionId: inst.id,
        categoria: r.pick(CATEGORIAS_ACTIVO),
        descripcion: `${r.pick(CATEGORIAS_ACTIVO)} institucional`,
        valorAdquisicion,
        depreciacionAcumulada,
        valorNeto: valorAdquisicion - depreciacionAcumulada,
        fechaAdquisicion: `${2015 + r.int(0, 10)}-${String(r.int(1, 12)).padStart(2, '0')}-01`,
        ubicacion: inst.provincia,
        estado: r.weighted([{ value: 'Activo', weight: 82 }, { value: 'En mantenimiento', weight: 12 }, { value: 'Dado de baja', weight: 6 }]),
      });
    }
  }
  return out;
})();

// ---------------------------------------------------------------------------
// 9. RIESGOS INSTITUCIONALES (DIGECOG interno — Planificación y Desarrollo)
// ---------------------------------------------------------------------------
export const RIESGOS: Riesgo[] = [
  { id: 'RSK-01', proceso: 'Implementación del SCG', riesgo: 'Baja adopción del Sistema de Contabilidad Gubernamental en gobiernos locales', causa: 'Limitada capacitación técnica y rotación de personal', consecuencia: 'Incumplimiento de la meta de cobertura del PEI 2025-2028', probabilidad: 4, impacto: 5, controlesExistentes: 'Plan de capacitación SINOC, asistencia técnica focalizada', efectividadControl: 'Media', responsable: 'Dirección de Capacitación y Asistencia Técnica', tratamiento: 'Mitigar', fechaIdentificacion: '2025-02-10', estado: 'En tratamiento' },
  { id: 'RSK-02', proceso: 'SISACNOC', riesgo: 'Reporte tardío o incompleto de instituciones evaluadas', causa: 'Debilidad de procesos contables internos en entidades reportantes', consecuencia: 'Reducción de la calidad y oportunidad del cumplimiento normativo agregado', probabilidad: 4, impacto: 4, controlesExistentes: 'Recordatorios automatizados, seguimiento por sector', efectividadControl: 'Media', responsable: 'Dirección de Análisis de Información Financiera', tratamiento: 'Mitigar', fechaIdentificacion: '2025-01-15', estado: 'Abierto' },
  { id: 'RSK-03', proceso: 'Consolidación contable', riesgo: 'Diferencias interinstitucionales no conciliadas en operaciones recíprocas', causa: 'Falta de estandarización en el registro de transferencias entre entes', consecuencia: 'Retraso o inconsistencia en estados financieros consolidados', probabilidad: 3, impacto: 5, controlesExistentes: 'Matriz de conciliación de saldos recíprocos', efectividadControl: 'Media', responsable: 'Dirección de Procesamiento Contable', tratamiento: 'Mitigar', fechaIdentificacion: '2024-11-20', estado: 'En tratamiento' },
  { id: 'RSK-04', proceso: 'Cierre fiscal', riesgo: 'Incumplimiento del calendario de cierre por instituciones críticas', causa: 'Complejidad normativa y limitaciones de infraestructura tecnológica', consecuencia: 'Retraso en la elaboración del ERIR', probabilidad: 3, impacto: 4, controlesExistentes: 'Centro de Control del Cierre Fiscal, alertas tempranas', efectividadControl: 'Alta', responsable: 'Dirección de Procesamiento Contable', tratamiento: 'Mitigar', fechaIdentificacion: '2025-03-05', estado: 'Abierto' },
  { id: 'RSK-05', proceso: 'Interoperabilidad', riesgo: 'Indisponibilidad o error de servicios de integración con SIGEF y otros sistemas', causa: 'Baja adopción de herramientas tecnológicas y madurez de interoperabilidad', consecuencia: 'Pérdida de datos o duplicidad en cargas automatizadas', probabilidad: 2, impacto: 4, controlesExistentes: 'Monitoreo de disponibilidad, colas de reintento', efectividadControl: 'Media', responsable: 'Departamento de Tecnología', tratamiento: 'Mitigar', fechaIdentificacion: '2025-05-12', estado: 'Abierto' },
  { id: 'RSK-06', proceso: 'Gestión del talento humano', riesgo: 'Rotación de personal técnico especializado en contabilidad gubernamental', causa: 'Limitaciones presupuestarias y competencia salarial del mercado', consecuencia: 'Pérdida de conocimiento institucional y demoras operativas', probabilidad: 3, impacto: 3, controlesExistentes: 'Plan de capacitación continua, certificaciones SINOC', efectividadControl: 'Media', responsable: 'Recursos Humanos', tratamiento: 'Mitigar', fechaIdentificacion: '2025-01-30', estado: 'Abierto' },
  { id: 'RSK-07', proceso: 'Cumplimiento y antisoborno', riesgo: 'Incumplimiento de controles en compras y contrataciones ante el nuevo marco legal (Ley 47-25)', causa: 'Período de transición normativa y desactualización de procedimientos', consecuencia: 'No conformidades en auditorías internas del SIG', probabilidad: 2, impacto: 4, controlesExistentes: 'Actualización de procedimientos, verificación de estados financieros', efectividadControl: 'Media', responsable: 'Jurídico / Cumplimiento', tratamiento: 'Mitigar', fechaIdentificacion: '2026-01-20', estado: 'En tratamiento' },
  { id: 'RSK-08', proceso: 'Calidad del dato', riesgo: 'Saldos contables descuadrados o cuentas fuera del catálogo vigente', causa: 'Cargas manuales sin validación automática previa', consecuencia: 'Retrabajos y demoras en consolidación', probabilidad: 3, impacto: 3, controlesExistentes: 'Validaciones automáticas de catálogo, conciliación periódica', efectividadControl: 'Alta', responsable: 'Dirección de Procesamiento Contable', tratamiento: 'Mitigar', fechaIdentificacion: '2025-06-01', estado: 'Cerrado' },
  { id: 'RSK-09', proceso: 'Políticas transversales', riesgo: 'Brecha entre metas del PEI y del POA en indicadores de género y otras políticas transversales', causa: 'Debilidad en la alineación PEI-POA documentada en el contexto institucional', consecuencia: 'Reportes con inconsistencias ante entes de control', probabilidad: 3, impacto: 3, controlesExistentes: 'Revisión semestral del PEI, mesa de alineación PEI-POA', efectividadControl: 'Media', responsable: 'Planificación y Desarrollo', tratamiento: 'Mitigar', fechaIdentificacion: '2026-02-15', estado: 'Abierto' },
  { id: 'RSK-10', proceso: 'Gestión documental', riesgo: 'Documentos normativos vigentes con alta antigüedad sin revisión (ej. Política de Igualdad de Género v1, 2022)', causa: 'Falta de calendario sistemático de revisión documental', consecuencia: 'Desalineación con el marco estratégico vigente', probabilidad: 3, impacto: 2, controlesExistentes: 'Matriz de control documental', efectividadControl: 'Media', responsable: 'Planificación y Desarrollo', tratamiento: 'Mitigar', fechaIdentificacion: '2026-03-01', estado: 'Abierto' },
];

// ---------------------------------------------------------------------------
// 10. PROYECTOS — cartera institucional (Eje 1 / Eje 2 del PEI)
// ---------------------------------------------------------------------------
const PROYECTOS_BASE: Omit<Proyecto, 'avance' | 'estado' | 'semaforo' | 'ejecutado'>[] = [
  { id: 'PRY-01', nombre: 'Plataforma DIGECOG 360° de Analítica Financiera', responsable: 'Departamento de Tecnología', ejeEstrategico: 1, objetivoEstrategico: 'Fortalecer el Sistema de Contabilidad Gubernamental', presupuesto: 48_000_000, fechaInicio: '2025-03-01', fechaFin: '2027-06-30', hitos: [{ nombre: 'Diseño de arquitectura de datos', fecha: '2025-06-01', completado: true }, { nombre: 'Prototipo funcional', fecha: '2026-08-14', completado: true }, { nombre: 'Piloto con instituciones seleccionadas', fecha: '2026-12-01', completado: false }, { nombre: 'Despliegue nacional', fecha: '2027-06-30', completado: false }], descripcion: 'Ecosistema digital integral de gestión y analítica contable gubernamental.' },
  { id: 'PRY-02', nombre: 'Modernización SISACNOC 360°', responsable: 'Dirección de Análisis de Información Financiera', ejeEstrategico: 1, objetivoEstrategico: 'Ampliar la implementación del SCG', presupuesto: 18_500_000, fechaInicio: '2025-01-15', fechaFin: '2026-11-30', hitos: [{ nombre: 'Rediseño de indicadores', fecha: '2025-05-01', completado: true }, { nombre: 'Nuevo mapa de calor de cumplimiento', fecha: '2026-03-01', completado: true }, { nombre: 'Integración con Portal de Transparencia', fecha: '2026-10-01', completado: false }], descripcion: 'Rediseño de la experiencia de evaluación de cumplimiento normativo contable.' },
  { id: 'PRY-03', nombre: 'Hub de Interoperabilidad SIGEF-DIGECOG', responsable: 'Departamento de Tecnología', ejeEstrategico: 2, objetivoEstrategico: 'Fortalecer capacidades institucionales', presupuesto: 22_000_000, fechaInicio: '2025-04-01', fechaFin: '2027-01-31', hitos: [{ nombre: 'Diseño de APIs', fecha: '2025-09-01', completado: true }, { nombre: 'Conexión piloto Tesorería Nacional', fecha: '2026-06-01', completado: false }, { nombre: 'Ampliación a Gobiernos Locales', fecha: '2027-01-31', completado: false }], descripcion: 'Arquitectura de interoperabilidad para intercambio automatizado de información financiera.' },
  { id: 'PRY-04', nombre: 'Programa Nacional de Capacitación en NICSP', responsable: 'Dirección de Capacitación y Asistencia Técnica', ejeEstrategico: 1, objetivoEstrategico: 'Ampliar la implementación del SCG', presupuesto: 14_200_000, fechaInicio: '2025-01-01', fechaFin: '2028-12-31', hitos: [{ nombre: '1,300 técnicos entrenados (meta 2025)', fecha: '2025-12-31', completado: true }, { nombre: '1,368 técnicos entrenados (meta 2026)', fecha: '2026-12-31', completado: false }], descripcion: 'Formación técnica continua alineada a la meta de técnicos entrenados del PEI.' },
  { id: 'PRY-05', nombre: 'Rediseño del Portal de Transparencia y Datos Abiertos', responsable: 'Comunicaciones / OAI', ejeEstrategico: 2, objetivoEstrategico: 'Fortalecer la transparencia y rendición de cuentas', presupuesto: 6_800_000, fechaInicio: '2026-02-01', fechaFin: '2026-12-15', hitos: [{ nombre: 'Inventario de datasets', fecha: '2026-04-01', completado: true }, { nombre: 'Publicación de nuevos datasets', fecha: '2026-09-01', completado: false }], descripcion: 'Modernización del centro de publicación de datos financieros y estadísticos.' },
  { id: 'PRY-06', nombre: 'Sistema Integrado de Producción de Estadísticas (SIPEI)', responsable: 'Planificación y Desarrollo', ejeEstrategico: 2, objetivoEstrategico: 'Fortalecer capacidades institucionales', presupuesto: 9_500_000, fechaInicio: '2026-01-01', fechaFin: '2026-12-31', hitos: [{ nombre: 'Aprobación de la política SIPEI v2', fecha: '2026-04-01', completado: true }, { nombre: 'Catálogo de indicadores institucionales', fecha: '2026-08-01', completado: false }], descripcion: 'Implementación de la Política del Sistema Integrado de Producción de Estadísticas Institucional.' },
  { id: 'PRY-07', nombre: 'Fortalecimiento del SIAB — Gestión de Activos', responsable: 'Dirección de Procesamiento Contable', ejeEstrategico: 1, objetivoEstrategico: 'Ampliar la implementación del SCG', presupuesto: 11_000_000, fechaInicio: '2025-06-01', fechaFin: '2027-03-31', hitos: [{ nombre: 'Diagnóstico de bienes muebles e inmuebles', fecha: '2025-11-01', completado: true }, { nombre: 'Integración contable de activos', fecha: '2026-09-01', completado: false }], descripcion: 'Integración del Sistema de Administración de Bienes con el catálogo contable.' },
  { id: 'PRY-08', nombre: 'Ciberseguridad y Continuidad de Sistemas Contables', responsable: 'Departamento de Tecnología', ejeEstrategico: 2, objetivoEstrategico: 'Fortalecer capacidades institucionales', presupuesto: 7_400_000, fechaInicio: '2026-01-01', fechaFin: '2026-12-31', hitos: [{ nombre: 'Diagnóstico de vulnerabilidades', fecha: '2026-05-01', completado: true }, { nombre: 'Plan de continuidad implementado', fecha: '2026-11-01', completado: false }], descripcion: 'Fortalecimiento de la seguridad y continuidad operativa de los sistemas críticos.' },
  { id: 'PRY-09', nombre: 'Actualización del Plan de Cuentas Contables (v3)', responsable: 'Dirección de Normas, Políticas y Procedimientos', ejeEstrategico: 1, objetivoEstrategico: 'Ampliar la implementación del SCG', presupuesto: 4_200_000, fechaInicio: '2026-03-01', fechaFin: '2027-02-28', hitos: [{ nombre: 'Diagnóstico de brechas NICSP 2021', fecha: '2026-06-01', completado: false }], descripcion: 'Revisión y actualización del Plan de Cuentas vigente conforme a normas internacionales.' },
  { id: 'PRY-10', nombre: 'Gestión del Cambio para la Transformación Digital', responsable: 'Planificación y Desarrollo', ejeEstrategico: 2, objetivoEstrategico: 'Fortalecer capacidades institucionales', presupuesto: 3_100_000, fechaInicio: '2026-01-15', fechaFin: '2026-12-31', hitos: [{ nombre: 'Matriz de partes interesadas actualizada', fecha: '2026-03-01', completado: true }, { nombre: 'Plan de comunicación y capacitación', fecha: '2026-07-01', completado: false }], descripcion: 'Estrategia de adopción y gestión del cambio para las iniciativas de transformación digital.' },
];

export const PROYECTOS: Proyecto[] = PROYECTOS_BASE.map((p) => {
  const r = new Rng(`proy-${p.id}`);
  const completados = p.hitos.filter((h) => h.completado).length;
  const avance = Math.round((completados / p.hitos.length) * 100 * r.float(0.85, 1)) + r.int(0, 4);
  const avanceFinal = Math.min(98, Math.max(5, avance));
  const ejecutado = p.presupuesto * (avanceFinal / 100) * r.float(0.85, 1.05);
  const semaforo: Proyecto['semaforo'] = avanceFinal >= 70 ? 'Verde' : avanceFinal >= 40 ? 'Amarillo' : 'Rojo';
  return { ...p, avance: avanceFinal, ejecutado, semaforo, estado: avanceFinal >= 95 ? 'Cerrado' : semaforo === 'Rojo' ? 'En riesgo' : 'En ejecución' };
});

// ---------------------------------------------------------------------------
// 11. POA / INDICADORES — mezcla REAL (contexto maestro) + SIMULADA
// ---------------------------------------------------------------------------
function avanceMensualSintetico(metaAnual: number, seedTag: string): number[] {
  const r = new Rng(seedTag);
  const out: number[] = [];
  let acumulado = 0;
  for (let m = 1; m <= 12; m++) {
    if (m > MES_CORTE_ACTUAL) { out.push(acumulado); continue; }
    acumulado = Math.min(metaAnual, acumulado + (metaAnual / 12) * r.float(0.6, 1.3));
    out.push(Math.round(acumulado * 10) / 10);
  }
  return out;
}

export const INDICADORES_POA: IndicadorPOA[] = [
  {
    id: 'IND-REAL-01', eje: 1,
    objetivoEstrategico: 'Sistema de Contabilidad Gubernamental Fortalecido, Moderno y Eficaz',
    objetivoOperativo: 'Ampliar la implementación del SCG en el Gobierno Central y Gobiernos Locales',
    producto: 'Instituciones con SCG implementado',
    indicador: 'Instituciones del Gobierno Central y Gobiernos Locales con SCG implementado (%)',
    tipoKPI: 'Eficacia', lineaBase2024: '39%', meta2025: '41%', meta2026: '45%', meta2027: '49%', meta2028: '53%',
    avanceMensual: avanceMensualSintetico(45, 'poa-scg'), unidad: '%', esReal: true,
  },
  {
    id: 'IND-REAL-02', eje: 1,
    objetivoEstrategico: 'Sistema de Contabilidad Gubernamental Fortalecido, Moderno y Eficaz',
    objetivoOperativo: 'Evaluar el cumplimiento normativo del SPNF',
    producto: 'Instituciones evaluadas mediante SISACNOC',
    indicador: 'Instituciones del SPNF incluidas en informes de rendición de cuentas y evaluadas mediante SISACNOC',
    tipoKPI: 'Eficacia', lineaBase2024: 520, meta2025: 530, meta2026: 535, meta2027: 540, meta2028: 545,
    avanceMensual: avanceMensualSintetico(535, 'poa-sisacnoc'), unidad: 'instituciones', esReal: true,
  },
  {
    id: 'IND-REAL-03', eje: 1,
    objetivoEstrategico: 'Sistema de Contabilidad Gubernamental Fortalecido, Moderno y Eficaz',
    objetivoOperativo: 'Fortalecer las capacidades técnicas del Sector Público',
    producto: 'Técnicos capacitados',
    indicador: 'Técnicos de áreas financieras entrenados en implementación de normativas contables',
    tipoKPI: 'Eficacia', lineaBase2024: 333, meta2025: 1300, meta2026: 1368, meta2027: 1894, meta2028: 1897,
    avanceMensual: avanceMensualSintetico(1368, 'poa-tecnicos'), unidad: 'técnicos', esReal: true,
  },
  {
    id: 'IND-REAL-04', eje: 2,
    objetivoEstrategico: 'Capacidades y procesos internos orientados a resultados',
    objetivoOperativo: 'Fortalecer las políticas transversales institucionales',
    producto: 'Cumplimiento de políticas transversales',
    indicador: 'Cumplimiento de políticas transversales (género, ambiente, territorio, DDHH, riesgos)',
    tipoKPI: 'Calidad', lineaBase2024: '26%', meta2025: '45%', meta2026: '60%', meta2027: '70%', meta2028: '80%',
    avanceMensual: avanceMensualSintetico(60, 'poa-transversal'), unidad: '%', esReal: true,
  },
  {
    id: 'IND-SIM-01', eje: 1, objetivoEstrategico: 'Sistema de Contabilidad Gubernamental Fortalecido, Moderno y Eficaz',
    objetivoOperativo: 'Consolidar la información financiera del SPNF', producto: 'Estados financieros consolidados publicados',
    indicador: 'Estados financieros consolidados publicados en el plazo normativo', tipoKPI: 'Oportunidad',
    lineaBase2024: '71%', meta2025: '78%', meta2026: '85%', meta2027: '90%', meta2028: '94%',
    avanceMensual: avanceMensualSintetico(85, 'poa-consolidacion'), unidad: '%', esReal: false,
  },
  {
    id: 'IND-SIM-02', eje: 2, objetivoEstrategico: 'Capacidades y procesos internos orientados a resultados',
    objetivoOperativo: 'Fortalecer la interoperabilidad tecnológica', producto: 'Servicios de interoperabilidad activos',
    indicador: 'Servicios de interoperabilidad con sistemas del Estado activos y disponibles', tipoKPI: 'Eficiencia',
    lineaBase2024: 3, meta2025: 5, meta2026: 8, meta2027: 12, meta2028: 15,
    avanceMensual: avanceMensualSintetico(8, 'poa-interop'), unidad: 'servicios', esReal: false,
  },
  {
    id: 'IND-SIM-03', eje: 2, objetivoEstrategico: 'Capacidades y procesos internos orientados a resultados',
    objetivoOperativo: 'Fortalecer la gestión de riesgos institucional', producto: 'Riesgos con tratamiento implementado',
    indicador: 'Eficacia de la gestión integral de riesgos y oportunidades', tipoKPI: 'Eficacia',
    lineaBase2024: '58%', meta2025: '65%', meta2026: '72%', meta2027: '80%', meta2028: '88%',
    avanceMensual: avanceMensualSintetico(72, 'poa-riesgos'), unidad: '%', esReal: false,
  },
];

// ---------------------------------------------------------------------------
// 12. ALERTAS — generadas a partir de las señales de SISACNOC / Calidad / ERIR
// ---------------------------------------------------------------------------
export const ALERTAS: Alerta[] = (() => {
  const out: Alerta[] = [];
  let seq = 1;
  const rr = new Rng('alertas');
  for (const inst of INSTITUCIONES) {
    const cal = calidadActualDe(inst.id);
    const sis = ultimoSisacnoc(inst.id);
    if (sis && sis.categoria === 'Crítico') {
      out.push({ id: `ALT-${String(seq++).padStart(4, '0')}`, severidad: 'Crítica', modulo: 'SISACNOC', institucionId: inst.id, mensaje: `${inst.siglas || inst.nombre}: cumplimiento SISACNOC en categoría Crítico (${sis.cumplimientoGeneral.toFixed(1)}%).`, fecha: `${ANIO_ACTUAL}-0${rr.int(1, 7)}-1${rr.int(0, 9)}`, atendida: rr.bool(0.3) });
    }
    if (cal && cal.indiceGeneral < 45) {
      out.push({ id: `ALT-${String(seq++).padStart(4, '0')}`, severidad: 'Alta', modulo: 'Calidad del Dato', institucionId: inst.id, mensaje: `${inst.siglas || inst.nombre}: índice de calidad de datos por debajo del umbral (${cal.indiceGeneral.toFixed(1)}%).`, fecha: `${ANIO_ACTUAL}-0${rr.int(1, 7)}-0${rr.int(1, 9)}`, atendida: rr.bool(0.4) });
    }
    const erirVigente = ERIR_REGISTROS.find((e) => e.institucionId === inst.id && e.anio === 2026);
    if (erirVigente && erirVigente.estado === 'Pendiente') {
      out.push({ id: `ALT-${String(seq++).padStart(4, '0')}`, severidad: 'Media', modulo: 'ERIR', institucionId: inst.id, mensaje: `${inst.siglas || inst.nombre}: información del ERIR 2026 pendiente de recepción.`, fecha: `${ANIO_ACTUAL}-07-${10 + rr.int(0, 15)}`, atendida: rr.bool(0.2) });
    }
    const efs = estadosFinancierosDeInstitucion(inst.id);
    if (efs.length >= 2) {
      const actual = efs[efs.length - 1];
      const anterior = efs[efs.length - 2];
      const variacionGasto = anterior.gastosFuncionamiento > 0 ? (actual.gastosFuncionamiento - anterior.gastosFuncionamiento) / anterior.gastosFuncionamiento : 0;
      if (Math.abs(variacionGasto) > 0.28) {
        out.push({ id: `ALT-${String(seq++).padStart(4, '0')}`, severidad: 'Media', modulo: 'Analítica Financiera', institucionId: inst.id, mensaje: `${inst.siglas || inst.nombre}: variación de ${(variacionGasto * 100).toFixed(1)}% en gastos de funcionamiento respecto del período anterior.`, fecha: `${ANIO_ACTUAL}-0${rr.int(1, 7)}-2${rr.int(0, 8)}`, atendida: rr.bool(0.35) });
      }
    }
  }
  return out.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
})();

// ---------------------------------------------------------------------------
// 13. DOCUMENTOS NORMATIVOS — REALES, mencionados en el Contexto Maestro
// ---------------------------------------------------------------------------
export const DOCUMENTOS_NORMATIVOS: DocumentoNormativo[] = [
  { id: 'DOC-01', codigo: 'Ley 126-01', nombre: 'Ley que crea la Dirección General de Contabilidad Gubernamental', tipo: 'Resolución', version: 'Única', fechaEmision: '2001-07-27', fechaRevision: null, responsable: 'Congreso Nacional', estado: 'Vigente', proceso: 'Marco legal', baseLegal: ['Constitución de la República Dominicana'] },
  { id: 'DOC-02', codigo: 'Decreto 526-09', nombre: 'Reglamento de Aplicación de la Ley 126-01', tipo: 'Resolución', version: 'Única', fechaEmision: '2009-09-01', fechaRevision: null, responsable: 'Poder Ejecutivo', estado: 'Vigente', proceso: 'Marco legal', baseLegal: ['Ley 126-01'] },
  { id: 'DOC-03', codigo: 'PCC-2.0', nombre: 'Plan de Cuentas Contables y su Descripción', tipo: 'Manual', version: '2.0', fechaEmision: '2023-06-01', fechaRevision: null, responsable: 'Dirección de Normas, Políticas y Procedimientos', estado: 'Vigente', proceso: 'Normativa contable', baseLegal: ['Ley 126-01', 'Decreto 526-09', 'NICSP 2021'] },
  { id: 'DOC-04', codigo: 'ODC-DIGECOG-PD-004 v4', nombre: 'Mapa de Procesos DIGECOG', tipo: 'Matriz', version: '4', fechaEmision: '2024-07-08', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Gestión de procesos', baseLegal: ['ISO 9001:2015'] },
  { id: 'DOC-05', codigo: 'POL-DIGECOG-PD-008', nombre: 'Política de Igualdad de Género', tipo: 'Política', version: '1', fechaEmision: '2022-07-18', fechaRevision: null, responsable: 'Recursos Humanos / Planificación y Desarrollo', estado: 'En revisión', proceso: 'Políticas transversales', baseLegal: ['PEI 2025-2028'] },
  { id: 'DOC-06', codigo: 'POL-SIPEI-v2', nombre: 'Política del Sistema Integrado de Producción de Estadísticas Institucional (SIPEI)', tipo: 'Política', version: '2', fechaEmision: '2026-04-01', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Datos y estadísticas', baseLegal: ['Ley 126-01'] },
  { id: 'DOC-07', codigo: 'POL-GC', nombre: 'Política de Gestión del Cambio', tipo: 'Política', version: '1', fechaEmision: '2024-09-01', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Gestión del cambio', baseLegal: [] },
  { id: 'DOC-08', codigo: 'POL-BM', nombre: 'Política de Benchmarking/Benchlearning', tipo: 'Política', version: '1', fechaEmision: '2024-06-01', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Mejora continua', baseLegal: [] },
  { id: 'DOC-09', codigo: 'POL-INNOV', nombre: 'Política de Gestión de la Innovación', tipo: 'Política', version: '1', fechaEmision: '2024-08-01', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Innovación', baseLegal: [] },
  { id: 'DOC-10', codigo: 'POL-SNC', nombre: 'Política para la Gestión de Salidas No Conformes', tipo: 'Política', version: '1', fechaEmision: '2024-05-01', fechaRevision: null, responsable: 'Sistema Integrado de Gestión', estado: 'Vigente', proceso: 'Calidad', baseLegal: ['ISO 9001:2015'] },
  { id: 'DOC-11', codigo: 'POL-AUD-v6', nombre: 'Política de Gestión de Competencias y Evaluación de Auditores Internos', tipo: 'Política', version: '6', fechaEmision: '2026-03-06', fechaRevision: null, responsable: 'Sistema Integrado de Gestión', estado: 'Vigente', proceso: 'Auditoría interna', baseLegal: ['ISO 9001:2015', 'ISO 37001', 'ISO 37301'] },
  { id: 'DOC-12', codigo: 'POL-ENC', nombre: 'Política para el Diseño y Análisis de Encuestas de Satisfacción', tipo: 'Política', version: '1', fechaEmision: '2024-03-01', fechaRevision: null, responsable: 'Planificación y Desarrollo', estado: 'Vigente', proceso: 'Partes interesadas', baseLegal: [] },
  { id: 'DOC-13', codigo: 'Ley 47-25', nombre: 'Ley Orgánica de Contrataciones Públicas', tipo: 'Resolución', version: 'Única', fechaEmision: '2026-01-01', fechaRevision: null, responsable: 'Congreso Nacional', estado: 'Vigente', proceso: 'Compras y contrataciones', baseLegal: [] },
  { id: 'DOC-14', codigo: 'Decreto 52-26', nombre: 'Reglamento de Aplicación General de la Ley 47-25', tipo: 'Resolución', version: 'Única', fechaEmision: '2026-01-15', fechaRevision: null, responsable: 'Poder Ejecutivo', estado: 'Vigente', proceso: 'Compras y contrataciones', baseLegal: ['Ley 47-25'] },
  { id: 'DOC-15', codigo: 'Ley 45-25', nombre: 'Ley que integra el Ministerio de Economía, Planificación y Desarrollo al Ministerio de Hacienda', tipo: 'Resolución', version: 'Única', fechaEmision: '2025-07-01', fechaRevision: null, responsable: 'Congreso Nacional', estado: 'Vigente', proceso: 'Marco legal', baseLegal: [] },
];

// ---------------------------------------------------------------------------
// 14. KPIs de escala nacional (DEMO — proyección ilustrativa, ver docs §C)
// ---------------------------------------------------------------------------
export const KPI_ESCALA_NACIONAL = {
  institucionesMonitoreadas: 685, // cifra PEI 2028 (meta SISACNOC) usada como referencia de escala
  institucionesMuestraReal: INSTITUCIONES.length,
  registrosProcesados: 4_800_000,
  volumenFinancieroAnalizadoRD: 1_700_000_000_000,
  validacionesCompletadasPct: 98.4,
};
