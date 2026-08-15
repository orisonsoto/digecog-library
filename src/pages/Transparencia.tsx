import { useState } from 'react';
import { SectionHeader, Badge, DemoTag } from '../components/ui/primitives';
import { KPI_ESCALA_NACIONAL } from '../data/generator';
import { fmtRD, fmtNum } from '../lib/format';

const DATASETS_PUBLICOS = [
  { nombre: 'Estados Financieros del Gobierno Central', formato: ['CSV', 'JSON', 'XLSX'] },
  { nombre: 'ERIR — Estado de Recaudación e Inversión de las Rentas', formato: ['PDF', 'CSV'] },
  { nombre: 'Resultados SISACNOC por institución', formato: ['CSV', 'JSON'] },
  { nombre: 'Compendio de estadísticas institucionales', formato: ['XLSX', 'PDF'] },
  { nombre: 'Ratios financieros de empresas públicas', formato: ['CSV'] },
  { nombre: 'Plan de Cuentas Contables vigente', formato: ['PDF'] },
];

export default function Transparencia() {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const toggle = (n: string) => setSeleccionados((prev) => {
    const next = new Set(prev);
    next.has(n) ? next.delete(n) : next.add(n);
    return next;
  });

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Centro de Transparencia y Datos Abiertos" subtitulo="Publicación de estados financieros, estadísticas, indicadores e informes en formato abierto." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="text-2xl font-bold text-[var(--color-brand-700)]">{fmtNum(KPI_ESCALA_NACIONAL.institucionesMonitoreadas)}</div><div className="text-xs text-[var(--text-muted)]">Instituciones monitoreadas</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-[var(--color-brand-700)]">{fmtRD(KPI_ESCALA_NACIONAL.volumenFinancieroAnalizadoRD, { compacto: true })}</div><div className="text-xs text-[var(--text-muted)]">Volumen analizado</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-[var(--color-brand-700)]">{DATASETS_PUBLICOS.length}</div><div className="text-xs text-[var(--text-muted)]">Datasets disponibles</div></div>
        <div className="card p-4"><div className="text-2xl font-bold text-[var(--color-brand-700)]">98.4%</div><div className="text-xs text-[var(--text-muted)]">Validaciones completadas</div></div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">Seleccione datasets para generar vista pública</h3><DemoTag /></div>
        <div className="space-y-2">
          {DATASETS_PUBLICOS.map((d) => (
            <label key={d.nombre} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 cursor-pointer hover:border-[var(--color-brand-300)]">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={seleccionados.has(d.nombre)} onChange={() => toggle(d.nombre)} />
                <span className="text-sm">{d.nombre}</span>
              </div>
              <div className="flex gap-1">
                {d.formato.map((f) => <Badge key={f} tono="neutral">{f}</Badge>)}
              </div>
            </label>
          ))}
        </div>
        <button disabled={seleccionados.size === 0} className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'var(--color-brand-700)' }}>
          Generar vista pública ({seleccionados.size} datasets)
        </button>
      </div>
    </div>
  );
}
