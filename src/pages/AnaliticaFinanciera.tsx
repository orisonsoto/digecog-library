import { useMemo, useState } from 'react';
import { ResponsiveContainer, Treemap, Tooltip as RTooltip, Cell } from 'recharts';
import { SectionHeader, KpiCard, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, estadosFinancierosDeInstitucion } from '../data/generator';
import { fmtRD, fmtPct } from '../lib/format';

interface Anomalia { id: string; nombre: string; siglas: string; variacion: number; rubro: string }

const COLORES_SECTOR = ['#0f3d73', '#1968b3', '#2382cf', '#4ea3e0', '#8cc4ec', '#0ea5a0', '#d68910', '#c0392b', '#1e8f5f', '#8cc4ec'];

export default function AnaliticaFinanciera() {
  const [institucionId, setInstitucionId] = useState(INSTITUCIONES[0].id);
  const efs = estadosFinancierosDeInstitucion(institucionId);
  const ultimo = efs[efs.length - 1];
  const anterior = efs[efs.length - 2];

  const activoTotal = ultimo.activoCorriente + ultimo.activoNoCorriente;
  const pasivoTotal = ultimo.pasivoCorriente + ultimo.pasivoNoCorriente;
  const liquidezCorriente = ultimo.pasivoCorriente > 0 ? ultimo.activoCorriente / ultimo.pasivoCorriente : 0;
  const endeudamiento = (pasivoTotal / activoTotal) * 100;
  const margenOperativo = (ultimo.resultadoEjercicio / (ultimo.ingresosCorrientes + ultimo.ingresosCapital)) * 100;
  const roa = (ultimo.resultadoEjercicio / activoTotal) * 100;

  const analisisVertical = [
    { rubro: 'Activo corriente', valor: ultimo.activoCorriente, pct: (ultimo.activoCorriente / activoTotal) * 100 },
    { rubro: 'Activo no corriente', valor: ultimo.activoNoCorriente, pct: (ultimo.activoNoCorriente / activoTotal) * 100 },
    { rubro: 'Pasivo corriente', valor: ultimo.pasivoCorriente, pct: (ultimo.pasivoCorriente / activoTotal) * 100 },
    { rubro: 'Pasivo no corriente', valor: ultimo.pasivoNoCorriente, pct: (ultimo.pasivoNoCorriente / activoTotal) * 100 },
    { rubro: 'Patrimonio', valor: ultimo.patrimonio, pct: (ultimo.patrimonio / activoTotal) * 100 },
  ];

  const treemapData = useMemo(() => {
    const porSector = new Map<string, number>();
    for (const i of INSTITUCIONES) {
      const arr = estadosFinancierosDeInstitucion(i.id);
      const u = arr[arr.length - 1];
      porSector.set(i.sector, (porSector.get(i.sector) ?? 0) + u.activoCorriente + u.activoNoCorriente);
    }
    return Array.from(porSector.entries()).map(([name, size]) => ({ name, size }));
  }, []);

  const anomalias: Anomalia[] = useMemo(() => {
    const out: Anomalia[] = [];
    for (const i of INSTITUCIONES) {
      const arr = estadosFinancierosDeInstitucion(i.id);
      if (arr.length < 2) continue;
      const u = arr[arr.length - 1], a = arr[arr.length - 2];
      const varGasto = a.gastosFuncionamiento > 0 ? ((u.gastosFuncionamiento - a.gastosFuncionamiento) / a.gastosFuncionamiento) * 100 : 0;
      if (Math.abs(varGasto) > 25) out.push({ id: i.id, nombre: i.nombre, siglas: i.siglas, variacion: varGasto, rubro: 'Gastos de funcionamiento' });
    }
    return out.sort((a, b) => Math.abs(b.variacion) - Math.abs(a.variacion)).slice(0, 12);
  }, []);

  const columnasAnomalias: ColumnaTabla<Anomalia>[] = [
    { key: 'nombre', header: 'Institución', accessor: (a) => a.nombre, sortable: true },
    { key: 'rubro', header: 'Rubro', accessor: (a) => a.rubro },
    { key: 'var', header: 'Variación interanual', accessor: (a) => a.variacion, sortable: true, align: 'right', render: (a) => (
      <span className={a.variacion > 0 ? 'text-red-600 font-semibold' : 'text-amber-600 font-semibold'}>{a.variacion > 0 ? '▲' : '▼'} {Math.abs(a.variacion).toFixed(1)}%</span>
    ) },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Analítica Financiera" subtitulo="Análisis horizontal, vertical, ratios, composición sectorial y detección de anomalías sobre el mismo dato contable." esDemo />

      <div className="flex items-center gap-3">
        <select value={institucionId} onChange={(e) => setInstitucionId(e.target.value)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
          {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Liquidez corriente" valor={liquidezCorriente.toFixed(2)} subtitulo="Activo corriente / Pasivo corriente" />
        <KpiCard titulo="Endeudamiento" valor={fmtPct(endeudamiento)} subtitulo="Pasivo total / Activo total" />
        <KpiCard titulo="Margen operativo" valor={fmtPct(margenOperativo)} subtitulo="Resultado / Ingresos" />
        <KpiCard titulo="ROA (aprox.)" valor={fmtPct(roa)} subtitulo="Resultado / Activo total" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Análisis vertical (% del activo total)</h3>
          <table className="w-full text-sm">
            <tbody>
              {analisisVertical.map((r) => (
                <tr key={r.rubro} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="py-1.5">{r.rubro}</td>
                  <td className="text-right">{fmtRD(r.valor, { compacto: true })}</td>
                  <td className="text-right w-24 font-medium">{fmtPct(r.pct)}</td>
                  <td className="w-24 pl-2">
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-[var(--color-brand-500)]" style={{ width: `${Math.min(100, Math.abs(r.pct))}%` }} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {anterior && (
            <div className="mt-3 text-xs text-[var(--text-secondary)]">
              Análisis horizontal: Activo total varió {(((activoTotal) - (anterior.activoCorriente + anterior.activoNoCorriente)) / (anterior.activoCorriente + anterior.activoNoCorriente) * 100).toFixed(1)}% respecto del período anterior.
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Composición de activos por sector (Treemap)</h3><DemoTag /></div>
          <ResponsiveContainer width="100%" height={260}>
            <Treemap data={treemapData} dataKey="size" stroke="#fff" fill="var(--color-brand-500)" aspectRatio={4 / 3}>
              {treemapData.map((_, i) => <Cell key={i} fill={COLORES_SECTOR[i % COLORES_SECTOR.length]} />)}
              <RTooltip formatter={(v: any) => fmtRD(v as number, { compacto: true })} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">🧠 Detección de anomalías (IA simulada)</h3>
          <DemoTag />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-2">Instituciones cuyos gastos de funcionamiento variaron más de 25% respecto del período anterior — señal de posible desviación operativa o reclasificación contable.</p>
        <DataTable columnas={columnasAnomalias} filas={anomalias} keyExtractor={(a) => a.id} filasPorPagina={8} vacio="Sin anomalías detectadas en el corte vigente." />
      </div>
    </div>
  );
}
