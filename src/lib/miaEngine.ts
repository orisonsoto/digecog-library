// Mía DIGECOG AI — copiloto conversacional simulado.
// No invoca un modelo de lenguaje real: aplica reglas simples sobre el dataset sintético
// para demostrar el concepto de un asistente que responde en lenguaje natural basado en datos.
import { INSTITUCIONES, estadosFinancierosDeInstitucion, ultimoSisacnoc, ALERTAS, EMPRESAS_ELECTRICAS_ID } from '../data/generator';
import { fmtRD, fmtPct } from './format';

export interface RespuestaMia {
  texto: string;
  esDemo: boolean;
}

function liquidezDe(institucionId: string): number | null {
  const efs = estadosFinancierosDeInstitucion(institucionId);
  const ultimo = efs[efs.length - 1];
  if (!ultimo || ultimo.pasivoCorriente <= 0) return null;
  return ultimo.activoCorriente / ultimo.pasivoCorriente;
}

export function responderMia(pregunta: string): RespuestaMia {
  const q = pregunta.toLowerCase();

  if (q.includes('liquidez') || q.includes('deterioro')) {
    const conLiquidez = INSTITUCIONES
      .map((i) => ({ i, liq: liquidezDe(i.id) }))
      .filter((x): x is { i: typeof x.i; liq: number } => x.liq !== null)
      .sort((a, b) => a.liq - b.liq)
      .slice(0, 5);
    const lista = conLiquidez.map((x, idx) => `${idx + 1}. ${x.i.nombre} (${x.i.siglas}) — razón corriente ${x.liq.toFixed(2)}`).join('\n');
    return { texto: `Las instituciones con mayor deterioro relativo en liquidez (razón corriente más baja) en el período vigente son:\n\n${lista}\n\nSe recomienda priorizar asistencia técnica y seguimiento de flujo de caja en estas entidades.`, esDemo: true };
  }

  if (q.includes('eléctric') || q.includes('electric') || (q.includes('compar') && (q.includes('empresa') || q.includes('edenorte') || q.includes('edesur') || q.includes('edeeste')))) {
    const empresas = INSTITUCIONES.filter((i) => EMPRESAS_ELECTRICAS_ID.includes(i.id));
    const filas = empresas.map((e) => {
      const efs = estadosFinancierosDeInstitucion(e.id);
      const u = efs[efs.length - 1];
      const activos = u.activoCorriente + u.activoNoCorriente;
      const pasivos = u.pasivoCorriente + u.pasivoNoCorriente;
      return `• ${e.siglas}: Activos ${fmtRD(activos, { compacto: true })} · Pasivos ${fmtRD(pasivos, { compacto: true })} · Endeudamiento ${fmtPct((pasivos / activos) * 100)}`;
    }).join('\n');
    return { texto: `Comparación de empresas públicas eléctricas (datos sintéticos):\n\n${filas}\n\nAbra el módulo "Empresas Públicas" para el comparativo visual completo con ratios de liquidez y rentabilidad.`, esDemo: true };
  }

  if (q.includes('resumen ejecutivo') || q.includes('resumen') || q.includes('cierre')) {
    const conSCG = INSTITUCIONES.filter((i) => i.scgImplementado).length;
    const criticas = INSTITUCIONES.filter((i) => ultimoSisacnoc(i.id)?.categoria === 'Crítico').length;
    return {
      texto: `Resumen ejecutivo (DEMO):\n\n• ${INSTITUCIONES.length} instituciones en la muestra navegable del prototipo.\n• ${conSCG} con Sistema de Contabilidad Gubernamental implementado (${fmtPct((conSCG / INSTITUCIONES.length) * 100)}).\n• ${criticas} instituciones en categoría "Crítico" de SISACNOC — requieren intervención prioritaria.\n• ${ALERTAS.filter((a) => a.severidad === 'Crítica').length} alertas críticas activas en el sistema.\n\nPara el detalle completo, consulte el Centro de Mando Ejecutivo.`,
      esDemo: true,
    };
  }

  if (q.includes('hallazgo') && q.includes('sisacnoc')) {
    const criticas = INSTITUCIONES.filter((i) => ultimoSisacnoc(i.id)?.categoria === 'Crítico').slice(0, 5);
    const lista = criticas.map((i) => `• ${i.nombre}`).join('\n') || 'No se identificaron instituciones en categoría Crítico en el corte vigente.';
    return { texto: `Principales hallazgos SISACNOC (DEMO):\n\nInstituciones en categoría Crítico:\n${lista}\n\nConsulte el módulo SISACNOC 360° para el mapa de calor completo por nivel de gobierno.`, esDemo: true };
  }

  if (q.includes('nicsp')) {
    return { texto: 'Las cuentas del Plan de Cuentas Contables 2.0 se fundamentan en las Normas Internacionales de Contabilidad del Sector Público (NICSP), versión 2021 (IPSASB/IFAC). Por ejemplo, la NICSP 1 rige la presentación de Estados Financieros y la NICSP 35 la consolidación. Abra "Normativas" y seleccione una cuenta para ver su relación normativa.', esDemo: false };
  }

  return {
    texto: 'Puedo ayudarle a analizar instituciones, comparar empresas públicas, resumir el cierre fiscal o explicar normativas contables. Pruebe: "¿Cuáles instituciones presentan mayor deterioro en liquidez?" o "Compara las empresas públicas eléctricas".',
    esDemo: true,
  };
}

export const PREGUNTAS_SUGERIDAS = [
  '¿Cuáles instituciones presentan mayor deterioro en liquidez?',
  'Compara las empresas públicas eléctricas',
  'Genera un resumen ejecutivo del cierre',
  'Muéstrame los principales hallazgos SISACNOC',
  '¿Qué NICSP se relacionan con esta cuenta?',
];
