// Modelo de datos conceptual DIGECOG 360°
// Ver docs/01-descubrimiento-arquitectura.md § B para el diagrama DIM_/FACT_

export type NivelGobierno =
  | 'Gobierno Central'
  | 'Descentralizada'
  | 'Autónoma'
  | 'Seguridad Social'
  | 'Empresa Pública No Financiera'
  | 'Empresa Pública Financiera'
  | 'Ayuntamiento'
  | 'Junta de Distrito Municipal';

export type Sector =
  | 'Administración General'
  | 'Justicia'
  | 'Defensa y Seguridad'
  | 'Salud'
  | 'Educación'
  | 'Energía'
  | 'Agua y Saneamiento'
  | 'Transporte e Infraestructura'
  | 'Seguridad Social'
  | 'Financiero'
  | 'Agropecuario'
  | 'Turismo'
  | 'Cultura y Deporte'
  | 'Municipal'
  | 'Trabajo y Empleo'
  | 'Tecnología y Comunicaciones';

export type Region = 'Cibao Norte' | 'Cibao Sur' | 'Cibao Nordeste' | 'Cibao Noroeste' | 'Valdesia' | 'Enriquillo' | 'El Valle' | 'Yuma' | 'Higuamo' | 'Ozama (Metropolitana)';

export interface Institucion {
  id: string;
  nombre: string;
  siglas: string;
  nivelGobierno: NivelGobierno;
  sector: Sector;
  region: Region;
  provincia: string;
  esEmpresaPublica: boolean;
  scgImplementado: boolean;
  sisacnocActivo: boolean;
  sinocActivo: boolean;
  siabActivo: boolean;
  fechaIncorporacion: string; // ISO
  responsable: string;
  cargoResponsable: string;
}

export type Clasificacion = 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingresos' | 'Gastos';
export type Naturaleza = 'Deudora' | 'Acreedora';

export interface CuentaContable {
  id: string;
  codigo: string;
  descripcion: string;
  nivel: 1 | 2 | 3 | 4; // Clase / Grupo / Subgrupo / Cuenta
  cuentaPadreId: string | null;
  clasificacion: Clasificacion;
  naturaleza: Naturaleza;
  estado: 'Vigente' | 'En revisión';
}

export interface Periodo {
  anio: number;
  mes: number; // 1-12
  trimestre: 1 | 2 | 3 | 4;
  fechaCorte: string;
  esCierreAnual: boolean;
  key: string; // `${anio}-${mes}`
}

export interface SaldoContable {
  institucionId: string;
  cuentaId: string;
  periodoKey: string;
  saldoInicial: number;
  debitos: number;
  creditos: number;
  saldoFinal: number;
}

export interface Transaccion {
  id: string;
  institucionId: string;
  cuentaId: string;
  fecha: string;
  tipo: 'Débito' | 'Crédito';
  monto: number;
  fuente: 'SIGEF' | 'Carga manual' | 'Interoperabilidad' | 'API' | 'Archivo';
  glosa: string;
}

export interface EstadoFinanciero {
  institucionId: string;
  anio: number;
  mes: number;
  activoCorriente: number;
  activoNoCorriente: number;
  pasivoCorriente: number;
  pasivoNoCorriente: number;
  patrimonio: number;
  ingresosCorrientes: number;
  ingresosCapital: number;
  gastosFuncionamiento: number;
  gastosCapital: number;
  transferencias: number;
  resultadoEjercicio: number;
  flujoOperacion: number;
  flujoInversion: number;
  flujoFinanciamiento: number;
}

export interface EjecucionPresupuestaria {
  institucionId: string;
  anio: number;
  mes: number;
  presupuestoAprobado: number;
  presupuestoModificado: number;
  devengado: number;
  pagado: number;
}

