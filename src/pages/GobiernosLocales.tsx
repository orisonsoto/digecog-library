import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, KpiCard, Badge } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ultimoSisacnoc, calidadActualDe } from '../data/generator';
import type { Institucion, Region } from '../data/types';
import { fmtPct } from '../lib/format';

export default function GobiernosLocales() {
  const navigate = useNavigate();
  const municipales = useMemo(() => INSTITUCIONES.filter((i) => i.nivelGobierno === 'Ayuntamiento' || i.nivelGobierno === 'Junta de Distrito Municipal'), []);
  const [region, setRegion] = useState<Region | 'Todas'>('Todas');
  const [provincia, setProvincia] = useState<string | 'Todas'>('Todas');

  const regiones = Array.from(new Set(municipales.map((m) => m.region)));
  const provincias = Array.from(new Set(municipales.filter((m) => region === 'Todas' || m.region === region).map((m) => m.provincia)));

  const filtrados = municipales.filter((m) => (region === 'Todas' || m.region === region) && (provincia === 'Todas' || m.provincia === provincia));

  const conScg = municipales.filter((m) => m.scgImplementado).length;
  const cumplimientoProm = useMemo(() => {
    const arr = municipales.map((m) => ultimoSisacnoc(m.id)?.cumplimientoGeneral).filter((v): v is number => v !== undefined);
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }, [municipales]);

  const porRegion = regiones.map((r) => {
    const grupo = municipales.filter((m) => m.region === r);
    const conScgR = grupo.filter((m) => m.scgImplementado).length;
    return { region: r, n: grupo.length, pctScg: (conScgR / grupo.length) * 100 };
  });

  const columnas: ColumnaTabla<Institucion>[] = [
    { key: 'nombre', header: 'Municipalidad', accessor: (i) => i.nombre, sortable: true },
    { key: 'tipo', header: 'Tipo', accessor: (i) => i.nivelGobierno },
    { key: 'provincia', header: 'Provincia', accessor: (i) => i.provincia, sortable: true },
    { key: 'scg', header: 'SCG', accessor: (i) => (i.scgImplementado ? 1 : 0), render: (i) => <Badge tono={i.scgImplementado ? 'exito' : 'alerta'}>{i.scgImplementado ? 'Implementado' : 'Pendiente'}</Badge> },
    { key: 'sisacnoc', header: 'SISACNOC', accessor: (i) => ultimoSisacnoc(i.id)?.cumplimientoGeneral ?? -1, sortable: true, align: 'right', render: (i) => { const v = ultimoSisacnoc(i.id)?.cumplimientoGeneral; return v ? fmtPct(v) : '—'; } },
    { key: 'calidad', header: 'Calidad', accessor: (i) => calidadActualDe(i.id)?.indiceGeneral ?? -1, align: 'right', render: (i) => { const v = calidadActualDe(i.id)?.indiceGeneral; return v ? fmtPct(v) : '—'; } },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Gobiernos Locales" subtitulo="Dashboard territorial: Región → Provincia → Municipio. Ayuntamientos y Juntas de Distrito Municipal reales de la República Dominicana." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Municipalidades" valor={String(municipales.length)} subtitulo="Ayuntamientos + Juntas de Distrito" />
        <KpiCard titulo="Con SCG implementado" valor={fmtPct((conScg / municipales.length) * 100)} />
        <KpiCard titulo="Cumplimiento SISACNOC promedio" valor={fmtPct(cumplimientoProm)} />
        <KpiCard titulo="Regiones cubiertas" valor={String(regiones.length)} esDemo={false} />
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Implementación del SCG por región</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {porRegion.map((r) => (
            <button key={r.region} onClick={() => { setRegion(r.region); setProvincia('Todas'); }} className={`rounded-lg border p-2.5 text-left transition-colors ${region === r.region ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]' : 'border-[var(--border-subtle)] hover:border-[var(--color-brand-300)]'}`}>
              <div className="text-[11px] font-semibold truncate">{r.region}</div>
              <div className="text-lg font-bold text-[var(--color-brand-700)]">{r.pctScg.toFixed(0)}%</div>
              <div className="text-[10px] text-[var(--text-muted)]">{r.n} municipios</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={region} onChange={(e) => { setRegion(e.target.value as Region | 'Todas'); setProvincia('Todas'); }} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
          <option value="Todas">Todas las regiones</option>
          {regiones.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={provincia} onChange={(e) => setProvincia(e.target.value)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
          <option value="Todas">Todas las provincias</option>
          {provincias.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <span className="text-xs text-[var(--text-muted)]">{filtrados.length} resultados</span>
      </div>

      <div className="card p-4">
        <DataTable columnas={columnas} filas={filtrados} keyExtractor={(i) => i.id} onRowClick={(i) => navigate(`/institucion/${i.id}`)} filasPorPagina={12} />
      </div>
    </div>
  );
}
