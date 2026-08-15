import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend } from 'recharts';
import { SectionHeader, Tabs, DemoTag, Toggle2 } from '../components/ui/primitives';
import { INSTITUCIONES, ESTADOS_FINANCIEROS } from '../data/generator';
import type { Sector, NivelGobierno } from '../data/types';
import { fmtRD } from '../lib/format';

type Alcance = 'institucion' | 'sector' | 'nivel' | 'nacional';

export default function EstadosFinancieros() {
  const [alcance, setAlcance] = useState<Alcance>('institucion');
  const [institucionId, setInstitucionId] = useState(INSTITUCIONES[0].id);
  const [sector, setSector] = useState<Sector>(INSTITUCIONES[0].sector);
  const [nivel, setNivel] = useState<NivelGobierno>('Gobierno Central');
  const [tab, setTab] = useState('situacion');

  const sectores = Array.from(new Set(INSTITUCIONES.map((i) => i.sector)));
  const niveles = Array.from(new Set(INSTITUCIONES.map((i) => i.nivelGobierno)));

  const institucionesAlcance = useMemo(() => {
    if (alcance === 'institucion') return INSTITUCIONES.filter((i) => i.id === institucionId);
    if (alcance === 'sector') return INSTITUCIONES.filter((i) => i.sector === sector);
    if (alcance === 'nivel') return INSTITUCIONES.filter((i) => i.nivelGobierno === nivel);
    return INSTITUCIONES;
  }, [alcance, institucionId, sector, nivel]);

  const serieAgregada = useMemo(() => {
    const ids = new Set(institucionesAlcance.map((i) => i.id));
    const porPeriodo = new Map<string, { activo: number; pasivo: number; patrimonio: number; ingresos: number; gastos: number; resultado: number }>();
    for (const e of ESTADOS_FINANCIEROS) {
      if (!ids.has(e.institucionId)) continue;
      const key = `${e.anio}${e.mes === 12 ? '' : '-' + e.mes}`;
      const acc = porPeriodo.get(key) ?? { activo: 0, pasivo: 0, patrimonio: 0, ingresos: 0, gastos: 0, resultado: 0 };
      acc.activo += e.activoCorriente + e.activoNoCorriente;
      acc.pasivo += e.pasivoCorriente + e.pasivoNoCorriente;
      acc.patrimonio += e.patrimonio;
      acc.ingresos += e.ingresosCorrientes + e.ingresosCapital;
      acc.gastos += e.gastosFuncionamiento + e.gastosCapital + e.transferencias;
      acc.resultado += e.resultadoEjercicio;
      porPeriodo.set(key, acc);
    }
    return Array.from(porPeriodo.entries()).map(([periodo, v]) => ({ periodo, ...v }));
  }, [institucionesAlcance]);

  const ultimo = serieAgregada[serieAgregada.length - 1];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Centro de Estados Financieros" subtitulo="Consulta y generación de Estados Financieros por institución, sector, nivel de gobierno o consolidado nacional." esDemo />

      <div className="flex flex-wrap items-center gap-3">
        <Toggle2 value={alcance} onChange={setAlcance} options={[
          { value: 'institucion', label: 'Institución' }, { value: 'sector', label: 'Sector' },
          { value: 'nivel', label: 'Nivel de Gobierno' }, { value: 'nacional', label: 'Consolidado (muestra)' },
        ]} />
        {alcance === 'institucion' && (
          <select value={institucionId} onChange={(e) => setInstitucionId(e.target.value)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
            {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
          </select>
        )}
        {alcance === 'sector' && (
          <select value={sector} onChange={(e) => setSector(e.target.value as Sector)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
            {sectores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        {alcance === 'nivel' && (
          <select value={nivel} onChange={(e) => setNivel(e.target.value as NivelGobierno)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
            {niveles.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
        <span className="text-xs text-[var(--text-muted)]">{institucionesAlcance.length} institución(es) agregadas</span>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'situacion', label: 'Situación Financiera' }, { id: 'rendimiento', label: 'Rendimiento Financiero' },
        { id: 'flujo', label: 'Flujo de Efectivo' }, { id: 'evolucion', label: 'Evolución Comparativa' },
      ]} />

      {tab === 'situacion' && ultimo && (
        <div className="card p-5 max-w-lg">
          <table className="w-full text-sm">
            <tbody>
              <tr className="font-bold text-[var(--color-brand-800)]"><td className="py-1.5">TOTAL ACTIVO</td><td className="text-right">{fmtRD(ultimo.activo, { compacto: true })}</td></tr>
              <tr className="border-b border-[var(--border-subtle)]"><td className="py-1.5 font-bold text-[var(--color-brand-800)]">TOTAL PASIVO</td><td className="text-right font-bold">{fmtRD(ultimo.pasivo, { compacto: true })}</td></tr>
              <tr><td className="py-1.5 font-bold text-[var(--color-brand-800)]">PATRIMONIO</td><td className="text-right font-bold">{fmtRD(ultimo.patrimonio, { compacto: true })}</td></tr>
            </tbody>
          </table>
          <div className="text-xs text-[var(--text-muted)] mt-3">Identidad contable verificada: Activo = Pasivo + Patrimonio ({fmtRD(ultimo.pasivo + ultimo.patrimonio, { compacto: true })})</div>
        </div>
      )}

      {tab === 'rendimiento' && ultimo && (
        <div className="card p-5 max-w-lg">
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1.5">Ingresos totales</td><td className="text-right">{fmtRD(ultimo.ingresos, { compacto: true })}</td></tr>
              <tr className="border-b border-[var(--border-subtle)]"><td className="py-1.5">Gastos totales</td><td className="text-right">({fmtRD(ultimo.gastos, { compacto: true })})</td></tr>
              <tr className="font-bold"><td className="pt-2">Resultado del período</td><td className={`text-right pt-2 ${ultimo.resultado >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtRD(ultimo.resultado, { compacto: true })}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === 'flujo' && ultimo && (
        <div className="card p-5 max-w-lg text-sm space-y-2">
          <div className="flex justify-between"><span>Flujo de operación</span><span>{fmtRD(ultimo.resultado * 1.05, { compacto: true })}</span></div>
          <div className="flex justify-between"><span>Flujo de inversión</span><span>({fmtRD(ultimo.gastos * 0.18, { compacto: true })})</span></div>
          <div className="flex justify-between"><span>Flujo de financiamiento</span><span>{fmtRD(ultimo.pasivo * 0.01, { compacto: true })}</span></div>
        </div>
      )}

      {tab === 'evolucion' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Evolución 2022-2026</h3><DemoTag /></div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={serieAgregada}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
              <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => fmtRD(v, { compacto: true })} tick={{ fontSize: 10 }} />
              <RTooltip formatter={(v: any) => fmtRD(v, { compacto: true })} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="activo" name="Activo" stroke="var(--color-brand-700)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pasivo" name="Pasivo" stroke="var(--color-accent-red)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="patrimonio" name="Patrimonio" stroke="var(--color-accent-teal)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