export interface SisacnocEvaluacion {
  institucionId: string;
  anio: number;
  semestre: 1 | 2;
  oportunidad: number; // 0-100
  transparencia: number;
  comparabilidad: number;
  gestionActivos: number;
  cumplimientoGeneral: number;
  categoria: 'Óptimo' | 'Satisfactorio' | 'En proceso' | 'Crítico';
}

export interface ErirRegistro {
  institucionId: string;
  anio: number;
  cuentasPresupuestariasIntegradas: boolean;
  cuentasPatrimonialesIntegradas: boolean;
  fechaRecepcion: string | null;
  fechaValidacion: string | null;
  fechaIntegracion: string | null;
  fechaConsolidacion: string | null;
  estado: 'Pendiente' | 'Recibido' | 'Validado' | 'Integrado' | 'Consolidado' | 'Publicado';
}

export interface CalidadDato {
  institucionId: string;
  anio: number;
  mes: number;
  completitud: number;
  consistencia: number;
  oportunidad: number;
  exactitud: number;
  duplicidad: number;
  integridad: number;
  indiceGeneral: number;
}

export interface Riesgo {
  id: string;
  proceso: string;
  riesgo: string;
  causa: string;
  consecuencia: string;
  probabilidad: 1 | 2 | 3 | 4 | 5;
  impacto: 1 | 2 | 3 | 4 | 5;
  controlesExistentes: string;
  efectividadControl: 'Alta' | 'Media' | 'Baja';
  responsable: string;
  tratamiento: 'Evitar' | 'Mitigar' | 'Transferir' | 'Aceptar';
  fechaIdentificacion: string;
  estado: 'Abierto' | 'En tratamiento' | 'Cerrado';
}

export interface Proyecto {
  id: string;
  nombre: string;
  responsable: string;
  ejeEstrategico: 1 | 2;
  objetivoEstrategico: string;
  estado: 'Formulación' | 'En ejecución' | 'En riesgo' | 'Cerrado' | 'Suspendido';
  avance: number;
  presupuesto: number;
  ejecutado: number;
  fechaInicio: string;
  fechaFin: string;
  hitos: { nombre: string; fecha: string; completado: boolean }[];
  semaforo: 'Verde' | 'Amarillo' | 'Rojo';
  descripcion: string;
}

export interface IndicadorPOA {
  id: string;
  eje: 1 | 2;
  objetivoEstrategico: string;
  objetivoOperativo: string;
  producto: string;
  indicador: string;
  tipoKPI: 'Eficacia' | 'Eficiencia' | 'Calidad' | 'Economía' | 'Oportunidad';
  lineaBase2024: number | string;
  meta2025: number | string;
  meta2026: number | string;
  meta2027: number | string;
  meta2028: number | string;
  avanceMensual: number[]; // 12 valores % del año vigente
  unidad: string;
  esReal: boolean; // true si la cifra viene del contexto cargado (PEI/POA reales)
}

export interface Alerta {
  id: string;
  severidad: 'Crítica' | 'Alta' | 'Media' | 'Informativa';
  modulo: string;
  institucionId?: string;
  mensaje: string;
  fecha: string;
  atendida: boolean;
}

export interface DocumentoNormativo {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'Política' | 'Procedimiento' | 'Manual' | 'Matriz' | 'Formulario' | 'Circular' | 'Resolución' | 'Guía';
  version: string;
  fechaEmision: string;
  fechaRevision: string | null;
  responsable: string;
  estado: 'Vigente' | 'En revisión' | 'Sustituido' | 'Histórico';
  proceso: string;
  baseLegal: string[];
}

export interface Activo {
  id: string;
  institucionId: string;
  categoria: 'Terrenos' | 'Edificaciones' | 'Vehículos' | 'Mobiliario y Equipo' | 'Equipo Tecnológico' | 'Maquinaria';
  descripcion: string;
  valorAdquisicion: number;
  depreciacionAcumulada: number;
  valorNeto: number;
  fechaAdquisicion: string;
  ubicacion: string;
  estado: 'Activo' | 'En mantenimiento' | 'Dado de baja';
}
