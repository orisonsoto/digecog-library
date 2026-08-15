import { SectionHeader, Badge, RealTag, DemoTag } from '../components/ui/primitives';

const OBJETIVOS_CALIDAD = [
  'Eficiencia y efectividad del Sistema de Contabilidad Gubernamental',
  'Interacción efectiva con grupos de interés',
  'Transparencia y rendición de cuentas',
  'Fortalecimiento del talento humano y la cultura de excelencia',
];
const OBJETIVOS_ANTISOBORNO = [
  'Fortalecer la cultura de integridad institucional',
  'Mitigar riesgos de soborno e incumplimiento',
  'Fortalecer la gestión de denuncias',
  'Incrementar la vigilancia y operatividad del sistema',
];

export default function Sig() {
  return (
    <div className="space-y-4">
      <SectionHeader titulo="Sistema Integrado de Gestión" subtitulo="Calidad (ISO 9001:2015), Antisoborno (ISO 37001) y Cumplimiento (ISO 37301)." />
      <div className="flex justify-end"><RealTag label="Normas, objetivos y procesos citados en el Contexto Maestro Institucional §9" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <Badge tono="info">ISO 9001:2015</Badge>
          <h3 className="font-semibold text-sm mt-2 mb-2">Objetivos de calidad</h3>
          <ul className="text-sm space-y-1.5 list-disc pl-5 text-[var(--text-secondary)]">
            {OBJETIVOS_CALIDAD.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </div>
        <div className="card p-4">
          <Badge tono="alerta">ISO 37001 / ISO 37301</Badge>
          <h3 className="font-semibold text-sm mt-2 mb-2">Objetivos antisoborno y cumplimiento</h3>
          <ul className="text-sm space-y-1.5 list-disc pl-5 text-[var(--text-secondary)]">
            {OBJETIVOS_ANTISOBORNO.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Procesos dentro del alcance del SIG (según Política de Salidas No Conformes)</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {['Compras y Contrataciones', 'Verificación de Estados Financieros', 'Elaboración y actualización de normativas contables', 'Capacitación y asistencia técnica', 'Elaboración del ERIR', 'Análisis de calidad, consistencia y coherencia de la información'].map((p) => (
            <span key={p} className="rounded-full border border-[var(--border-subtle)] px-3 py-1 bg-slate-50">{p}</span>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Panel de auditorías y hallazgos</h3><DemoTag /></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[{ l: 'Auditorías realizadas 2026', v: '3' }, { l: 'No conformidades abiertas', v: '2' }, { l: 'Salidas no conformes tratadas', v: '5' }, { l: 'Acciones correctivas cerradas', v: '9' }].map((k) => (
            <div key={k.l} className="rounded-lg border border-[var(--border-subtle)] p-3">
              <div className="text-xl font-bold text-[var(--color-brand-700)]">{k.v}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
