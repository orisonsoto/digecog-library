import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, KpiCard, Badge, DemoTag, Toggle2 } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { ALERTAS, INSTITUCIONES_POR_ID } from '../data/generator';
import type { Alerta } from '../data/types';

export default function CentroAlertas() {
  const navigate = useNavigate();
  const [severidad, setSeveridad] = useState<'todas' | Alerta['severidad']>('todas');
  const [soloSinAtender, setSoloSinAtender] = useState(false);

  const filtradas = useMemo(() => ALERTAS.filter((a) =>
    (severidad === 'todas' || a.severidad === severidad) && (!soloSinAtender || !a.atendida)
  ), [severidad, soloSinAtender]);

  const columnas: ColumnaTabla<Alerta>[] = [
    { key: 'sev', header: 'Severidad', accessor: (a) => a.severidad, sortable: true, render: (a) => <Badge tono={a.severidad === 'Crítica' ? 'peligro' : a.severidad === 'Alta' ? 'alerta' : a.severidad === 'Media' ? 'info' : 'neutral'}>{a.severidad}</Badge> },
    { key: 'modulo', header: 'Módulo', accessor: (a) => a.modulo, sortable: true },
    { key: 'inst', header: 'Institución', accessor: (a) => (a.institucionId ? INSTITUCIONES_POR_ID.get(a.institucionId)?.nombre ?? '' : '—'), render: (a) => a.institucionId ? (
      <button onClick={() => navigate(`/institucion/${a.institucionId}`)} className="text-[var(--color-brand-600)] hover:underline text-left">{INSTITUCIONES_POR_ID.get(a.institucionId)?.siglas}</button>
    ) : '—' },
    { key: 'mensaje', header: 'Mensaje', accessor: (a) => a.mensaje, render: (a) => <span className="text-xs">{a.mensaje}</span> },
    { key: 'fecha', header: 'Fecha', accessor: (a) => a.fecha, sortable: true },
    { key: 'estado', header: 'Estado', accessor: (a) => (a.atendida ? 1 : 0), render: (a) => <Badge tono={a.atendida ? 'exito' : 'peligro'}>{a.atendida ? 'Atendida' : 'Pendiente'}</Badge> },
  ];

  const conteos = (['Crítica', 'Alta', 'Media', 'Informativa'] as const).map((s) => ({ s, n: ALERTAS.filter((a) => a.severidad === s).length }));

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Centro de Alertas" subtitulo="Alertas generadas automáticamente a partir de señales de SISACNOC, calidad del dato, ERIR y variaciones financieras anómalas." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {conteos.map((c) => (
          <KpiCard key={c.s} titulo={c.s} valor={String(c.n)} subtitulo={`${ALERTAS.filter((a) => a.severidad === c.s && !a.atendida).length} sin atender`} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Toggle2 value={severidad} onChange={setSeveridad} options={[
          { value: 'todas', label: 'Todas' }, { value: 'Crítica', label: 'Crítica' }, { value: 'Alta', label: 'Alta' }, { value: 'Media', label: 'Media' }, { value: 'Informativa', label: 'Informativa' },
        ]} />
        <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <input type="checkbox" checked={soloSinAtender} onChange={(e) => setSoloSinAtender(e.target.checked)} /> Solo sin atender
        </label>
        <span className="text-xs text-[var(--text-muted)] ml-auto">{filtradas.length} alertas</span>
      </div>

      <div className="card p-4">
        <DataTable columnas={columnas} filas={filtradas} keyExtractor={(a) => a.id} filasPorPagina={14} />
      </div>
      <div className="flex justify-end"><DemoTag /></div>
    </div>
  );
}
