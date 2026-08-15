// Nombres institucionales REALES (verificados por tipo/clasificación en fuentes oficiales — ver docs/01-descubrimiento-arquitectura.md §7).
// Los ATRIBUTOS operativos (SCG implementado, cumplimiento SISACNOC, saldos, etc.) que se asignan a cada institución
// en src/data/generator.ts son SIMULADOS y se marcan como DEMO en toda la interfaz.
// Empresas públicas no financieras: clasificación confirmada vía hacienda.gob.do / DIGEPRES (ejecución EPNF).

import type { NivelGobierno, Sector, Region } from './types';

export interface InstitucionFuente {
  nombre: string;
  siglas: string;
  nivelGobierno: NivelGobierno;
  sector: Sector;
  region: Region;
  provincia: string;
}

const GC: Region = 'Ozama (Metropolitana)';

export const GOBIERNO_CENTRAL: InstitucionFuente[] = [
  { nombre: 'Ministerio de Hacienda y Economía', siglas: 'MHE', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Educación', siglas: 'MINERD', nivelGobierno: 'Gobierno Central', sector: 'Educación', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Salud Pública', siglas: 'MSP', nivelGobierno: 'Gobierno Central', sector: 'Salud', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Obras Públicas y Comunicaciones', siglas: 'MOPC', nivelGobierno: 'Gobierno Central', sector: 'Transporte e Infraestructura', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Interior y Policía', siglas: 'MIP', nivelGobierno: 'Gobierno Central', sector: 'Defensa y Seguridad', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Defensa', siglas: 'MIDE', nivelGobierno: 'Gobierno Central', sector: 'Defensa y Seguridad', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Relaciones Exteriores', siglas: 'MIREX', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Trabajo', siglas: 'MT', nivelGobierno: 'Gobierno Central', sector: 'Trabajo y Empleo', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Agricultura', siglas: 'MA', nivelGobierno: 'Gobierno Central', sector: 'Agropecuario', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Medio Ambiente y Recursos Naturales', siglas: 'MIMARENA', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Industria, Comercio y Mipymes', siglas: 'MICM', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Turismo', siglas: 'MITUR', nivelGobierno: 'Gobierno Central', sector: 'Turismo', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Cultura', siglas: 'MC', nivelGobierno: 'Gobierno Central', sector: 'Cultura y Deporte', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de la Mujer', siglas: 'MM', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Deportes y Recreación', siglas: 'MIDEREC', nivelGobierno: 'Gobierno Central', sector: 'Cultura y Deporte', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de la Juventud', siglas: 'MJ', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Energía y Minas', siglas: 'MEM', nivelGobierno: 'Gobierno Central', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Ministerio de Administración Pública', siglas: 'MAP', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Procuraduría General de la República', siglas: 'PGR', nivelGobierno: 'Gobierno Central', sector: 'Justicia', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Poder Judicial - Suprema Corte de Justicia', siglas: 'PJ-SCJ', nivelGobierno: 'Gobierno Central', sector: 'Justicia', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Senado de la República', siglas: 'SENADO', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Cámara de Diputados', siglas: 'CD', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Junta Central Electoral', siglas: 'JCE', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Cámara de Cuentas de la República Dominicana', siglas: 'CCRD', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Contraloría General de la República', siglas: 'CGR', nivelGobierno: 'Gobierno Central', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Tribunal Constitucional', siglas: 'TC', nivelGobierno: 'Gobierno Central', sector: 'Justicia', region: GC, provincia: 'Distrito Nacional' },
];

export const DESCENTRALIZADAS: InstitucionFuente[] = [
  { nombre: 'Instituto Nacional de Formación Técnico Profesional', siglas: 'INFOTEP', nivelGobierno: 'Descentralizada', sector: 'Trabajo y Empleo', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Dominicano de las Telecomunicaciones', siglas: 'INDOTEL', nivelGobierno: 'Descentralizada', sector: 'Tecnología y Comunicaciones', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Nacional de Aguas Potables y Alcantarillados', siglas: 'INAPA', nivelGobierno: 'Descentralizada', sector: 'Agua y Saneamiento', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Dominicano de Aviación Civil', siglas: 'IDAC', nivelGobierno: 'Descentralizada', sector: 'Transporte e Infraestructura', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Nacional de la Vivienda', siglas: 'INVI', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto de Desarrollo y Crédito Cooperativo', siglas: 'IDECOOP', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto de Auxilios y Viviendas', siglas: 'INAVI', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Oficina Nacional de Estadística', siglas: 'ONE', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Impuestos Internos', siglas: 'DGII', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Aduanas', siglas: 'DGA', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Tesorería Nacional', siglas: 'TN', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Presupuesto', siglas: 'DIGEPRES', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Contrataciones Públicas', siglas: 'DGCP', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Oficina Gubernamental de Tecnologías de la Información y Comunicación', siglas: 'OGTIC', nivelGobierno: 'Descentralizada', sector: 'Tecnología y Comunicaciones', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Agrario Dominicano', siglas: 'IAD', nivelGobierno: 'Descentralizada', sector: 'Agropecuario', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Dominicano de Investigaciones Agropecuarias y Forestales', siglas: 'IDIAF', nivelGobierno: 'Descentralizada', sector: 'Agropecuario', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Consejo Nacional de la Niñez y la Adolescencia', siglas: 'CONANI', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Nacional de Bienestar Estudiantil', siglas: 'INABIE', nivelGobierno: 'Descentralizada', sector: 'Educación', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Postal Dominicano', siglas: 'INPOSDOM', nivelGobierno: 'Descentralizada', sector: 'Tecnología y Comunicaciones', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Dominicano para la Calidad', siglas: 'INDOCAL', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Migración', siglas: 'DGM', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Pasaportes', siglas: 'DGP', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Autoridad Portuaria Dominicana', siglas: 'APORDOM', nivelGobierno: 'Descentralizada', sector: 'Transporte e Infraestructura', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Oficina para el Reordenamiento del Transporte', siglas: 'OPRET', nivelGobierno: 'Descentralizada', sector: 'Transporte e Infraestructura', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Nacional de Recursos Hidráulicos', siglas: 'INDRHI', nivelGobierno: 'Descentralizada', sector: 'Agua y Saneamiento', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Dirección General de Contabilidad Gubernamental', siglas: 'DIGECOG', nivelGobierno: 'Descentralizada', sector: 'Administración General', region: GC, provincia: 'Distrito Nacional' },
];

export const SEGURIDAD_SOCIAL: InstitucionFuente[] = [
  { nombre: 'Tesorería de la Seguridad Social', siglas: 'TSS', nivelGobierno: 'Seguridad Social', sector: 'Seguridad Social', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Seguro Nacional de Salud', siglas: 'SeNaSa', nivelGobierno: 'Seguridad Social', sector: 'Seguridad Social', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Instituto Dominicano de Seguros Sociales', siglas: 'IDSS', nivelGobierno: 'Seguridad Social', sector: 'Seguridad Social', region: GC, provincia: 'Distrito Nacional' },
];

// Clasificación de EPNF confirmada: hacienda.gob.do (procedimiento presupuestos EPNF) y DIGEPRES (Libro de Ejecución EPNF 2022)
export const EMPRESAS_PUBLICAS_NO_FINANCIERAS: InstitucionFuente[] = [
  { nombre: 'Empresa de Generación Hidroeléctrica Dominicana', siglas: 'EGEHID', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Empresa de Transmisión Eléctrica Dominicana', siglas: 'ETED', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Empresa Distribuidora de Electricidad del Norte', siglas: 'EDENORTE', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: 'Cibao Norte', provincia: 'Santiago' },
  { nombre: 'Empresa Distribuidora de Electricidad del Sur', siglas: 'EDESUR', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Empresa Distribuidora de Electricidad del Este', siglas: 'EDEESTE', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Corporación Dominicana de Empresas Eléctricas Estatales', siglas: 'CDEEE', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Refinería Dominicana de Petróleo', siglas: 'REFIDOMSA', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Energía', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Corporación del Acueducto y Alcantarillado de Santo Domingo', siglas: 'CAASD', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Agua y Saneamiento', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Corporación del Acueducto y Alcantarillado de Santiago', siglas: 'CORAASAN', nivelGobierno: 'Empresa Pública No Financiera', sector: 'Agua y Saneamiento', region: 'Cibao Norte', provincia: 'Santiago' },
];

export const EMPRESAS_PUBLICAS_FINANCIERAS: InstitucionFuente[] = [
  { nombre: 'Banco de Reservas de la República Dominicana', siglas: 'Banreservas', nivelGobierno: 'Empresa Pública Financiera', sector: 'Financiero', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Banco Nacional de las Exportaciones', siglas: 'BANDEX', nivelGobierno: 'Empresa Pública Financiera', sector: 'Financiero', region: GC, provincia: 'Distrito Nacional' },
  { nombre: 'Banco Agrícola de la República Dominicana', siglas: 'BAGRICOLA', nivelGobierno: 'Empresa Pública Financiera', sector: 'Financiero', region: GC, provincia: 'Distrito Nacional' },
];

// Las 31 provincias + el Distrito Nacional (32 demarcaciones), con su cabecera municipal real.
const PROVINCIAS: { provincia: string; cabecera: string; region: Region }[] = [
  { provincia: 'Distrito Nacional', cabecera: 'Santo Domingo de Guzmán', region: 'Ozama (Metropolitana)' },
  { provincia: 'Azua', cabecera: 'Azua de Compostela', region: 'Valdesia' },
  { provincia: 'Bahoruco', cabecera: 'Neiba', region: 'Enriquillo' },
  { provincia: 'Barahona', cabecera: 'Barahona', region: 'Enriquillo' },
  { provincia: 'Dajabón', cabecera: 'Dajabón', region: 'Cibao Noroeste' },
  { provincia: 'Duarte', cabecera: 'San Francisco de Macorís', region: 'Cibao Nordeste' },
  { provincia: 'Elías Piña', cabecera: 'Comendador', region: 'El Valle' },
  { provincia: 'El Seibo', cabecera: 'Santa Cruz de El Seibo', region: 'Higuamo' },
  { provincia: 'Espaillat', cabecera: 'Moca', region: 'Cibao Norte' },
  { provincia: 'Hato Mayor', cabecera: 'Hato Mayor del Rey', region: 'Higuamo' },
  { provincia: 'Hermanas Mirabal', cabecera: 'Salcedo', region: 'Cibao Nordeste' },
  { provincia: 'Independencia', cabecera: 'Jimaní', region: 'Enriquillo' },
  { provincia: 'La Altagracia', cabecera: 'Salvaleón de Higüey', region: 'Yuma' },
  { provincia: 'La Romana', cabecera: 'La Romana', region: 'Yuma' },
  { provincia: 'La Vega', cabecera: 'Concepción de La Vega', region: 'Cibao Sur' },
  { provincia: 'María Trinidad Sánchez', cabecera: 'Nagua', region: 'Cibao Nordeste' },
  { provincia: 'Monseñor Nouel', cabecera: 'Bonao', region: 'Cibao Sur' },
  { provincia: 'Monte Cristi', cabecera: 'San Fernando de Monte Cristi', region: 'Cibao Noroeste' },
  { provincia: 'Monte Plata', cabecera: 'Monte Plata', region: 'Higuamo' },
  { provincia: 'Pedernales', cabecera: 'Pedernales', region: 'Enriquillo' },
  { provincia: 'Peravia', cabecera: 'Baní', region: 'Valdesia' },
  { provincia: 'Puerto Plata', cabecera: 'San Felipe de Puerto Plata', region: 'Cibao Norte' },
  { provincia: 'Samaná', cabecera: 'Santa Bárbara de Samaná', region: 'Cibao Nordeste' },
  { provincia: 'San Cristóbal', cabecera: 'San Cristóbal', region: 'Valdesia' },
  { provincia: 'San José de Ocoa', cabecera: 'San José de Ocoa', region: 'Valdesia' },
  { provincia: 'San Juan', cabecera: 'San Juan de la Maguana', region: 'El Valle' },
  { provincia: 'San Pedro de Macorís', cabecera: 'San Pedro de Macorís', region: 'Higuamo' },
  { provincia: 'Sánchez Ramírez', cabecera: 'Cotuí', region: 'Cibao Sur' },
  { provincia: 'Santiago', cabecera: 'Santiago de los Caballeros', region: 'Cibao Norte' },
  { provincia: 'Santiago Rodríguez', cabecera: 'San Ignacio de Sabaneta', region: 'Cibao Noroeste' },
  { provincia: 'Santo Domingo', cabecera: 'Santo Domingo Este', region: 'Ozama (Metropolitana)' },
  { provincia: 'Valverde', cabecera: 'Mao', region: 'Cibao Noroeste' },
];

export const AYUNTAMIENTOS: InstitucionFuente[] = PROVINCIAS.map((p) => ({
  nombre: p.provincia === 'Distrito Nacional' ? 'Ayuntamiento del Distrito Nacional' : `Ayuntamiento de ${p.cabecera}`,
  siglas: p.provincia === 'Distrito Nacional' ? 'ADN' : `AYTO-${p.cabecera.slice(0, 3).toUpperCase()}`,
  nivelGobierno: 'Ayuntamiento' as NivelGobierno,
  sector: 'Municipal' as Sector,
  region: p.region,
  provincia: p.provincia,
}));

// Municipios adicionales reales de la provincia Santo Domingo (además de la cabecera) y otras demarcaciones grandes,
// para reflejar mejor la densidad municipal real del país.
const MUNICIPIOS_ADICIONALES: InstitucionFuente[] = [
  { nombre: 'Ayuntamiento de Santo Domingo Norte', siglas: 'AYTO-SDN', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Ayuntamiento de Santo Domingo Oeste', siglas: 'AYTO-SDO', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Ayuntamiento de Boca Chica', siglas: 'AYTO-BCH', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Ayuntamiento de Los Alcarrizos', siglas: 'AYTO-ALC', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Ayuntamiento de San Felipe de Villa Mella', siglas: 'AYTO-VMELLA', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Ayuntamiento de Jarabacoa', siglas: 'AYTO-JAR', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Cibao Sur', provincia: 'La Vega' },
  { nombre: 'Ayuntamiento de Constanza', siglas: 'AYTO-CTZ', nivelGobierno: 'Ayuntamiento', sector: 'Municipal', region: 'Cibao Sur', provincia: 'La Vega' },
];

export const JUNTAS_DISTRITO_MUNICIPAL: InstitucionFuente[] = [
  { nombre: 'Junta de Distrito Municipal Sabana Perdida', siglas: 'JDM-SPER', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Junta de Distrito Municipal Pantoja', siglas: 'JDM-PANT', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Ozama (Metropolitana)', provincia: 'Santo Domingo' },
  { nombre: 'Junta de Distrito Municipal La Ciénaga', siglas: 'JDM-CIEN', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Enriquillo', provincia: 'Barahona' },
  { nombre: 'Junta de Distrito Municipal Juan López', siglas: 'JDM-JLOP', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Cibao Norte', provincia: 'Puerto Plata' },
  { nombre: 'Junta de Distrito Municipal Arroyo Cano', siglas: 'JDM-ACAN', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'El Valle', provincia: 'San Juan' },
  { nombre: 'Junta de Distrito Municipal Guaraguao', siglas: 'JDM-GUAR', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Cibao Sur', provincia: 'La Vega' },
  { nombre: 'Junta de Distrito Municipal Villa Fundación', siglas: 'JDM-VFUN', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Cibao Sur', provincia: 'San Cristóbal' },
  { nombre: 'Junta de Distrito Municipal Gonzalo', siglas: 'JDM-GONZ', nivelGobierno: 'Junta de Distrito Municipal', sector: 'Municipal', region: 'Yuma', provincia: 'La Altagracia' },
];

export const TODAS_INSTITUCIONES_FUENTE: InstitucionFuente[] = [
  ...GOBIERNO_CENTRAL,
  ...DESCENTRALIZADAS,
  ...SEGURIDAD_SOCIAL,
  ...EMPRESAS_PUBLICAS_NO_FINANCIERAS,
  ...EMPRESAS_PUBLICAS_FINANCIERAS,
  ...AYUNTAMIENTOS,
  ...MUNICIPIOS_ADICIONALES,
  ...JUNTAS_DISTRITO_MUNICIPAL,
];
