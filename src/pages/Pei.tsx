import { SectionHeader, Badge, RealTag } from '../components/ui/primitives';
import { INDICADORES_POA } from '../data/generator';

const VALORES = [
  { valor: 'Transparencia', desc: 'Claridad, apertura, accesibilidad y confianza en la información' },
  { valor: 'Compromiso', desc: 'Responsabilidad con la eficiencia, eficacia y cumplimiento de las funciones' },
  { valor: 'Integridad', desc: 'Actuación honesta, ética, justa y recta' },
  { valor: 'Excelencia', desc: 'Mejora continua, profesionalismo y calidad' },
  { valor: 'Innovación', desc: 'Creatividad, modernización y adopción de tecnologías y mejores prácticas' },
];

export default function Pei() {
  const indicadoresReales = INDICADORES_POA.filter((i) => i.esReal);

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Plan Estratégico Institucional 2025-2028" subtitulo="Jerarquía: Eje → Objetivo Estratégico → Objetivo Operativo → Producto → Indicador → Meta." />
      <div className="flex justify-end"><RealTag label="Misión, visión, valores, ejes e indicadores citados literalmente del PEI 2025-2028" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="text-[11px] font-semibold uppercase text-[var(--text-muted)] mb-1">Misión</div>
          <p className="text-sm italic">"Dirigir el Sistema de Contabilidad del Sector Público para la consolidación, transparencia y la efectiva toma de decisiones de las finanzas públicas."</p>
        </div>
        <div className="card p-4">
          <div className="text-[11px] font-semibold uppercase text-[var(--text-muted)] mb-1">Visión</div>
          <p className="text-sm italic">"Ser modelo de implementación de las mejores prácticas contables del Sector Público, que integra estándares internacionales en todo el Sistema de Contabilidad."</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-3">Valores institucionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {VALORES.map((v) => (
            <div key={v.valor} className="rounded-lg border border-[var(--border-subtle)] p-2.5 text-center">
              <div className="font-semibold text-sm text-[var(--color-brand-700)]">{v.valor}</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-1">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <Badge tono="info">Eje Estratégico 1</Badge>
          <h3 className="font-bold text-sm mt-2">Sistema de Contabilidad Gubernamental Fortalecido, Moderno y Eficaz</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Resultados misionales y externos vinculados al ejercicio de la rectoría del SCG.</p>
        </div>
        <div className="card p-4">
          <Badge tono="info">Eje Estratégico 2</Badge>
          <h3 className="font-bold text-sm mt-2">Capacidades y procesos internos orientados a resultados</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Fortalecimiento de capacidades institucionales necesarias para sustentar la misión.</p>
        </div>
      </div>

      <div className="card p-3 text-xs bg-amber-50 border-amber-200 text-amber-800">
        ⚠ Nota de consistencia documental: la sección narrativa de presentación del PEI hace referencia a "seis ejes estratégicos", mientras que la Matriz de Resultados, la matriz operativa y el POA 2026 operan con dos ejes. Este prototipo utiliza la estructura de las matrices aprobadas, manteniendo la referencia a "seis ejes" como inconsistencia documental pendiente de validación (ver Contexto Maestro §6).
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-3">Indicadores de producción priorizada (PNPSP) — reales</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-[var(--text-muted)] uppercase">
              <th className="text-left py-1">Indicador</th><th className="text-right">L. Base 2024</th><th className="text-right">2025</th><th className="text-right">2026</th><th className="text-right">2027</th><th className="text-right">2028</th>
            </tr>
          </thead>
          <tbody>
            {indicadoresReales.map((i) => (
              <tr key={i.id} className="border-t border-[var(--border-subtle)]">
                <td className="py-1.5">{i.indicador}</td>
                <td className="text-right">{i.lineaBase2024}</td>
                <td className="text-right">{i.meta2025}</td>
                <td className="text-right font-semibold">{i.meta2026}</td>
                <td className="text-right">{i.meta2027}</td>
                <td className="text-right">{i.meta2028}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
