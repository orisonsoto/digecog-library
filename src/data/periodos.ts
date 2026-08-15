import type { Periodo } from './types';

export const ANIO_INICIO = 2022;
export const ANIO_ACTUAL = 2026;
export const MES_CORTE_ACTUAL = 7; // Julio 2026 (fecha_corte del contexto maestro: 10/08/2026)

export const PERIODOS: Periodo[] = (() => {
  const out: Periodo[] = [];
  for (let anio = ANIO_INICIO; anio <= ANIO_ACTUAL; anio++) {
    const mesMax = anio === ANIO_ACTUAL ? MES_CORTE_ACTUAL : 12;
    for (let mes = 1; mes <= mesMax; mes++) {
      out.push({
        anio,
        mes,
        trimestre: (Math.floor((mes - 1) / 3) + 1) as 1 | 2 | 3 | 4,
        fechaCorte: `${anio}-${String(mes).padStart(2, '0')}-${new Date(anio, mes, 0).getDate()}`,
        esCierreAnual: mes === 12,
        key: `${anio}-${String(mes).padStart(2, '0')}`,
      });
    }
  }
  return out;
})();

export const PERIODO_ACTUAL = PERIODOS[PERIODOS.length - 1];

export function periodosDelAnio(anio: number): Periodo[] {
  return PERIODOS.filter((p) => p.anio === anio);
}

export const ANIOS_DISPONIBLES = Array.from(new Set(PERIODOS.map((p) => p.anio)));

export const MESES_NOMBRE = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];
