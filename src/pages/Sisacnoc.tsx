import { useState } from 'react';
import { SectionHeader, KpiCard, Badge, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ultimoSisacnoc } from '../data/generator';
import type { Institucion, NivelGobierno } from '../data/types';
import { fmtPct } from '../lib/format';
import clsx from 'clsx';

const NIVELES: NivelGobierno[] = ['Gobierno Central', 'Descentralizada', 'Autónoma', 'Seguridad Social', 'Empresa Pública No Financiera', 'Empresa Pública Financiera', 'Ayuntamiento', 'Junta de Distrito Municipal'];
const DIMENSIONES = ['oportunidad', 'transparencia', 'comparabilidad', 'gestionActivos'] as const;
const DIM_LABEL: Record<typeof DIMENSIONES[number], string> = { oportunidad: 'Oportunidad', transparencia: 'Transparencia', comparabilidad: 'Comparabilidad', gestionActivos: 'Gestión de Activos' };

function colorCelda(v: number) {
  if (v >= 85) return 'bg-emerald-500';
  if (v >= 65) return 'bg-emerald-300';
  if (v >= 45) return 'bg-amber-300';
  return 'bg-red-400';
}

export default function Sisacnoc() {
  const [instA, setInstA] = useState(INSTITUCIONES[0].id);
  const [instB, setInstB] = useState(INSTITUCIONES[1].id);

  const evaluadas = INSTITUCIONES.map((i) => ({ inst: i, sis: ultimoSisacnoc(i.id) })).filter((x) => x.sis);
  const promedioGeneral = evaluadas.reduce((s, x) => s + x.sis!.cumplimientoGeneral, 0) / evaluadas.length;
  const distribucion = ['Óptimo', 'Satisfactorio', 'En proceso', 'Crítico'].map((cat) => ({
    cat, n: evaluadas.filter((x) => x.sis!.categoria === cat).length,
  }));

  const heatmap = NIVELES.map((nivel) => {
    const grupo = evaluadas.filter((x) => x.inst.nivelGobierno === nivel);
    const promDim = (dim: typeof DIMENSIONES[number]) => grupo.length ? grupo.reduce((s, x) => s + x.sis![dim], 0) / grupo.length : 0;
    return { nivel, n: grupo.length, valores: DIMENSIONES.map((d) => promDim(d)) };
  });

  const ranking = [...evaluadas].sort((a, b) => b.sis!.cumplimientoGeneral - a.sis!.cumplimientoGeneral);

  const columnas: ColumnaTabla<{ inst: Institucion; sis: any }>[] = [
    { key: 'nombre', header: 'Institución', accessor: (r) => r.inst.nombre, sortable: true },
    { key: 'nivel', header: 'Nivel', accessor: (r) => r.inst.nivelGobierno },
    { key: 'cump', header: 'Cumplimiento general', accessor: (r) => r.sis.cumplimientoGeneral, sortable: true, align: 'right', render: (r) => <strong>{fmtPct(r.sis.cumplimientoGeneral)}</strong> },
    { key: 'cat', header: 'Categoría', accessor: (r) => r.sis.categoria, render: (r) => <Badge tono={r.sis.categoria === 'Óptimo' || r.sis.categoria === 'Satisfactorio' ? 'exito' : r.sis.categoria === 'En proceso' ? 'alerta' : 'peligro'}>{r.sis.categoria}</Badge> },
  ];

  const A = INSTITUCIONES.find((i) => i.id === instA)!, sisA = ultimoSisacnoc(instA);
  const B = INSTITUCIONES.find((i) => i.id === instB)!, sisB = ultimoSisacnoc(instB);

  return (
    <div className="space-y-4">
      <SectionHeader titulo="SISACNOC 360°" subtitulo="Sistema de Análisis del Cumplimiento de las Normativas Contables — rediseño de la experiencia de evaluación del Sector Público No Financiero." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Cumplimiento general" valor={fmtPct(promedioGeneral)} subtitulo={`${evaluadas.length} instituciones evaluadas`} />
        {distribucion.map((d) => (
          <KpiCard key={d.cat} titulo={d.cat} valor={String(d.n)} subtitulo={fmtPct((d.n / evaluadas.length) * 100)} />
        ))}
      </div>

      <div className="card p-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">Mapa de calor — Cumplimiento por nivel de gobierno y componente</h3><DemoTag /></div>
        <table className="w-full text-xs min-w-[560px]">
          <thead><tr><th className="text-left py-1 pr-2">Nivel de gobierno</th>{DIMENSIONES.map((d) => <th key={d} className="px-1 py-1 text-center">{DIM_LABEL[d]}</th>)}<th className="text-center">N</th></tr></thead>
          <tbody>
            {heatmap.map((h) => (
              <tr key={h.nivel} className="border-t border-[var(--border-subtle)]">
                <td className="py-1.5 pr-2 font-medium">{h.nivel}</td>
                {h.valores.map((v, i) => (
                  <td key={i} className="px-1 py-1"><div className={clsx('h-8 rounded-md flex items-center justify-center text-white font-semibold', colorCelda(v))}>{v ? v.toFixed(0) : '—'}</div></td>
                ))}
                <td className="text-center text-[var(--text-muted)]">{h.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Comparar institución A vs. institución B</h3>
          <div className="flex gap-2 mb-3">
            <select value={instA} onChange={(e) => setInstA(e.target.value)} className="flex-1 rounded-lg border border-[var(--border-subtle)] px-2 py-1.5 text-xs">
              {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
            <select value={instB} onChange={(e) => setInstB(e.target.value)} className="flex-1 rounded-lg border border-[var(--border-subtle)] px-2 py-1.5 text-xs">
              {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
            </select>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--text-muted)]"><th className="text-left">Dimensión</th><th className="text-right">{A.siglas}</th><th className="text-right">{B.siglas}</th></tr></thead>
            <tbody>
              {DIMENSIONES.map((d) => (
                <tr key={d} className="border-t border-[var(--border-subtle)]">
                  <td className="py-1.5">{DIM_LABEL[d]}</td>
                  <td className="text-right font-medium">{sisA ? fmtPct(sisA[d]) : '—'}</td>
                  <td className="text-right font-medium">{sisB ? fmtPct(sisB[d]) : '—'}</td>
                </tr>
              ))}
              <tr className="border-t border-[var(--border-subtle)] font-bold"><td className="py-1.5">General</td><td className="text-right">{sisA ? fmtPct(sisA.cumplimientoGeneral) : '—'}</td><td className="text-right">{sisB ? fmtPct(sisB.cumplimientoGeneral) : '—'}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Ranking nacional de cumplimiento</h3></div>
          <DataTable columnas={columnas} filas={ranking} keyExtractor={(r) => r.inst.id} filasPorPagina={7} />
        </div>
      </div>
    </div>
  );
}
