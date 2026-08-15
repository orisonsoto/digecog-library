import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, Badge, Semaforo, Toggle2 } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ultimoSisacnoc, calidadActualDe, ERIR_REGISTROS } from '../data/generator';
import type { Institucion, NivelGobierno } from '../data/types';
import { fmtPct } from '../lib/format';

interface Fila {
  inst: Institucion;
  sisacnocPct: number | null;
  categoria: string;
  calidad: number | null;
  erirEstado: string;
}

const NIVELES: (NivelGobierno | 'Todos')[] = ['Todos', 'Gobierno Central', 'Descentralizada', 'Autónoma', 'Seguridad Social', 'Empresa Pública No Financiera', 'Empresa Pública Financiera', 'Ayuntamiento', 'Junta de Distrito Municipal'];

export default function MonitorNacional() {
  const navigate = useNavigate();
  const [filtroNivel, setFiltroNivel] = useState<NivelGobierno | 'Todos'>('Todos');
  const [filtroScg, setFiltroScg] = useState<'todos' | 'si' | 'no'>('todos');

  const filas: Fila[] = useMemo(() => INSTITUCIONES.map((inst) => {
    const sis = ultimoSisacnoc(inst.id);
    const cal = calidadActualDe(inst.id);
    const erir = ERIR_REGISTROS.find((e) => e.institucionId === inst.id && e.anio === 2026);
    return { inst, sisacnocPct: sis?.cumplimientoGeneral ?? null, categoria: sis?.categoria ?? 'Sin evaluar', calidad: cal?.indiceGeneral ?? null, erirEstado: erir?.estado ?? 'Pendiente' };
  }).filter((f) => (filtroNivel === 'Todos' || f.inst.nivelGobierno === filtroNivel) && (filtroScg === 'todos' || (filtroScg === 'si') === f.inst.scgImplementado)), [filtroNivel, filtroScg]);

  const columnas: ColumnaTabla<Fila>[] = [
    { key: 'nombre', header: 'Institución', accessor: (f) => f.inst.nombre, sortable: true, render: (f) => (
      <div><div className="font-medium">{f.inst.nombre}</div><div className="text-[11px] text-[var(--text-muted)]">{f.inst.siglas} · {f.inst.provincia}</div></div>
    ) },
    { key: 'nivel', header: 'Tipo', accessor: (f) => f.inst.nivelGobierno, sortable: true, render: (f) => <span className="text-xs">{f.inst.nivelGobierno}</span> },
    { key: 'scg', header: 'Estado SCG', accessor: (f) => (f.inst.scgImplementado ? 1 : 0), sortable: true, render: (f) => (
      <Badge tono={f.inst.scgImplementado ? 'exito' : 'alerta'}>{f.inst.scgImplementado ? 'Implementado' : 'Pendiente'}</Badge>
    ) },
    { key: 'sisacnoc', header: 'SISACNOC', accessor: (f) => f.sisacnocPct ?? -1, sortable: true, render: (f) => f.sisacnocPct === null ? <span className="text-xs text-[var(--text-muted)]">—</span> : (
      <div className="flex items-center gap-1.5"><Semaforo nivel={f.categoria === 'Óptimo' || f.categoria === 'Satisfactorio' ? 'Verde' : f.categoria === 'En proceso' ? 'Amarillo' : 'Rojo'} /><span className="text-xs font-medium">{fmtPct(f.sisacnocPct)}</span></div>
    ) },
    { key: 'calidad', header: 'Calidad de dato', accessor: (f) => f.calidad ?? -1, sortable: true, render: (f) => f.calidad === null ? '—' : <span className="text-xs">{fmtPct(f.calidad)}</span> },
    { key: 'erir', header: 'ERIR 2026', accessor: (f) => f.erirEstado, sortable: true, render: (f) => <Badge tono={f.erirEstado === 'Publicado' || f.erirEstado === 'Consolidado' ? 'exito' : f.erirEstado === 'Pendiente' ? 'peligro' : 'info'}>{f.erirEstado}</Badge> },
    { key: 'region', header: 'Región', accessor: (f) => f.inst.region, sortable: true, render: (f) => <span className="text-xs">{f.inst.region}</span> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Monitor Nacional de Instituciones" subtitulo="Vista tipo Control Tower del universo institucional del Sector Público No Financiero. Seleccione una institución para abrir su Ficha 360°." esDemo />
      <div className="flex flex-wrap items-center gap-3">
        <select value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value as any)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm outline-none">
          {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <Toggle2 value={filtroScg} onChange={setFiltroScg} options={[{ value: 'todos', label: 'Todas' }, { value: 'si', label: 'Con SCG' }, { value: 'no', label: 'Sin SCG' }]} />
        <span className="text-xs text-[var(--text-muted)] ml-auto">{filas.length} instituciones</span>
      </div>
      <div className="card p-4">
        <DataTable
          columnas={columnas}
          filas={filas}
          keyExtractor={(f) => f.inst.id}
          onRowClick={(f) => navigate(`/institucion/${f.inst.id}`)}
          buscarPlaceholder="Buscar institución, siglas, provincia..."
          filasPorPagina={15}
        />
      </div>
    </div>
  );
}
