import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SectionHeader, KpiCard, Badge } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, CALIDAD_DATOS, calidadActualDe } from '../data/generator';
import type { Institucion } from '../data/types';
import { fmtPct } from '../lib/format';

const DIMENSIONES = ['completitud', 'consistencia', 'oportunidad', 'exactitud', 'duplicidad', 'integridad'] as const;
const LABEL: Record<string, string> = { completitud: 'Completitud', consistencia: 'Consistencia', oportunidad: 'Oportunidad', exactitud: 'Exactitud', duplicidad: 'No-duplicidad', integridad: 'Integridad' };

export default function CalidadDato() {
  const navigate = useNavigate();
  const promedios = DIMENSIONES.map((d) => ({
    dim: LABEL[d], v: CALIDAD_DATOS.reduce((s, c) => s + c[d], 0) / CALIDAD_DATOS.length,
  }));

  const conProblemas = useMemo(() => INSTITUCIONES
    .map((i) => ({ inst: i, cal: calidadActualDe(i.id) }))
    .filter((x) => x.cal && x.cal.indiceGeneral < 55)
    .sort((a, b) => a.cal!.indiceGeneral - b.cal!.indiceGeneral), []);

  const indiceGeneral = CALIDAD_DATOS.reduce((s, c) => s + c.indiceGeneral, 0) / CALIDAD_DATOS.length;

  const columnas: ColumnaTabla<{ inst: Institucion; cal: any }>[] = [
    { key: 'nombre', header: 'Institución', accessor: (r) => r.inst.nombre, sortable: true },
    { key: 'indice', header: 'Índice general', accessor: (r) => r.cal.indiceGeneral, sortable: true, align: 'right', render: (r) => <strong className="text-red-600">{fmtPct(r.cal.indiceGeneral)}</strong> },
    { key: 'completitud', header: 'Completitud', accessor: (r) => r.cal.completitud, align: 'right', render: (r) => fmtPct(r.cal.completitud) },
    { key: 'consistencia', header: 'Consistencia', accessor: (r) => r.cal.consistencia, align: 'right', render: (r) => fmtPct(r.cal.consistencia) },
    { key: 'exactitud', header: 'Exactitud', accessor: (r) => r.cal.exactitud, align: 'right', render: (r) => fmtPct(r.cal.exactitud) },
  ];

  const hallazgos = [
    { tipo: 'Saldos descuadrados', n: 7 }, { tipo: 'Cuentas fuera de catálogo vigente', n: 4 },
    { tipo: 'Períodos incompletos', n: 11 }, { tipo: 'Registros duplicados', n: 5 }, { tipo: 'Variaciones anómalas sin justificar', n: 9 },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Data Quality Center" subtitulo="Centro de calidad del dato: completitud, consistencia, oportunidad, exactitud, duplicidad e integridad de la información contable reportada." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Índice general de calidad" valor={fmtPct(indiceGeneral)} />
        <KpiCard titulo="Instituciones bajo umbral (&lt;55%)" valor={String(conProblemas.length)} />
        <KpiCard titulo="Hallazgos abiertos" valor={String(hallazgos.reduce((a, h) => a + h.n, 0))} />
        <KpiCard titulo="Cobertura de monitoreo" valor={String(INSTITUCIONES.length)} subtitulo="instituciones evaluadas mensualmente" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Perfil de calidad por dimensión (promedio nacional)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={promedios}>
              <PolarGrid /><PolarAngleAxis dataKey="dim" tick={{ fontSize: 10 }} /><PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar dataKey="v" stroke="var(--color-brand-600)" fill="var(--color-brand-400)" fillOpacity={0.45} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-4 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-3">Tipos de hallazgos detectados</h3>
          <div className="space-y-2.5">
            {hallazgos.map((h) => (
              <div key={h.tipo}>
                <div className="flex justify-between text-xs mb-1"><span>{h.tipo}</span><span className="font-semibold">{h.n} instituciones</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${(h.n / 15) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Instituciones con calidad crítica</h3><Badge tono="peligro">Requiere intervención</Badge></div>
        <DataTable columnas={columnas} filas={conProblemas} keyExtractor={(r) => r.inst.id} onRowClick={(r) => navigate(`/institucion/${r.inst.id}`)} filasPorPagina={8} />
      </div>
    </div>
  );
}
