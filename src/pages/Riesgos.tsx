import { useState } from 'react';
import { SectionHeader, Badge, DemoTag } from '../components/ui/primitives';
import { RIESGOS } from '../data/generator';
import type { Riesgo } from '../data/types';
import clsx from 'clsx';

function colorCelda(prob: number, imp: number) {
  const score = prob * imp;
  if (score >= 15) return 'bg-red-500';
  if (score >= 8) return 'bg-amber-400';
  if (score >= 4) return 'bg-yellow-300';
  return 'bg-emerald-400';
}

export default function Riesgos() {
  const [seleccionado, setSeleccionado] = useState<Riesgo | null>(null);

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Matriz de Riesgos Institucionales" subtitulo="Gestión integral de riesgos y oportunidades de los procesos misionales de DIGECOG (Planificación y Desarrollo)." esDemo />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-3">Mapa de calor 5×5 (Probabilidad × Impacto)</h3>
          <div className="overflow-x-auto">
            <table className="border-collapse mx-auto">
              <tbody>
                {[5, 4, 3, 2, 1].map((prob) => (
                  <tr key={prob}>
                    <td className="text-[10px] text-[var(--text-muted)] pr-2 text-right w-6">{prob}</td>
                    {[1, 2, 3, 4, 5].map((imp) => {
                      const riesgosCelda = RIESGOS.filter((r) => r.probabilidad === prob && r.impacto === imp);
                      return (
                        <td key={imp} className="p-0.5">
                          <button
                            onClick={() => riesgosCelda[0] && setSeleccionado(riesgosCelda[0])}
                            className={clsx('h-12 w-14 rounded-md flex items-center justify-center text-white text-sm font-bold relative', colorCelda(prob, imp))}
                          >
                            {riesgosCelda.length > 0 && riesgosCelda.length}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td />
                  {[1, 2, 3, 4, 5].map((imp) => <td key={imp} className="text-[10px] text-[var(--text-muted)] text-center pt-1">{imp}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center text-[10px] text-[var(--text-muted)] mt-1">Eje horizontal: Impacto · Eje vertical: Probabilidad</div>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">{seleccionado ? seleccionado.riesgo : 'Seleccione un riesgo en la matriz'}</h3>
          {seleccionado && (
            <div className="text-xs space-y-2 text-[var(--text-secondary)]">
              <div><strong>Proceso:</strong> {seleccionado.proceso}</div>
              <div><strong>Causa:</strong> {seleccionado.causa}</div>
              <div><strong>Consecuencia:</strong> {seleccionado.consecuencia}</div>
              <div><strong>Controles existentes:</strong> {seleccionado.controlesExistentes}</div>
              <div><strong>Efectividad del control:</strong> <Badge tono={seleccionado.efectividadControl === 'Alta' ? 'exito' : seleccionado.efectividadControl === 'Media' ? 'alerta' : 'peligro'}>{seleccionado.efectividadControl}</Badge></div>
              <div><strong>Tratamiento:</strong> {seleccionado.tratamiento}</div>
              <div><strong>Responsable:</strong> {seleccionado.responsable}</div>
              <div><strong>Estado:</strong> <Badge tono={seleccionado.estado === 'Cerrado' ? 'exito' : seleccionado.estado === 'En tratamiento' ? 'alerta' : 'peligro'}>{seleccionado.estado}</Badge></div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Registro de riesgos</h3><DemoTag /></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-[var(--text-muted)] uppercase text-[10px]"><th className="text-left py-1">Riesgo</th><th className="text-left">Proceso</th><th className="text-center">Prob.</th><th className="text-center">Imp.</th><th className="text-left">Tratamiento</th><th className="text-left">Estado</th></tr></thead>
            <tbody>
              {RIESGOS.map((r) => (
                <tr key={r.id} className="border-t border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--color-brand-50)]" onClick={() => setSeleccionado(r)}>
                  <td className="py-1.5 max-w-xs">{r.riesgo}</td>
                  <td>{r.proceso}</td>
                  <td className="text-center">{r.probabilidad}</td>
                  <td className="text-center">{r.impacto}</td>
                  <td>{r.tratamiento}</td>
                  <td><Badge tono={r.estado === 'Cerrado' ? 'exito' : r.estado === 'En tratamiento' ? 'alerta' : 'peligro'}>{r.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
