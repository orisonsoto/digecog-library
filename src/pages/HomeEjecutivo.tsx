import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  BarChart, Bar, Cell,
} from 'recharts';
import {
  Landmark, ShieldCheck, FileStack, Database, Gauge, TriangleAlert, Building2, Sparkles,
} from 'lucide-react';
import { SectionHeader, KpiCard, Badge, DemoTag, RealTag } from '../components/ui/primitives';
import {
  INSTITUCIONES, SISACNOC_EVALUACIONES, ERIR_REGISTROS, ALERTAS, CALIDAD_DATOS,
  INDICADORES_POA, KPI_ESCALA_NACIONAL, estadosFinancierosDeInstitucion,
} from '../data/generator';
import { fmtRD, fmtPct, fmtNum } from '../lib/format';
import { MESES_NOMBRE } from '../data/periodos';

export default function HomeEjecutivo() {
  const navigate = useNavigate();

  const conScg = INSTITUCIONES.filter((i) => i.scgImplementado).length;
  const pctScg = (conScg / INSTITUCIONES.length) * 100;

  const sisacnocActual2026 = SISACNOC_EVALUACIONES.filter((s) => s.anio === 2026);
  const cumplimientoPromedio = sisacnocActual2026.length
    ? sisacnocActual2026.reduce((a, s) => a + s.cumplimientoGeneral, 0) / sisacnocActual2026.length
    : 0;
  const criticas = new Set(sisacnocActual2026.filter((s) => s.categoria === 'Crítico').map((s) => s.institucionId)).size;

  const erirIntegrados2025 = ERIR_REGISTROS.filter((e) => e.anio === 2025 && e.estado === 'Publicado').length;
  const erirTotal2025 = ERIR_REGISTROS.filter((e) => e.anio === 2025).length;

  const calidadPromedio = CALIDAD_DATOS.length ? CALIDAD_DATOS.reduce((a, c) => a + c.indiceGeneral, 0) / CALIDAD_DATOS.length : 0;
  const alertasCriticas = ALERTAS.filter((a) => a.severidad === 'Crítica' && !a.atendida).length;

  const indicadorScg = INDICADORES_POA.find((i) => i.id === 'IND-REAL-01')!;
  const dataScg = useMemo(() => indicadorScg.avanceMensual.map((v, i) => ({ mes: MESES_NOMBRE[i], avance: v })), [indicadorScg]);

  const topInstituciones = useMemo(() => {
    return INSTITUCIONES.map((i) => {
      const efs = estadosFinancierosDeInstitucion(i.id);
      const u = efs[efs.length - 1];
      return { nombre: i.siglas || i.nombre.slice(0, 14), activo: u.activoCorriente + u.activoNoCorriente, id: i.id, nivel: i.nivelGobierno };
    }).sort((a, b) => b.activo - a.activo).slice(0, 8);
  }, []);

  const volumenTotal = useMemo(() => {
    return INSTITUCIONES.reduce((sum, i) => {
      const efs = estadosFinancierosDeInstitucion(i.id);
      const u = efs[efs.length - 1];
      return sum + u.activoCorriente + u.activoNoCorriente;
    }, 0);
  }, []);

  return (
    <div className="space-y-5">
      <SectionHeader
        titulo="Centro de Mando Ejecutivo"
        subtitulo='"Dirigir el Sistema de Contabilidad del Sector Público para la consolidación, transparencia y la efectiva toma de decisiones de las finanzas públicas." — Misión DIGECOG 2025-2028'
        acciones={<button onClick={() => navigate('/mia')} className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 text-white" style={{ background: 'var(--color-brand-700)' }}><Sparkles size={13} /> Preguntar a Mía</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Instituciones monitoreadas" valor={fmtNum(KPI_ESCALA_NACIONAL.institucionesMonitoreadas)} subtitulo={`Muestra navegable: ${KPI_ESCALA_NACIONAL.institucionesMuestraReal}`} icono={<Landmark size={18} />} tono="brand" />
        <KpiCard titulo="Con SCG implementado" valor={fmtPct(pctScg)} subtitulo="Meta PEI 2026: 45%" tendencia={{ valor: pctScg - 39, label: 'vs. línea base 2024' }} icono={<Building2 size={18} />} tono="brand" esDemo={false} />
        <KpiCard titulo="Cumplimiento SISACNOC" valor={fmtPct(cumplimientoPromedio)} subtitulo={`${criticas} instituciones críticas`} icono={<ShieldCheck size={18} />} tono="brand" />
        <KpiCard titulo="ERIR integrado 2025" valor={`${erirIntegrados2025}/${erirTotal2025}`} subtitulo="Instituciones publicadas" icono={<FileStack size={18} />} tono="brand" />
        <KpiCard titulo="Volumen financiero analizado" valor={fmtRD(KPI_ESCALA_NACIONAL.volumenFinancieroAnalizadoRD, { compacto: true })} subtitulo={`Muestra: ${fmtRD(volumenTotal, { compacto: true })}`} icono={<Database size={18} />} tono="brand" />
        <KpiCard titulo="Calidad promedio del dato" valor={fmtPct(calidadPromedio)} subtitulo="Índice general (6 dimensiones)" icono={<Gauge size={18} />} tono="brand" />
        <KpiCard titulo="Alertas críticas activas" valor={fmtNum(alertasCriticas)} subtitulo="Sin atender" icono={<TriangleAlert size={18} />} tono="brand" />
        <KpiCard titulo="Validaciones completadas" valor={fmtPct(KPI_ESCALA_NACIONAL.validacionesCompletadasPct)} subtitulo="Escala nacional proyectada" icono={<ShieldCheck size={18} />} tono="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">Avance mensual — Instituciones con SCG implementado</h3>
            <RealTag label="INDICADOR REAL DEL PEI/POA — avance mensual simulado" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-2">Línea base 2024: 39% · Meta 2026: 45% (PEI 2025-2028, tabla de producción priorizada PNPSP)</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dataScg}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[35, 50]} unit="%" />
              <RTooltip formatter={(v: any) => [`${v}%`, 'Avance']} />
              <Line type="monotone" dataKey="avance" stroke="var(--color-brand-600)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Estado del cierre contable {new Date().getFullYear()}</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { etapa: 'Recepción', pct: 92 }, { etapa: 'Validación', pct: 78 }, { etapa: 'Integración', pct: 61 },
              { etapa: 'Consolidación', pct: 44 }, { etapa: 'Publicación', pct: 21 },
            ].map((e) => (
              <div key={e.etapa}>
                <div className="flex justify-between text-xs mb-1"><span>{e.etapa}</span><span className="font-semibold">{e.pct}%</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${e.pct}%`, background: 'linear-gradient(90deg, var(--color-brand-500), var(--color-brand-700))' }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/cierre')} className="mt-3 text-xs font-semibold text-[var(--color-brand-600)] hover:underline">Ver Centro de Control del Cierre Fiscal →</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Ranking — Mayor volumen de activos (muestra)</h3>
            <DemoTag />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topInstituciones} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmtRD(v, { compacto: true })} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="nombre" width={90} tick={{ fontSize: 11 }} />
              <RTooltip formatter={(v: any) => fmtRD(v, { compacto: true })} />
              <Bar dataKey="activo" radius={[0, 6, 6, 0]} cursor="pointer" onClick={(d: any) => navigate(`/institucion/${d.id}`)}>
                {topInstituciones.map((_, i) => <Cell key={i} fill={i < 3 ? 'var(--color-brand-700)' : 'var(--color-brand-400)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Alertas críticas recientes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {ALERTAS.filter((a) => a.severidad === 'Crítica').slice(0, 6).map((a) => {
              const inst = a.institucionId ? INSTITUCIONES.find((i) => i.id === a.institucionId) : undefined;
              return (
                <div key={a.id} className="text-xs border-l-2 border-red-400 pl-2.5 py-0.5">
                  <div className="font-medium">{inst?.siglas || a.modulo}</div>
                  <div className="text-[var(--text-secondary)]">{a.mensaje}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate('/alertas')} className="mt-3 text-xs font-semibold text-[var(--color-brand-600)] hover:underline">Ver Centro de Alertas →</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Monitor Nacional', to: '/monitor', icon: Landmark },
          { label: 'Explorador Contable', to: '/contabilidad', icon: Database },
          { label: 'SISACNOC 360°', to: '/sisacnoc', icon: ShieldCheck },
          { label: 'ERIR', to: '/erir', icon: FileStack },
          { label: 'Analítica Financiera', to: '/analitica', icon: Gauge },
          { label: 'Empresas Públicas', to: '/empresas-publicas', icon: Building2 },
        ].map((acc) => (
          <button key={acc.to} onClick={() => navigate(acc.to)} className="card p-3.5 flex flex-col items-center gap-1.5 text-center hover:border-[var(--color-brand-400)] hover:-translate-y-0.5 transition-transform">
            <acc.icon size={20} className="text-[var(--color-brand-600)]" />
            <span className="text-xs font-medium">{acc.label}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-end"><Badge tono="neutral">Corte: 10/08/2026 — Contexto Maestro Institucional DIGECOG v1.0</Badge></div>
    </div>
  );
}
