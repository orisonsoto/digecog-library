import { useState } from 'react';
import { SectionHeader, KpiCard, Badge, Semaforo, DemoTag, Toggle2 } from '../components/ui/primitives';
import { PROYECTOS } from '../data/generator';
import { fmtRD, fmtPct } from '../lib/format';

const ESTADOS = ['Formulación', 'En ejecución', 'En riesgo', 'Cerrado', 'Suspendido'] as const;

export default function Proyectos() {
  const [vista, setVista] = useState<'portafolio' | 'kanban'>('portafolio');
  const presupuestoTotal = PROYECTOS.reduce((s, p) => s + p.presupuesto, 0);
  const ejecutadoTotal = PROYECTOS.reduce((s, p) => s + p.ejecutado, 0);
  const enRiesgo = PROYECTOS.filter((p) => p.semaforo === 'Rojo').length;

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Portfolio Management Center" subtitulo="Cartera de proyectos institucionales alineados al PEI 2025-2028." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Proyectos activos" valor={String(PROYECTOS.filter((p) => p.estado === 'En ejecución' || p.estado === 'En riesgo').length)} />
        <KpiCard titulo="Presupuesto total" valor={fmtRD(presupuestoTotal, { compacto: true })} />
        <KpiCard titulo="Ejecutado" valor={fmtRD(ejecutadoTotal, { compacto: true })} subtitulo={fmtPct((ejecutadoTotal / presupuestoTotal) * 100)} />
        <KpiCard titulo="En riesgo" valor={String(enRiesgo)} />
      </div>

      <Toggle2 value={vista} onChange={setVista} options={[{ value: 'portafolio', label: 'Portafolio' }, { value: 'kanban', label: 'Kanban' }]} />

      {vista === 'portafolio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROYECTOS.map((p) => (
            <div key={p.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge tono="info">Eje {p.ejeEstrategico}</Badge>
                  <h3 className="font-semibold text-sm mt-1">{p.nombre}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{p.responsable}</p>
                </div>
                <Semaforo nivel={p.semaforo} />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">{p.descripcion}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1"><span>Avance</span><span className="font-semibold">{p.avance}%</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${p.avance}%`, background: p.semaforo === 'Verde' ? 'var(--color-accent-green)' : p.semaforo === 'Amarillo' ? 'var(--color-accent-amber)' : 'var(--color-accent-red)' }} /></div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-[var(--text-secondary)]">
                <span>Presupuesto: {fmtRD(p.presupuesto, { compacto: true })}</span>
                <span>Ejecutado: {fmtRD(p.ejecutado, { compacto: true })}</span>
              </div>
              <div className="mt-3 space-y-1">
                {p.hitos.map((h) => (
                  <div key={h.nombre} className="flex items-center gap-1.5 text-[11px]">
                    <span className={h.completado ? 'text-emerald-500' : 'text-slate-300'}>●</span>
                    <span className={h.completado ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}>{h.nombre} — {h.fecha}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto">
          {ESTADOS.map((estado) => (
            <div key={estado} className="min-w-[200px]">
              <div className="text-xs font-semibold uppercase text-[var(--text-muted)] mb-2">{estado} ({PROYECTOS.filter((p) => p.estado === estado).length})</div>
              <div className="space-y-2">
                {PROYECTOS.filter((p) => p.estado === estado).map((p) => (
                  <div key={p.id} className="card p-3">
                    <div className="text-xs font-semibold">{p.nombre}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-[var(--text-muted)]">{p.avance}%</span>
                      <Semaforo nivel={p.semaforo} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end"><DemoTag /></div>
    </div>
  );
}
