import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from 'recharts';
import { SectionHeader, KpiCard, Badge, DemoTag, RealTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ERIR_REGISTROS, estadosFinancierosDeInstitucion } from '../data/generator';
import type { ErirRegistro, Institucion } from '../data/types';
import { fmtRD, fmtPct } from '../lib/format';

const ETAPAS_LINEA = ['Recepción', 'Validación', 'Integración', 'Consolidación', 'Revisión', 'Publicación'];

export default function Erir() {
  const [anio, setAnio] = useState(2025);
  const registrosAnio = ERIR_REGISTROS.filter((e) => e.anio === anio);
  const publicados = registrosAnio.filter((e) => e.estado === 'Publicado').length;
  const cobertura = (publicados / registrosAnio.length) * 100;

  const evolucionCobertura = useMemo(() => [2022, 2023, 2024, 2025, 2026].map((a) => {
    const regs = ERIR_REGISTROS.filter((e) => e.anio === a);
    const pub = regs.filter((e) => e.estado === 'Publicado').length;
    return { anio: a, cobertura: Math.round((pub / regs.length) * 1000) / 10 };
  }), []);

  const composicion = useMemo(() => {
    return INSTITUCIONES.reduce((acc, i) => {
      const efs = estadosFinancierosDeInstitucion(i.id);
      const u = efs[efs.length - 1];
      acc[i.nivelGobierno] = (acc[i.nivelGobierno] ?? 0) + u.ingresosCorrientes + u.ingresosCapital;
      return acc;
    }, {} as Record<string, number>);
  }, []);
  const dataComposicion = Object.entries(composicion).map(([nivel, valor]) => ({ nivel, valor }));

  const columnas: ColumnaTabla<{ e: ErirRegistro; inst: Institucion }>[] = [
    { key: 'nombre', header: 'Institución', accessor: (r) => r.inst.nombre, sortable: true },
    { key: 'nivel', header: 'Tipo', accessor: (r) => r.inst.nivelGobierno },
    { key: 'estado', header: 'Estado', accessor: (r) => r.e.estado, sortable: true, render: (r) => <Badge tono={r.e.estado === 'Publicado' ? 'exito' : r.e.estado === 'Pendiente' ? 'peligro' : 'info'}>{r.e.estado}</Badge> },
    { key: 'presup', header: 'Cuentas presupuestarias', accessor: (r) => (r.e.cuentasPresupuestariasIntegradas ? 1 : 0), render: (r) => r.e.cuentasPresupuestariasIntegradas ? '✓' : '—' },
    { key: 'patrim', header: 'Cuentas patrimoniales', accessor: (r) => (r.e.cuentasPatrimonialesIntegradas ? 1 : 0), render: (r) => r.e.cuentasPatrimonialesIntegradas ? '✓' : '—' },
  ];
  const filas = registrosAnio.map((e) => ({ e, inst: INSTITUCIONES.find((i) => i.id === e.institucionId)! }));

  return (
    <div className="space-y-4">
      <SectionHeader
        titulo="Estado de Recaudación e Inversión de las Rentas (ERIR)"
        subtitulo='Documento público mediante el cual el gobierno informa a la sociedad sobre la administración de los recursos del tesoro público; compuesto por cuentas presupuestarias y patrimoniales. Se presenta anualmente al Congreso Nacional y la Cámara de Cuentas.'
      />
      <div className="flex justify-end"><RealTag label="ERIR — definición y proceso reales; cifras de cobertura DEMO" /></div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-secondary)]">Año fiscal:</span>
        <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
          {[2022, 2023, 2024, 2025, 2026].map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Instituciones integradas" valor={`${publicados}/${registrosAnio.length}`} subtitulo={fmtPct(cobertura)} />
        <KpiCard titulo="Cuentas presupuestarias" valor={fmtPct((registrosAnio.filter((e) => e.cuentasPresupuestariasIntegradas).length / registrosAnio.length) * 100)} />
        <KpiCard titulo="Cuentas patrimoniales" valor={fmtPct((registrosAnio.filter((e) => e.cuentasPatrimonialesIntegradas).length / registrosAnio.length) * 100)} />
        <KpiCard titulo="Pendientes de recepción" valor={String(registrosAnio.filter((e) => e.estado === 'Pendiente').length)} />
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-3">Línea de tiempo del proceso</h3>
        <div className="flex items-center gap-1 overflow-x-auto">
          {ETAPAS_LINEA.map((et, i) => (
            <div key={et} className="flex items-center gap-1 flex-1 min-w-[100px]">
              <div className="w-full rounded-lg border border-[var(--border-subtle)] p-2.5 text-center bg-slate-50">
                <div className="text-xs font-semibold">{et}</div>
              </div>
              {i < ETAPAS_LINEA.length - 1 && <span className="text-[var(--text-muted)]">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Instituciones — año {anio}</h3><DemoTag /></div>
          <DataTable columnas={columnas} filas={filas} keyExtractor={(r) => r.inst.id} filasPorPagina={8} />
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Evolución de cobertura</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={evolucionCobertura}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
                <XAxis dataKey="anio" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} unit="%" />
                <RTooltip formatter={(v: any) => `${v}%`} />
                <Bar dataKey="cobertura" fill="var(--color-brand-600)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Composición de ingresos por nivel</h3>
            {dataComposicion.map((d) => (
              <div key={d.nivel} className="flex justify-between text-xs py-1 border-b border-[var(--border-subtle)] last:border-0">
                <span>{d.nivel}</span><span className="font-medium">{fmtRD(d.valor, { compacto: true })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
