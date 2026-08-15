// Control de acceso por rol (RBAC) — DEMO.
// Los alcances reproducen los perfiles diferenciados definidos en el prompt maestro §39
// y son coherentes con la segregación de funciones que exigiría el Sistema Integrado
// de Gestión. La restricción es de interfaz (navegación y render): en una implementación
// real debe aplicarse también en el servidor, sobre cada consulta de datos.

export const ROL_ACCESO_TOTAL = 'Director General';

/** Rutas siempre disponibles para cualquier perfil interno autenticado. */
const BASE_INTERNA = ['/alertas', '/mia'];

/**
 * Rutas permitidas por rol. `'*'` = acceso total.
 * El orden importa: la primera ruta de la lista es la pantalla de inicio del perfil.
 */
export const PERMISOS_POR_ROL: Record<string, '*' | string[]> = {
  // Acceso ejecutivo completo
  'Director General': '*',

  // Acceso analítico y operativo sobre la función misional
  'Directores Misionales': [
    '/', '/monitor', '/institucion', '/empresas-publicas', '/gobiernos-locales',
    '/contabilidad', '/estados-financieros', '/consolidacion', '/cierre',
    '/sisacnoc', '/erir', '/calidad-dato', '/analitica', '/estadisticas',
    '/normativas', '/sinoc', '/siab', ...BASE_INTERNA,
  ],

  // PEI, POA, proyectos, indicadores, procesos, riesgos y calidad
  'Planificación y Desarrollo': [
    '/', '/pei', '/poa', '/proyectos', '/riesgos', '/sig', '/documental',
    '/innovacion', '/estadisticas', '/calidad-dato', ...BASE_INTERNA,
  ],

  // Normativas, catálogo de cuentas y capacitación
  'Políticas, Normas y Procedimientos Contables': [
    '/', '/normativas', '/contabilidad', '/sinoc', '/documental', ...BASE_INTERNA,
  ],

  // Información contable, estados financieros, cierre y consolidación
  'Procesamiento Contable y Estados Financieros': [
    '/', '/contabilidad', '/estados-financieros', '/consolidacion', '/cierre',
    '/erir', '/siab', '/monitor', '/institucion', '/calidad-dato', ...BASE_INTERNA,
  ],

  // SISACNOC, estadísticas, análisis y BI
  'Análisis de Información Financiera': [
    '/', '/sisacnoc', '/analitica', '/estadisticas', '/calidad-dato',
    '/empresas-publicas', '/gobiernos-locales', '/monitor', '/institucion',
    '/erir', ...BASE_INTERNA,
  ],

  // Administración técnica e interoperabilidad
  'Tecnología': [
    '/interoperabilidad', '/administracion', '/calidad-dato', '/', ...BASE_INTERNA,
  ],

  // Normativas y cumplimiento
  'Jurídico / Cumplimiento': [
    '/', '/normativas', '/sig', '/documental', '/sisacnoc', ...BASE_INTERNA,
  ],

  // Transparencia y acceso a la información
  'OAI': ['/transparencia', '/estadisticas', '/documental', '/mia'],

  // Solo la información correspondiente a su propia institución
  'Entidad Reportante (SPNF)': [
    '/cierre', '/institucion', '/normativas', '/sinoc', '/mia',
  ],

  // Consulta y trazabilidad, sin capacidad de gestión
  'Auditor': [
    '/', '/monitor', '/institucion', '/contabilidad', '/estados-financieros',
    '/erir', '/sisacnoc', '/calidad-dato', '/normativas', '/documental',
    '/riesgos', '/sig', ...BASE_INTERNA,
  ],

  // Datos públicos previamente autorizados
  'Ciudadanía': ['/transparencia', '/estadisticas', '/erir'],
};

/** Descripción del alcance de cada perfil (se muestra en el acceso y en la pantalla de restricción). */
export const ALCANCE_POR_ROL: Record<string, string> = {
  'Director General': 'Acceso ejecutivo a todos los módulos de la plataforma.',
  'Directores Misionales': 'Acceso analítico y operativo sobre la función misional del SCG.',
  'Planificación y Desarrollo': 'PEI, POA, proyectos, riesgos, calidad, documentos e innovación.',
  'Políticas, Normas y Procedimientos Contables': 'Normativas, catálogo de cuentas y capacitación.',
  'Procesamiento Contable y Estados Financieros': 'Información contable, estados financieros, cierre y consolidación.',
  'Análisis de Información Financiera': 'SISACNOC, analítica financiera, estadísticas y calidad del dato.',
  'Tecnología': 'Interoperabilidad, administración del sistema y calidad del dato.',
  'Jurídico / Cumplimiento': 'Normativas, Sistema Integrado de Gestión y cumplimiento.',
  'OAI': 'Transparencia, estadísticas publicables y gestión documental.',
  'Entidad Reportante (SPNF)': 'Únicamente la información correspondiente a su institución.',
  'Auditor': 'Consulta y trazabilidad, sin capacidad de gestión.',
  'Ciudadanía': 'Datos públicos previamente autorizados.',
};

/** Normaliza una ruta a su módulo base (p. ej. /institucion/INS-003 → /institucion). */
function moduloDe(path: string): string {
  if (path === '/') return '/';
  const segmento = '/' + path.split('/').filter(Boolean)[0];
  return segmento;
}

export function tieneAccesoTotal(rol: string | null | undefined): boolean {
  return !!rol && PERMISOS_POR_ROL[rol] === '*';
}

export function puedeAcceder(rol: string | null | undefined, path: string): boolean {
  if (!rol) return false;
  const permisos = PERMISOS_POR_ROL[rol];
  if (permisos === undefined) return false; // rol desconocido: denegar por defecto
  if (permisos === '*') return true;
  return permisos.includes(moduloDe(path));
}

/** Pantalla de inicio del perfil: la primera ruta declarada en su alcance. */
export function rutaInicialDe(rol: string | null | undefined): string {
  if (!rol) return '/login';
  const permisos = PERMISOS_POR_ROL[rol];
  if (permisos === undefined) return '/login';
  if (permisos === '*') return '/';
  const primera = permisos.find((p) => p !== '/institucion') ?? '/';
  return primera;
}
