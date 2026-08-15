import { useMemo, useState } from 'react';
import { SectionHeader, Badge, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ERIR_REGISTROS, estadosFinancierosDeInstitucion } from '../data/generator';
import { fmtRD } from '../lib/format';
import { Rng } from '../lib/prng';

const ETAPAS = ['Recibido', 'Validado', 'Ajustes', 'Eliminaciones', 'Consolidado', 'Publicado'] as const;
type Etapa = typeof ETAPAS[number];

interface FilaConsol { id: string; nombre: string; siglas: string; etapa: Etapa; diferencia: number }

export default function Consolidacion() {
  const [filtroEtapa, setFiltroEtapa] = useState<Etapa | 'Todas'>('Todas');

  const filas: FilaConsol[] = useMemo(() => INSTITUCIONES.map((i, idx) => {
    const erir = ERIR_REGISTROS.find((e) => e.institucionId === i.id && e.anio === 2025);
    const r = new Rng(`consol-${i.id}`);
    const mapEtapa: Record<string, Etapa> = { Pendiente: 'Recibido', Recibido: 'Validado', Validado: 'Ajustes', Integrado: 'Eliminaciones', Consolidado: 'Consolidado', Publicado: 'Publicado' };
    return { id: i.id, nombre: i.nombre, siglas: i.siglas, etapa: mapEtapa[erir?.estado ?? 'Pendiente'], diferencia: r.float(0, 4_200_000) * (idx % 5 === 0 ? 3 : 1) };
  }), []);

  const conteos = ETAPAS.map((e) => ({ etapa: e, n: filas.filter((f) => f.etapa === e).length }));
  const filtradas = filtroEtapa === 'Todas' ? filas : filas.filter((f) => f.etapa === filtroEtapa);

  const totalActivosConsolidados = useMemo(() => INSTITUCIONES.reduce((sum, i) => {
    const efs = estadosFinancierosDeInstitucion(i.id);
    const u = efs[efs.length - 1];
    return sum + u.activoCorriente + u.activoNoCorriente;
  }, 0), []);

  const diferenciasCriticas = filas.filter((f) => f.diferencia > 3_000_000).sort((a, b) => b.diferencia - a.diferencia).slice(0, 6);

  const columnas: ColumnaTabla<FilaConsol>[] = [
    { key: 'nombre', header: 'Institución', accessor: (f) => f.nombre, sortable: true },
    { key: 'etapa', header: 'Etapa de consolidación', accessor: (f) => f.etapa, render: (f) => <Badge tono={f.etapa === 'Publicado' ? 'exito' : f.etapa === 'Recibido' ? 'peligro' : 'info'}>{f.etapa}</Badge> },
    { key: 'dif', header: 'Diferencia recíproca detectada', accessor: (f) => f.diferencia, align: 'right', sortable: true, render: (f) => f.diferencia > 500_000 ? <span className="text-red-600 font-medium">{fmtRD(f.diferencia, { compacto: true })}</span> : <span className="text-[var(--text-muted)]">{fmtRD(f.diferencia, { compacto: true })}</span> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Consolidación Contable" subtitulo="Pipeline de consolidación inspirado conceptualmente en CONSOL+: datos recibidos → validaciones → ajustes → eliminaciones → consolidación → publicación." esDemo />

      <div className="card p-4">
        <div className="flex items-center overflow-x-auto gap-1">
          {conteos.map((c, i) => (
            <div key={c.etapa} className="flex items-center gap-1 flex-1 min-w-[110px]">
              <button onClick={() => setFiltroEtapa(filtroEtapa === c.etapa ? 'Todas' : c.etapa)} className={`w-full rounded-xl border p-3 text-center transition-colors ${filtroEtapa === c.etapa ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]' : 'border-[var(--border-subtle)] hover:border-[var(--color-brand-300)]'}`}>
                <div className="text-xl font-bold text-[var(--color-brand-700)]">{c.n}</div>
                <div className="text-[11px] text-[var(--text-secondary)]">{c.etapa}</div>
              </button>
              {i < conteos.length - 1 && <span className="text-[var(--text-muted)] hidden md:block">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Instituciones en proceso de consolidación {filtroEtapa !== 'Todas' && `— ${filtroEtapa}`}</h3>
            <DemoTag />
          </div>
          <DataTable columnas={columnas} filas={filtradas} keyExtractor={(f) => f.id} filasPorPagina={9} />
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-1">Activo total consolidado (muestra)</h3>
            <div className="text-2xl font-bold text-[var(--color-brand-700)]">{fmtRD(totalActivosConsolidados, { compacto: true })}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{INSTITUCIONES.length} instituciones incluidas en el corte vigente</div>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Diferencias interinstitucionales críticas</h3>
            <div className="space-y-1.5 text-xs">
              {diferenciasCriticas.map((d) => (
                <div key={d.id} className="flex justify-between"><span>{d.siglas || d.nombre.slice(0, 22)}</span><span className="font-medium text-red-600">{fmtRD(d.diferencia, { compacto: true })}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
