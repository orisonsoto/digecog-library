import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from 'recharts';
import { SectionHeader, Badge, Toggle2, RealTag, DemoTag } from '../components/ui/primitives';
import { INDICADORES_POA } from '../data/generator';
import { MESES_NOMBRE } from '../data/periodos';

export default function Poa() {
  const [eje, setEje] = useState<'todos' | '1' | '2'>('todos');
  const indicadores = INDICADORES_POA.filter((i) => eje === 'todos' || i.eje === Number(eje));

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Plan Operativo Anual 2026" subtitulo="Operacionalización anual del PEI: eje, objetivo estratégico, objetivo operativo, producto, indicador, línea base, meta y avance mensual." />

      <Toggle2 value={eje} onChange={setEje} options={[{ value: 'todos', label: 'Ambos ejes' }, { value: '1', label: 'Eje 1' }, { value: '2', label: 'Eje 2' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {indicadores.map((ind) => {
          const dataMes = ind.avanceMensual.map((v, i) => ({ mes: MESES_NOMBRE[i], v }));
          return (
            <div key={ind.id} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <Badge tono="info">Eje {ind.eje}</Badge>
                  <h3 className="font-semibold text-sm mt-1">{ind.indicador}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{ind.objetivoOperativo}</p>
                </div>
                {ind.esReal ? <RealTag /> : <DemoTag />}
              </div>
              <div className="flex gap-4 text-xs my-2">
                <span>Línea base 2024: <strong>{ind.lineaBase2024}</strong></span>
                <span>Meta 2026: <strong>{ind.meta2026}</strong></span>
                <span>Tipo KPI: <strong>{ind.tipoKPI}</strong></span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={dataMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <RTooltip />
                  <Line type="monotone" dataKey="v" stroke="var(--color-brand-600)" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Actividades clave de la planificación 2026</h3>
        <ul className="text-sm space-y-1.5 list-disc pl-5 text-[var(--text-secondary)]">
          <li>Evaluación semestral del PEI</li>
          <li>Actualización de la matriz de grupos de interés</li>
          <li>Actualización del análisis FODA y PESTEL</li>
          <li>Formulación del POA 2027</li>
          <li>Monitoreo periódico del POA y carga de evidencias</li>
          <li>Elaboración del PACC y estructura programática</li>
          <li>Auditorías internas y gestión de riesgos</li>
          <li>Gestión del cambio y políticas transversales</li>
        </ul>
      </div>
    </div>
  );
}
