import { useState } from 'react';
import { SectionHeader, Tabs, Badge, DemoTag } from '../components/ui/primitives';

const IDEAS = [
  { idea: 'Copiloto de IA para redacción de hallazgos SISACNOC', estado: 'En evaluación', viabilidad: 'Alta' },
  { idea: 'Chatbot de atención a entidades reportantes vía WhatsApp', estado: 'Aprobada → Proyecto', viabilidad: 'Media' },
  { idea: 'Firma electrónica avanzada para Estados Financieros', estado: 'En evaluación', viabilidad: 'Alta' },
  { idea: 'Panel público de indicadores en tiempo real', estado: 'Rechazada (temporalmente)', viabilidad: 'Baja' },
];
const CAMBIOS = [
  { iniciativa: 'Migración a DIGECOG 360°', impacto: 'Alto', areas: 'Todas las direcciones misionales', avance: 45 },
  { iniciativa: 'Nuevo Plan de Cuentas v3', impacto: 'Alto', areas: 'Procesamiento Contable, Normas y Procedimientos', avance: 15 },
  { iniciativa: 'Adopción de interoperabilidad SIGEF', impacto: 'Medio', areas: 'Tecnología, Análisis Financiero', avance: 60 },
];
const BENCHMARKS = [
  { institucion: 'Contaduría General de la Nación (Colombia)', practica: 'Sistema Consolidador de Hacienda e Información Financiera Pública (CHIP)', aplicabilidad: 'Alta' },
  { institucion: 'Secretaría de Hacienda y Crédito Público (México)', practica: 'Manual de Contabilidad Gubernamental armonizado', aplicabilidad: 'Media' },
  { institucion: 'Contraloría General de la República (Costa Rica)', practica: 'Sistema Integrado de Información Nacional de Emergencias aplicado a alertas', aplicabilidad: 'Media' },
];

export default function Innovacion() {
  const [tab, setTab] = useState('innovacion');
  return (
    <div className="space-y-4">
      <SectionHeader titulo="Innovación, Gestión del Cambio y Benchmarking" subtitulo="Banco de ideas, iniciativas de transformación y aprendizaje institucional, liderados por Planificación y Desarrollo." esDemo />
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'innovacion', label: 'Innovación' }, { id: 'cambio', label: 'Gestión del Cambio' }, { id: 'benchmark', label: 'Benchmarking' }]} />

      {tab === 'innovacion' && (
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Banco de ideas</h3>
          <div className="space-y-2">
            {IDEAS.map((i) => (
              <div key={i.idea} className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 text-sm">
                <span>{i.idea}</span>
                <div className="flex items-center gap-2">
                  <Badge tono="neutral">Viabilidad: {i.viabilidad}</Badge>
                  <Badge tono={i.estado.includes('Aprobada') ? 'exito' : i.estado.includes('Rechazada') ? 'peligro' : 'info'}>{i.estado}</Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">Criterios de valoración: relevancia estratégica, viabilidad técnica y operativa, innovación y creatividad, sostenibilidad, adaptabilidad, viabilidad financiera y aceptación cultural.</p>
        </div>
      )}

      {tab === 'cambio' && (
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Iniciativas de gestión del cambio</h3>
          {CAMBIOS.map((c) => (
            <div key={c.iniciativa} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">{c.iniciativa}</span><Badge tono={c.impacto === 'Alto' ? 'peligro' : 'alerta'}>Impacto {c.impacto}</Badge></div>
              <div className="text-xs text-[var(--text-secondary)] mb-1">Áreas afectadas: {c.areas}</div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-[var(--color-brand-500)]" style={{ width: `${c.avance}%` }} /></div>
            </div>
          ))}
        </div>
      )}

      {tab === 'benchmark' && (
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Buenas prácticas identificadas</h3>
          <div className="space-y-2">
            {BENCHMARKS.map((b) => (
              <div key={b.institucion} className="rounded-lg border border-[var(--border-subtle)] p-3">
                <div className="font-medium text-sm">{b.institucion}</div>
                <div className="text-xs text-[var(--text-secondary)]">{b.practica}</div>
                <Badge tono="neutral" className="mt-1.5">Aplicabilidad: {b.aplicabilidad}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end"><DemoTag /></div>
    </div>
  );
}
